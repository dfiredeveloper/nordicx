import { SUPPORTED_CHAINS } from './constants';
import { getApiKey, isTradingEnabled } from './config';
import { type WalletClient, type Hash, type Chain } from 'viem';
import { Transaction } from '@solana/web3.js';

// Define chain configuration type for EVM chains
interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
}

// Real trading service for live pricing and swap execution
export class RealTradingService {
  private static instance: RealTradingService;
  
  private constructor() {}
  
  public static getInstance(): RealTradingService {
    if (!RealTradingService.instance) {
      RealTradingService.instance = new RealTradingService();
    }
    return RealTradingService.instance;
  }

  // Get real-time swap quote from 1inch API
  async get1inchQuote(
    fromToken: string,
    toToken: string,
    amount: string,
    chainId: number,
    slippage: number = 1
  ) {
    try {
      // Check if trading is enabled
      if (!isTradingEnabled()) {
        throw new Error('Trading not fully enabled - API keys required');
      }

      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
      if (!chain) throw new Error('Unsupported chain');

      const apiKey = getApiKey('ONEINCH_API_KEY');
      const url = `https://api.1inch.dev/swap/v6.0/${chainId}/quote?src=${fromToken}&dst=${toToken}&amount=${amount}&slippage=${slippage}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`1inch API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        fromToken: data.src,
        toToken: data.dst,
        amountIn: data.amount,
        amountOut: data.toAmount,
        gasEstimate: data.gas,
        priceImpact: data.priceImpact,
        provider: '1inch',
        to: data.tx?.to,
        data: data.tx?.data,
        value: data.tx?.value || '0'
      };
    } catch (error) {
      console.error('1inch quote error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get real-time swap quote from Paraswap API
  async getParaswapQuote(
    fromToken: string,
    toToken: string,
    amount: string,
    chainId: number,
    slippage: number = 1
  ) {
    try {
      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
      if (!chain) throw new Error('Unsupported chain');

      const url = `https://apiv5.paraswap.io/prices?srcToken=${fromToken}&destToken=${toToken}&amount=${amount}&srcDecimals=18&destDecimals=6&side=SELL&network=${chainId}&slippage=${slippage}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Paraswap API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.priceRoute) {
        const route = data.priceRoute;
        return {
          success: true,
          fromToken: route.srcToken,
          toToken: route.destToken,
          amountIn: route.srcAmount,
          amountOut: route.destAmount,
          gasEstimate: route.gasCost,
          priceImpact: route.priceImpact,
          provider: 'Paraswap',
          to: route.contractAddress,
          data: route.data,
          value: route.srcAmount === '0' ? '0' : route.srcAmount
        };
      } else {
        throw new Error('No price route available');
      }
    } catch (error) {
      console.error('Paraswap quote error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get best quote from multiple aggregators
  async getBestQuote(
    fromToken: string,
    toToken: string,
    amount: string,
    chainId: number,
    slippage: number = 1
  ) {
    try {
      // Get quotes from multiple sources
      const [oneInchQuote, paraswapQuote] = await Promise.all([
        this.get1inchQuote(fromToken, toToken, amount, chainId, slippage),
        this.getParaswapQuote(fromToken, toToken, amount, chainId, slippage)
      ]);

      const validQuotes = [oneInchQuote, paraswapQuote].filter(quote => quote.success);
      
      if (validQuotes.length === 0) {
        throw new Error('No valid quotes available');
      }

      // Find the best quote (highest output amount)
      const bestQuote = validQuotes.reduce((best, current) => {
        if (!best) return current;
        const bestAmount = parseFloat(best.amountOut || '0');
        const currentAmount = parseFloat(current.amountOut || '0');
        return currentAmount > bestAmount ? current : best;
      });

      return bestQuote;
    } catch (error) {
      console.error('Best quote error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Execute a swap transaction using the provided wallet client
   * @param quote The swap quote from getBestQuote
   * @param walletClient The connected wallet client (EVM)
   * @param solanaSignTransaction Optional Solana sign transaction function
   * @param userAddress The user's wallet address
   * @param chainId The chain ID for the transaction
   * @param slippage The slippage tolerance percentage (default: 1%)
   */
  async executeSwap(
    quote: any,
    walletClient?: WalletClient,
    solanaSignTransaction?: (tx: Transaction) => Promise<Transaction>,
    userAddress?: string,
    chainId?: number,
    _slippage: number = 1
  ): Promise<{
    success: boolean;
    txHash?: string;
    quote?: any;
    error?: string;
  }> {
    try {
      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
      if (!chain) throw new Error('Unsupported chain');

      if (!quote.success) {
        throw new Error(quote.error || 'Invalid swap quote');
      }

      if (!chainId) {
        throw new Error('Chain ID is required');
      }

      // Handle EVM chains
      if (walletClient) {
        if (!userAddress) {
          throw new Error('User address is required for EVM transactions');
        }
        
        const txHash = await walletClient.sendTransaction({
          account: userAddress as `0x${string}`,
          to: quote.to as `0x${string}`,
          data: quote.data as `0x${string}`,
          value: BigInt(quote.value || '0'),
          gas: BigInt(quote.gasEstimate || '150000'),
          chain: this.getChainConfig(chainId)
        });
        
        return { 
          success: true, 
          txHash,
          quote
        };
      }
      // Handle Solana
      else if (solanaSignTransaction && quote.data) {
        const transaction = Transaction.from(Buffer.from(quote.data, 'base64'));
        const signedTx = await solanaSignTransaction(transaction);
        const serializedTx = signedTx.serialize();
        
        return { 
          success: true, 
          txHash: serializedTx.toString('hex'),
          quote
        };
      } else {
        throw new Error('No wallet client or signer provided');
      }
    } catch (error) {
      console.error('Execute swap error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get real-time token prices
  async getTokenPrice(tokenAddress: string, chainId: number): Promise<{
    success: boolean;
    price?: number;
    timestamp?: number;
    error?: string;
  }> {
    try {
      // Use CoinGecko API for price data
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`);
      
      if (!response.ok) {
        throw new Error(`Price API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        price: data[tokenAddress.toLowerCase()]?.usd || 0,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Token price error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get chain configuration for the given chain ID
  private getChainConfig(chainId: number): Chain {
    // Find the chain by ID
    const chainEntry = Object.entries(SUPPORTED_CHAINS).find(
      ([, config]) => config.chainId === chainId
    );
    
    if (!chainEntry) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    const [chainName, chainConfig] = chainEntry;
    const nativeCurrencySymbol = chainConfig.nativeCurrency;
    
    return {
      id: chainConfig.chainId,
      name: chainConfig.name,
      network: chainName,
      nativeCurrency: {
        name: nativeCurrencySymbol,
        symbol: nativeCurrencySymbol,
        decimals: 18
      },
      rpcUrls: {
        default: { http: [chainConfig.rpcUrl] },
        public: { http: [chainConfig.rpcUrl] }
      }
    } as Chain;
  }
}

export default RealTradingService.getInstance();
