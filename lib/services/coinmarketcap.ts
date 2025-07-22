const CMC_API_KEY = '95b3b028-0316-4ac5-8cec-c12c5390bec9';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export interface CmcTrendingToken {
  id: number;
  name: string;
  symbol: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  logo?: string;
  platform?: string;
  age?: number;
  contract_address?: string;
  // New properties from free APIs
  holders_count?: number;
  buy_tx_1m?: number;
  sell_tx_1m?: number;
  total_tx_1m?: number;
  liquidity_usd?: number;
  pool_address?: string;
}

// Define the expected structure of a token from the CMC API
interface CmcApiToken {
  id: number;
  name: string;
  symbol: string;
  platform?: {
    name: string;
    token_address?: string;
  };
  quote: {
    USD: {
      price: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      market_cap: number;
      volume_24h: number;
    };
  };
}

class CoinMarketCapService {
  async getTokenLogos(ids: number[]): Promise<Record<string, string>> {
    if (!ids.length) return {};
    const url = `${CMC_BASE_URL}/cryptocurrency/info?id=${ids.join(',')}`;
    const res = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return {};
    const data = await res.json();
    if (!data.data) return {};
    const logos: Record<string, string> = {};
    for (const id of ids) {
      const info = data.data[id];
      if (info && typeof info.logo === 'string') {
        logos[id] = info.logo;
      }
    }
    return logos;
  }

  async getTrendingTokens(limit: number = 40, withLogos = false): Promise<CmcTrendingToken[]> {
    const url = `${CMC_BASE_URL}/cryptocurrency/listings/latest?sort=percent_change_24h&sort_dir=desc&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch trending tokens from CoinMarketCap');
    const data = await res.json();
    const tokens = (data.data as CmcApiToken[]).map((token) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      price: token.quote.USD.price,
      percent_change_1h: token.quote.USD.percent_change_1h,
      percent_change_24h: token.quote.USD.percent_change_24h,
      percent_change_7d: token.quote.USD.percent_change_7d,
      market_cap: token.quote.USD.market_cap,
      volume_24h: token.quote.USD.volume_24h,
      platform: token.platform?.name || 'Ethereum',
      contract_address: token.platform?.token_address || undefined,
      // logo: ... (can be fetched with /cryptocurrency/info)
    }));
    if (withLogos) {
      const ids = tokens.map(t => t.id);
      const logos = await this.getTokenLogos(ids);
      return tokens.map(t => ({ ...t, logo: logos[t.id] || undefined }));
    }
    return tokens;
  }
}

export const coinMarketCapService = new CoinMarketCapService(); 