// Price feed service for real-time token pricing
export class PriceFeedService {
  private static instance: PriceFeedService;
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds
  
  private constructor() {}
  
  public static getInstance(): PriceFeedService {
    if (!PriceFeedService.instance) {
      PriceFeedService.instance = new PriceFeedService();
    }
    return PriceFeedService.instance;
  }

  // Get real-time token price from CoinGecko
  async getCoinGeckoPrice(tokenAddress: string, chainId: number) {
    try {
      const cacheKey = `coingecko_${chainId}_${tokenAddress}`;
      const cached = this.priceCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return { success: true, price: cached.price, source: 'CoinGecko (cached)' };
      }

      const chainName = this.getChainNameForCoinGecko(chainId);
      const url = `https://api.coingecko.com/api/v3/simple/token_price/${chainName}?contract_addresses=${tokenAddress}&vs_currencies=usd`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const price = data[tokenAddress.toLowerCase()]?.usd || 0;
      
      // Cache the price
      this.priceCache.set(cacheKey, { price, timestamp: Date.now() });
      
      return { success: true, price, source: 'CoinGecko' };
    } catch (error) {
      console.error('CoinGecko price error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get real-time token price from DexScreener
  async getDexScreenerPrice(tokenAddress: string, chainId: number) {
    try {
      const cacheKey = `dexscreener_${chainId}_${tokenAddress}`;
      const cached = this.priceCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return { success: true, price: cached.price, source: 'DexScreener (cached)' };
      }

      const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.status}`);
      }

      const data = await response.json();
      const pairs = data.pairs || [];
      
      if (pairs.length === 0) {
        throw new Error('No trading pairs found');
      }

      // Get the most liquid pair
      const bestPair = pairs.reduce((best: Record<string, unknown>, current: Record<string, unknown>) => {
        if (!best) return current;
        const bestLiquidity = parseFloat((best.liquidity as Record<string, unknown>)?.usd as string || '0');
        const currentLiquidity = parseFloat((current.liquidity as Record<string, unknown>)?.usd as string || '0');
        return currentLiquidity > bestLiquidity ? current : best;
      });

      const price = parseFloat((bestPair.priceUsd as string) || '0');
      
      // Cache the price
      this.priceCache.set(cacheKey, { price, timestamp: Date.now() });
      
      return { success: true, price, source: 'DexScreener' };
    } catch (error) {
      console.error('DexScreener price error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get best price from multiple sources
  async getBestPrice(tokenAddress: string, chainId: number) {
    try {
      const [coingeckoPrice, dexscreenerPrice] = await Promise.all([
        this.getCoinGeckoPrice(tokenAddress, chainId),
        this.getDexScreenerPrice(tokenAddress, chainId)
      ]);

      const validPrices = [coingeckoPrice, dexscreenerPrice].filter(price => price.success);
      
      if (validPrices.length === 0) {
        throw new Error('No valid prices available');
      }

      // Return the first available price (you could implement price validation logic here)
      return validPrices[0];
    } catch (error) {
      console.error('Best price error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get multiple token prices at once
  async getMultipleTokenPrices(tokenAddresses: string[], chainId: number) {
    try {
      const pricePromises = tokenAddresses.map(address => 
        this.getBestPrice(address, chainId)
      );
      
      const prices = await Promise.all(pricePromises);
      
      const result: Record<string, unknown> = {};
      tokenAddresses.forEach((address, index) => {
        result[address] = prices[index];
      });
      
      return { success: true, prices: result };
    } catch (error) {
      console.error('Multiple token prices error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get price history (for charts)
  async getPriceHistory(tokenAddress: string, chainId: number, days: number = 7) {
    try {
      const chainName = this.getChainNameForCoinGecko(chainId);
      const url = `https://api.coingecko.com/api/v3/coins/${chainName}/contract/${tokenAddress}/market_chart/?vs_currency=usd&days=${days}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`CoinGecko history API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        prices: data.prices || [],
        marketCaps: data.market_caps || [],
        volumes: data.total_volumes || []
      };
    } catch (error) {
      console.error('Price history error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Clear price cache
  clearCache() {
    this.priceCache.clear();
  }

  // Get chain name for CoinGecko API
  private getChainNameForCoinGecko(chainId: number): string {
    switch (chainId) {
      case 1: return 'ethereum';
      case 56: return 'binance-smart-chain';
      case 8453: return 'base';
      case 81457: return 'blast';
      default: return 'ethereum';
    }
  }

  // Get chain name for DexScreener API
  private getChainNameForDexScreener(chainId: number): string {
    switch (chainId) {
      case 1: return 'ethereum';
      case 56: return 'bsc';
      case 8453: return 'base';
      case 81457: return 'blast';
      default: return 'ethereum';
    }
  }
}

export default PriceFeedService.getInstance();
