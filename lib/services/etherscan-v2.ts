// Etherscan V2 API service for multi-chain token analytics
// Supports 50+ chains including Blast (81457) and Sonic (146)

export interface TokenHolders {
  address: string;
  balance: string;
  share: number;
}

export interface TransactionData {
  buyTx1m: number;
  sellTx1m: number;
  totalTx1m: number;
  volume1m: number;
}

export interface LiquidityData {
  liquidity: number;
  liquidityUSD: number;
  poolAddress: string;
}

export interface TokenAnalytics {
  holdersCount: number;
  transactionData: TransactionData;
  liquidityData: LiquidityData;
}

// Etherscan V2 API response interfaces
interface EtherscanV2Holder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
  TokenHolderShare: string;
}

interface EtherscanV2Transaction {
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  hash: string;
}

// Chain ID mappings for Etherscan V2
const CHAIN_IDS: Record<string, string> = {
  'eth': '1',
  'ethereum': '1',
  'bsc': '56',
  'binance': '56',
  'polygon': '137',
  'arbitrum': '42161',
  'optimism': '10',
  'base': '8453',
  'blast': '81457',
  'sonic': '146',
  'avalanche': '43114',
  'fantom': '250',
  'cronos': '25',
  'polygon_zkevm': '1101',
  'linea': '59144',
  'mantle': '5000',
  'scroll': '534352',
  'zksync': '324',
  'op_bnb': '204',
  'manta': '169',
  'kroma': '255',
  'fraxtal': '252',
  'mode': '34443',
  'pgn': '424',
  'zora': '7777777',
  'lisk': '1890',
  'lukso': '42',
  'celo': '42220',
  'gnosis': '100',
  'klaytn': '8217',
  'moonbeam': '1284',
  'moonriver': '1285',
  'harmony': '1666600000',
  'iotex': '4689',
  'metis': '1088',
  'boba': '288',
  'aurora': '1313161554',
  'astar': '592',
  'shiden': '336',
  'shibuya': '81',
  'acala': '787',
  'karura': '686',
  'khala': '2004',
  'kilt': '20842',
  'polkadot': '0',
  'kusama': '2',
  'westend': '1024',
  'rococo': '2030'
};

class EtherscanV2Service {
  private apiKey: string;
  private baseUrl: string = 'https://api.etherscan.io/api';

