import axios from 'axios';
import { TokenData } from '@/types/token';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex';

export class PriceFeedService {
  private static instance: PriceFeedService;
  
  private constructor() {}
  
  public static getInstance(): PriceFeedService {
    if (!PriceFeedService.instance) {
      PriceFeedService.instance = new PriceFeedService();
    }
    return PriceFeedService.instance;
  }

  async getTokenPrice(
    tokenAddress: string,
    chainId: number,
    vsCurrency: string = 'usd'
  ): Promise<number> {
    try {
      // First try CoinGecko
      const coingeckoPrice = await this.getCoingeckoPrice(tokenAddress, chainId, vsCurrency);
      if (coingeckoPrice) return coingeckoPrice;
      
      // Fallback to DexScreener
      const dexscreenerPrice = await this.getDexScreenerPrice(tokenAddress, chainId);
      if (dexscreenerPrice) return dexscreenerPrice;
      
      throw new Error('Price not available from any source');
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  private async getCoingeckoPrice(
    tokenAddress: string,
    chainId: number,
    vsCurrency: string
  ): Promise<number | null> {
    try {
      // Map chainId to CoinGecko platform ID
      const platformId = this.getCoingeckoPlatformId(chainId);
      if (!platformId) return null;

      const response = await axios.get(
        `${COINGECKO_API_URL}/simple/token_price/${platformId}`,
        {
          params: {
            contract_addresses: tokenAddress,
            vs_currencies: vsCurrency,
          },
        }
      );

      const data = response.data[tokenAddress.toLowerCase()];
      return data ? data[vsCurrency] : null;
    } catch (error) {
      console.warn('Failed to fetch price from CoinGecko:', error);
      return null;
    }
  }

  private async getDexScreenerPrice(
    tokenAddress: string,
    chainId: number
  ): Promise<number | null> {
    try {
      const chainName = this.getDexScreenerChainName(chainId);
      if (!chainName) return null;

      const response = await axios.get(
        `${DEXSCREENER_API_URL}/tokens/${tokenAddress}`
      );
      
      // Find the pair with the highest liquidity
      const pairs = response.data.pairs || [];
      if (pairs.length === 0) return null;
      
      const mostLiquidPair = pairs.reduce((a: any, b: any) => 
        (a.liquidity?.usd || 0) > (b.liquidity?.usd || 0) ? a : b
      );
      
      return parseFloat(mostLiquidPair.priceUsd);
    } catch (error) {
      console.warn('Failed to fetch price from DexScreener:', error);
      return null;
    }
  }

  private getCoingeckoPlatformId(chainId: number): string | null {
    const platformMap: Record<number, string> = {
      1: 'ethereum',
      56: 'binance-smart-chain',
      137: 'polygon-pos',
      // Add more chains as needed
    };
    return platformMap[chainId] || null;
  }

  private getDexScreenerChainName(chainId: number): string | null {
    const chainMap: Record<number, string> = {
      1: 'ethereum',
      56: 'bsc',
      137: 'polygon',
      // Add more chains as needed
    };
    return chainMap[chainId] || null;
  }
}

export const priceFeedService = PriceFeedService.getInstance();
