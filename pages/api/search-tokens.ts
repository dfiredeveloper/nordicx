import type { NextApiRequest, NextApiResponse } from 'next';
import { coinMarketCapService } from '@/lib/services/coinmarketcap';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing query parameter' });
  }

  try {
    // Fetch a reasonable number of tokens to search through, with logos
    const tokens = await coinMarketCapService.getTrendingTokens(300, true);
    const q = query.toLowerCase();
    const filtered = tokens.filter(token =>
      token.name.toLowerCase().includes(q) ||
      token.symbol.toLowerCase().includes(q) ||
      (token.contract_address && token.contract_address.toLowerCase().includes(q))
    );
    res.status(200).json({ success: true, tokens: filtered });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to search tokens' });
  }
} 