  constructor() {
    this.apiKey = process.env.ETHERSCAN_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ETHERSCAN_API_KEY not found. Some features may be limited.');
    }
  }

  private getChainId(chain: string): string {
    const chainId = CHAIN_IDS[chain.toLowerCase()];
    if (!chainId) {
      console.warn(`Chain ID not found for: ${chain}. Using Ethereum as fallback.`);
      return '1';
    }
    return chainId;
  }

  // Get token holders count using Etherscan V2
  async getHoldersCount(tokenAddress: string, chain: string): Promise<number> {
    try {
      const chainId = this.getChainId(chain);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        `${this.baseUrl}?module=token&action=tokenholderlist&chainid=${chainId}&contractaddress=${tokenAddress}&apikey=${this.apiKey}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Etherscan V2 API Error: ${response.status} ${response.statusText}`);
        return 0;
      }

      const data = await response.json();

      // Check for API Pro requirement
      if (data.status === '0' && data.result && typeof data.result === 'string' && data.result.includes('API Pro')) {
        console.warn(`Etherscan V2 API Pro required for holders count on chain ${chain}`);
        return 0;
      }

      if (data.status === '1' && data.result) {
        return data.result.length;
      }

      return 0;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Etherscan V2 API timeout after 30 seconds');
      } else {
        console.error('Etherscan V2 API Error:', error);
      }
      return 0;
    }
  }

  // Get token holders list using Etherscan V2
  async getTokenHolders(tokenAddress: string, chain: string): Promise<TokenHolders[]> {
    try {
      const chainId = this.getChainId(chain);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        `${this.baseUrl}?module=token&action=tokenholderlist&chainid=${chainId}&contractaddress=${tokenAddress}&apikey=${this.apiKey}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Etherscan V2 API Error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();

      if (data.status === '1' && data.result) {
        return data.result.map((holder: EtherscanV2Holder) => ({
          address: holder.TokenHolderAddress,
          balance: holder.TokenHolderQuantity,
          share: parseFloat(holder.TokenHolderShare || '0')
        }));
      }

      return [];
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Etherscan V2 API timeout after 30 seconds');
      } else {
        console.error('Etherscan V2 API Error:', error);
      }
      return [];
    }
  }

  // Get token transactions (for transaction data)
  async getTokenTransactions(tokenAddress: string, chain: string): Promise<TransactionData> {
    try {
      const chainId = this.getChainId(chain);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      console.log(`Fetching transactions for token ${tokenAddress} on chain ${chain} (ID: ${chainId})`);

      // Get recent transactions for the token
      const response = await fetch(
        `${this.baseUrl}?module=account&action=tokentx&chainid=${chainId}&contractaddress=${tokenAddress}&apikey=${this.apiKey}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Etherscan V2 API Error: ${response.status} ${response.statusText}`);
        return { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 };
      }

      const data = await response.json();

      if (data.status === '1' && data.result) {
        console.log(`Found ${data.result.length} transactions for ${tokenAddress} on ${chain}`);
        
        // Analyze transactions to determine buy/sell patterns
        const now = Date.now();
        const oneMinuteAgo = now - (60 * 1000);
        
        const recentTxs = data.result.filter((tx: EtherscanV2Transaction) => {
          const txTime = parseInt(tx.timeStamp) * 1000;
          return txTime > oneMinuteAgo;
        });

        console.log(`Found ${recentTxs.length} recent transactions (last minute) for ${tokenAddress} on ${chain}`);

        // Simple heuristic: transfers to contract = sells, transfers from contract = buys
        let buyTx = 0;
        let sellTx = 0;

        recentTxs.forEach((tx: EtherscanV2Transaction) => {
          if (tx.to?.toLowerCase() === tokenAddress.toLowerCase()) {
            sellTx++;
          } else if (tx.from?.toLowerCase() === tokenAddress.toLowerCase()) {
            buyTx++;
          }
        });

        return {
          buyTx1m: buyTx,
          sellTx1m: sellTx,
          totalTx1m: buyTx + sellTx,
          volume1m: recentTxs.reduce((sum: number, tx: EtherscanV2Transaction) => sum + (parseFloat(tx.value) || 0), 0)
        };
      } else if (data.status === '0' && data.message === 'No transactions found') {
        console.log(`No transactions found for token ${tokenAddress} on chain ${chain} - this is normal for newer chains or low-activity tokens`);
        return { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 };
      }

      return { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Etherscan V2 API timeout after 30 seconds');
      } else {
        console.error('Etherscan V2 API Error:', error);
      }
      return { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 };
    }
  }

  // Get comprehensive token analytics
  async getTokenAnalytics(tokenAddress: string, chain: string): Promise<TokenAnalytics> {
    try {
      const [holdersCount, transactionData] = await Promise.all([
        this.getHoldersCount(tokenAddress, chain),
        this.getTokenTransactions(tokenAddress, chain)
      ]);

      return {
        holdersCount,
        transactionData,
        liquidityData: {
          liquidity: 0, // Etherscan V2 doesn't provide liquidity data
          liquidityUSD: 0,
          poolAddress: ''
        }
      };
    } catch (error) {
      console.error('Error getting token analytics:', error);
      return {
        holdersCount: 0,
        transactionData: { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 },
        liquidityData: { liquidity: 0, liquidityUSD: 0, poolAddress: '' }
      };
    }
  }

  // Test if a chain is supported
  isChainSupported(chain: string): boolean {
    return !!CHAIN_IDS[chain.toLowerCase()];
  }

  // Get supported chains
  getSupportedChains(): string[] {
    return Object.keys(CHAIN_IDS);
  }
}

export const etherscanV2Service = new EtherscanV2Service(); 