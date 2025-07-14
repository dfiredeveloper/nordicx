import type { NextApiRequest, NextApiResponse } from 'next';

interface DexScreenerPair {
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

interface HotPair {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  chain: string;
  pairAddress: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allPairs: HotPair[] = [];
    const chains = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'base'];

    for (const chain of chains) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Search for pairs on this chain
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/search?q=${chain}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
            }
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          if (data.pairs && Array.isArray(data.pairs)) {
            const pairs: DexScreenerPair[] = data.pairs;
            
            // Filter for hot pairs with significant activity
            const hotPairs = pairs
              .filter(pair => 
                pair.volume.h24 > 10000 && // Lower threshold to $10k volume
                Math.abs(pair.priceChange.h24) > 5 && // Lower threshold to 5% price change
                pair.liquidity.usd > 5000 && // Lower threshold to $5k liquidity
                pair.baseToken.symbol !== 'USDT' && // Exclude stable pairs
                pair.baseToken.symbol !== 'USDC' &&
                pair.baseToken.symbol !== 'DAI' &&
                pair.baseToken.symbol !== 'WETH' &&
                pair.baseToken.symbol !== 'WBTC' &&
                pair.baseToken.symbol !== 'ETH' &&
                pair.baseToken.symbol !== 'BTC' &&
                pair.baseToken.symbol.length <= 8 && // Only show tokens with reasonable symbol length
                pair.baseToken.name.length <= 20 // Only show tokens with reasonable name length
              )
              .sort((a, b) => b.volume.h24 - a.volume.h24) // Sort by volume
              .slice(0, 5) // Take top 5 per chain
              .map(pair => ({
                id: pair.pairAddress,
                name: pair.baseToken.name,
                symbol: pair.baseToken.symbol,
                price: parseFloat(pair.priceUsd) || 0,
                priceChange24h: pair.priceChange.h24 || 0,
                volume24h: pair.volume.h24 || 0,
                liquidity: pair.liquidity.usd || 0,
                chain: chain,
                pairAddress: pair.pairAddress
              }));

            allPairs.push(...hotPairs);
          }
        }
      } catch (error) {
        console.error(`Error fetching data for chain ${chain}:`, error);
        // Continue with other chains even if one fails
      }
    }

    // If we don't have enough data, try a fallback approach
    if (allPairs.length < 5) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Try searching for "meme" tokens which are often hot
        const response = await fetch(
          'https://api.dexscreener.com/latest/dex/search?q=meme',
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
            }
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          if (data.pairs && Array.isArray(data.pairs)) {
            const pairs: DexScreenerPair[] = data.pairs;
            
            const memePairs = pairs
              .filter(pair => 
                pair.volume.h24 > 10000 && // Lower threshold for meme tokens
                Math.abs(pair.priceChange.h24) > 5 &&
                pair.liquidity.usd > 5000
              )
              .sort((a, b) => b.volume.h24 - a.volume.h24)
              .slice(0, 10)
              .map(pair => ({
                id: pair.pairAddress,
                name: pair.baseToken.name,
                symbol: pair.baseToken.symbol,
                price: parseFloat(pair.priceUsd) || 0,
                priceChange24h: pair.priceChange.h24 || 0,
                volume24h: pair.volume.h24 || 0,
                liquidity: pair.liquidity.usd || 0,
                chain: pair.chainId,
                pairAddress: pair.pairAddress
              }));

            allPairs.push(...memePairs);
          }
        }
      } catch (error) {
        console.error('Error fetching meme tokens:', error);
      }
    }

    // Sort all pairs by volume and take top 15
    const topPairs = allPairs
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 15);

    // If still no data, return some mock data as fallback
    if (topPairs.length === 0) {
      const mockPairs: HotPair[] = [
        {
          id: 'mock1',
          name: 'Pepe',
          symbol: 'PEPE',
          price: 0.00000123,
          priceChange24h: 15.67,
          volume24h: 2500000,
          liquidity: 500000,
          chain: 'ethereum',
          pairAddress: '0x123...'
        },
        {
          id: 'mock2',
          name: 'Shiba Inu',
          symbol: 'SHIB',
          price: 0.00001234,
          priceChange24h: 8.45,
          volume24h: 1800000,
          liquidity: 400000,
          chain: 'ethereum',
          pairAddress: '0x456...'
        },
        {
          id: 'mock3',
          name: 'Dogecoin',
          symbol: 'DOGE',
          price: 0.0789,
          priceChange24h: 12.34,
          volume24h: 1500000,
          liquidity: 300000,
          chain: 'ethereum',
          pairAddress: '0x789...'
        }
      ];
      
      res.status(200).json({ 
        success: true, 
        data: mockPairs,
        count: mockPairs.length,
        note: 'Using fallback data'
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: topPairs,
      count: topPairs.length
    });

  } catch (error) {
    console.error('Hot pairs API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch hot pairs',
      data: []
    });
  }
} 