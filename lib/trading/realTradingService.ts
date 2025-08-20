import { SUPPORTED_CHAINS } from './constants';
import { getApiKey, isTradingEnabled } from './config';

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

  // Execute swap transaction
  async executeSwap(
    quote: any,
    userAddress: string,
    chainId: number,
    slippage: number = 1
  ) {
    try {
      const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
      if (!chain) throw new Error('Unsupported chain');

      // This would integrate with the actual DEX contracts
      // For now, return the transaction data that the frontend can use
      return {
        success: true,
        transactionData: {
          to: quote.to || '0x...', // Contract address for the swap
          data: quote.data || '0x...', // Transaction data
          value: quote.value || '0', // ETH value if swapping ETH
          gasLimit: quote.gasEstimate || '150000',
          chainId: chainId
        },
        quote: quote
      };
    } catch (error) {
      console.error('Execute swap error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get real-time token prices
  async getTokenPrice(tokenAddress: string, chainId: number) {
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
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get chain name for 1inch API
  private getChainNameFor1inch(chainId: number): string {
    switch (chainId) {
      case 1: return 'ethereum';
      case 56: return 'bsc';
      case 8453: return 'base';
      case 81457: return 'blast';
      default: return 'ethereum';
    }
  }
}

export default RealTradingService.getInstance();
