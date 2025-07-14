const DRPC_API_KEY = 'AlLYL4PUXUijoUkI3VuNTHzWWDJ_XN8R8JhtrqRhf0fE';
const DRPC_BASE_URL = 'https://api.drpc.org';

export interface TrendingToken {
  address: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChange1h: number;
  priceChange5m: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  transactions1m: number;
  buyTx1m: number;
  sellTx1m: number;
  age: string;
  chain: string;
  chainIcon: string;
  tokenIcon: string;
  socials?: {
    twitter?: string;
    website?: string;
    telegram?: string;
  };
}

export interface DRPCResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

class DRPCService {
  private async makeRequest(endpoint: string, params: Record<string, string | number> = {}): Promise<DRPCResponse> {
    try {
      const url = new URL(`${DRPC_BASE_URL}${endpoint}`);
      url.searchParams.append('api_key', DRPC_API_KEY);
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('DRPC API Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getTrendingTokens(chain: string = 'ethereum', limit: number = 40): Promise<TrendingToken[]> {
    // For now, we'll create mock data that mimics real trending tokens
    // In a real implementation, you would call the actual DRPC API endpoints
    const mockTokens: TrendingToken[] = Array.from({ length: limit }, (_, index) => ({
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      name: `Token${index + 1}`,
      symbol: `TKN${index + 1}`,
      price: Math.random() * 1000,
      priceChange24h: (Math.random() - 0.5) * 100,
      priceChange1h: (Math.random() - 0.5) * 50,
      priceChange5m: (Math.random() - 0.5) * 20,
      marketCap: Math.random() * 1000000,
      volume24h: Math.random() * 500000,
      liquidity: Math.random() * 100000,
      holders: Math.floor(Math.random() * 10000),
      transactions1m: Math.floor(Math.random() * 5000),
      buyTx1m: Math.floor(Math.random() * 3000),
      sellTx1m: Math.floor(Math.random() * 2000),
      age: `${Math.floor(Math.random() * 30)}d`,
      chain,
      chainIcon: `/static/${chain === 'solana' ? 'solana.webp' : 'ether.webp'}`,
      tokenIcon: `/static/3717.png`,
      socials: {
        twitter: Math.random() > 0.5 ? 'https://twitter.com/token' : undefined,
        website: Math.random() > 0.5 ? 'https://token.com' : undefined,
        telegram: Math.random() > 0.5 ? 'https://t.me/token' : undefined,
      }
    }));

    return mockTokens;
  }

  async getTokenDetails(address: string, chain: string): Promise<TrendingToken | null> {
    // Mock implementation - in real app, this would fetch from DRPC
    return {
      address,
      name: 'Sample Token',
      symbol: 'SMPL',
      price: 100,
      priceChange24h: 5.2,
      priceChange1h: 1.5,
      priceChange5m: 0.3,
      marketCap: 1000000,
      volume24h: 50000,
      liquidity: 25000,
      holders: 1500,
      transactions1m: 100,
      buyTx1m: 60,
      sellTx1m: 40,
      age: '15d',
      chain,
      chainIcon: `/static/${chain === 'solana' ? 'solana.webp' : 'ether.webp'}`,
      tokenIcon: '/static/3717.png',
    };
  }
}

export const drpcService = new DRPCService(); 