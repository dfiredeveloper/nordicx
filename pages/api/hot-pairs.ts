import type { NextApiRequest, NextApiResponse } from 'next';

interface HotPair {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  image: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch top tokens by volume from CoinGecko
    const cgUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=15&page=1';
    const response = await fetch(cgUrl);
    if (!response.ok) {
      return res.status(500).json({ success: false, error: 'Failed to fetch from CoinGecko', data: [] });
    }
    const data = await response.json();
    type CoinGeckoToken = {
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      price_change_percentage_24h: number;
      total_volume: number;
      image: string;
    };
    const topTokens: HotPair[] = (data as CoinGeckoToken[]).map((token) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      price: token.current_price,
      priceChange24h: token.price_change_percentage_24h,
      volume24h: token.total_volume,
      image: token.image,
    }));
    res.status(200).json({ success: true, data: topTokens });
  } catch (error) {
    console.error('Hot pairs API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch top tokens',
      data: []
    });
  }
} 