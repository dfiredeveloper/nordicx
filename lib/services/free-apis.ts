import { etherscanV2Service } from './etherscan-v2';

// Free API services for crypto data
// No paid subscriptions required

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

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    h1: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
  };
  priceChange: {
    h1: number;
    h24: number;
    m5: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
}

interface EtherscanHolderResponse {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
  TokenHolderShare: string;
}

interface BscScanHolderResponse {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
  TokenHolderShare: string;
}

interface SolscanHolderResponse {
  owner: string;
  amount: string;
  percentage: number;
}

class FreeAPIService {
  // Etherscan API for Ethereum holders
  async getEthereumHolders(tokenAddress: string): Promise<TokenHolders[]> {
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        // Try the tokenholderlist endpoint first (requires Pro subscription)
        const response = await fetch(
          `https://api.etherscan.io/api?module=token&action=tokenholderlist&contractaddress=${tokenAddress}&apikey=${process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
            },
            keepalive: true
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.error(`Etherscan API Error: ${response.status} ${response.statusText}`);
          return [];
        }
        
        const data = await response.json();
        
        // Check if we got a Pro subscription required error
        if (data.status === '0' && data.message === 'NOTOK' && data.result && data.result.includes('API Pro')) {
          console.warn('Etherscan API Pro subscription required for holders count. Using fallback.');
          return [];
        }
        
        if (data.status === '1' && data.result) {
          return data.result.map((holder: EtherscanHolderResponse) => ({
            address: holder.TokenHolderAddress,
            balance: holder.TokenHolderQuantity,
            share: parseFloat(holder.TokenHolderShare)
          }));
        }
        return [];
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error(`Etherscan API timeout after 30 seconds (attempt ${attempt}/${maxRetries})`);
        } else {
          console.error(`Etherscan API Error (attempt ${attempt}/${maxRetries}):`, error);
        }
        
        // If this is the last attempt, don't wait
        if (attempt < maxRetries) {
          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    console.error('Etherscan API failed after all retries');
    return [];
  }

  // BscScan API for BSC holders
  async getBSCHolders(tokenAddress: string): Promise<TokenHolders[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const response = await fetch(
        `https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=${tokenAddress}&apikey=${process.env.BSCSCAN_API_KEY || 'YourApiKeyToken'}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          },
          keepalive: true
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`BscScan API Error: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result.map((holder: BscScanHolderResponse) => ({
          address: holder.TokenHolderAddress,
          balance: holder.TokenHolderQuantity,
          share: parseFloat(holder.TokenHolderShare)
        }));
      }
      return [];
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('BscScan API timeout after 20 seconds');
      } else {
        console.error('BscScan API Error:', error);
      }
      return [];
    }
  }

  // Solscan API for Solana holders
  async getSolanaHolders(tokenAddress: string): Promise<TokenHolders[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const response = await fetch(
        `https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}&limit=100`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          },
          keepalive: true
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Solscan API Error: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      
      if (data.data) {
        return data.data.map((holder: SolscanHolderResponse) => ({
          address: holder.owner,
          balance: holder.amount,
          share: holder.percentage
        }));
      }
      return [];
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Solscan API timeout after 20 seconds');
      } else {
        console.error('Solscan API Error:', error);
      }
      return [];
    }
  }

  // DexScreener API for transaction data and liquidity
  async getDexScreenerData(tokenAddress: string, chain: string): Promise<{
    transactionData: TransactionData;
    liquidityData: LiquidityData;
    pairs: DexScreenerPair[];
  }> {
    try {
      const chainId = this.getChainId(chain);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
          },
          keepalive: true
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`DexScreener API Error: ${response.status} ${response.statusText}`);
        return {
          transactionData: { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 },
          liquidityData: { liquidity: 0, liquidityUSD: 0, poolAddress: '' },
          pairs: []
        };
      }
      
      const data = await response.json();
      
      if (data.pairs) {
        const chainPairs = data.pairs.filter((pair: DexScreenerPair) => 
          pair.chainId === chainId
        );
        
        if (chainPairs.length > 0) {
          const mainPair = chainPairs[0]; // Get the main pair
          
          return {
            transactionData: {
              buyTx1m: mainPair.txns.h1.buys || 0,
              sellTx1m: mainPair.txns.h1.sells || 0,
              totalTx1m: (mainPair.txns.h1.buys || 0) + (mainPair.txns.h1.sells || 0),
              volume1m: mainPair.volume.h1 || 0
            },
            liquidityData: {
              liquidity: mainPair.liquidity.usd || 0,
              liquidityUSD: mainPair.liquidity.usd || 0,
              poolAddress: mainPair.pairAddress
            },
            pairs: chainPairs
          };
        }
      }
      
      return {
        transactionData: { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 },
        liquidityData: { liquidity: 0, liquidityUSD: 0, poolAddress: '' },
        pairs: []
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('DexScreener API timeout after 15 seconds');
      } else {
        console.error('DexScreener API Error:', error);
      }
      return {
        transactionData: { buyTx1m: 0, sellTx1m: 0, totalTx1m: 0, volume1m: 0 },
        liquidityData: { liquidity: 0, liquidityUSD: 0, poolAddress: '' },
        pairs: []
      };
    }
  }

  // Fetch creator address and contract creation date for EVM tokens
  async getEvmTokenCreator(tokenAddress: string): Promise<{ creator: string | null, createdAt: number | null }> {
    try {
      const apiKey = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
      const url = `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=${apiKey}`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) return { creator: null, createdAt: null };
      const data = await response.json();
      if (data.status === '1' && Array.isArray(data.result) && data.result.length > 0) {
        const info = data.result[0];
        // Get block number and creator address
        const creator = info.contractCreator || null;
        // Fetch block timestamp
        if (info.blockNumber) {
          const blockUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${info.blockNumber}&apikey=${apiKey}`;
          const blockRes = await fetch(blockUrl, { headers: { 'Accept': 'application/json' } });
          if (blockRes.ok) {
            const blockData = await blockRes.json();
            if (blockData.status === '1' && blockData.result && blockData.result.timeStamp) {
              return { creator, createdAt: Number(blockData.result.timeStamp) * 1000 };
            }
          }
        }
        return { creator, createdAt: null };
      }
      return { creator: null, createdAt: null };
    } catch {
      return { creator: null, createdAt: null };
    }
  }

  // Fetch creator address and creation date for Solana tokens
  async getSolanaTokenCreator(tokenAddress: string): Promise<{ creator: string | null, createdAt: number | null }> {
    try {
      const url = `https://public-api.solscan.io/token/meta?tokenAddress=${tokenAddress}`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) return { creator: null, createdAt: null };
      const data = await response.json();
      const creator = data.mintAuthority || data.owner || null;
      const createdAt = data.createdAt ? Number(data.createdAt) * 1000 : null;
      return { creator, createdAt };
    } catch {
      return { creator: null, createdAt: null };
    }
  }

  // Get holders count for any chain
  async getHoldersCount(tokenAddress: string, chain: string): Promise<number> {
    try {
      let holders: TokenHolders[] = [];
      
      switch (chain.toLowerCase()) {
        case 'eth':
        case 'ethereum':
          holders = await this.getEthereumHolders(tokenAddress);
          break;
        case 'bsc':
        case 'binance':
          holders = await this.getBSCHolders(tokenAddress);
          break;
        case 'sol':
        case 'solana':
          holders = await this.getSolanaHolders(tokenAddress);
          break;
        case 'sonic':
        case 'blast':
          // Use Etherscan V2 for Sonic and Blast
          if (etherscanV2Service.isChainSupported(chain)) {
            try {
              const holdersCount = await etherscanV2Service.getHoldersCount(tokenAddress, chain);
              console.log(`Etherscan V2 holders count for ${chain}: ${holdersCount}`);
              return holdersCount;
            } catch {
              console.warn(`Etherscan V2 failed for ${chain}, using fallback`);
              return 0;
            }
          } else {
            console.warn(`Chain ${chain} not supported by Etherscan V2`);
            return 0;
          }
        default:
          // Try Etherscan V2 for other chains
          if (etherscanV2Service.isChainSupported(chain)) {
            try {
              const holdersCount = await etherscanV2Service.getHoldersCount(tokenAddress, chain);
              console.log(`Etherscan V2 holders count for ${chain}: ${holdersCount}`);
              return holdersCount;
            } catch {
              console.warn(`Etherscan V2 failed for ${chain}`);
              return 0;
            }
          } else {
            console.warn(`Holders count not available for chain: ${chain}`);
            return 0;
          }
      }
      
      return holders.length;
    } catch (error) {
      console.error('Error getting holders count:', error);
      return 0;
    }
  }

  // Get comprehensive token data
  async getTokenAnalytics(tokenAddress: string, chain: string): Promise<{
    holdersCount: number;
    transactionData: TransactionData;
    liquidityData: LiquidityData;
  }> {
    const [holdersCount, dexData] = await Promise.all([
      this.getHoldersCount(tokenAddress, chain),
      this.getDexScreenerData(tokenAddress, chain)
    ]);

    return {
      holdersCount,
      transactionData: dexData.transactionData,
      liquidityData: dexData.liquidityData
    };
  }

  private getChainId(chain: string): string {
    const chainMap: Record<string, string> = {
      'eth': 'ethereum',
      'ethereum': 'ethereum',
      'bsc': 'bsc',
      'binance': 'bsc',
      'polygon': 'polygon',
      'sol': 'solana',
      'solana': 'solana',
      'arbitrum': 'arbitrum',
      'optimism': 'optimism',
      'sonic': 'sonic',
      'blast': 'blast'
    };
    return chainMap[chain.toLowerCase()] || chain.toLowerCase();
  }
}

export const freeAPIService = new FreeAPIService(); 