export interface TokenData {
  // Basic token info
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
  logo?: string;
  
  // Price data
  price?: number;
  price_24h_change?: number;
  price_change_24h?: number;
  
  // Market data
  market_cap?: number;
  volume_24h?: number;
  liquidity?: number;
  
  // Token metrics
  total_supply?: string;
  circulating_supply?: string;
  max_supply?: string;
  holders_count?: number;
  
  // Social links
  website?: string;
  twitter?: string;
  telegram?: string;
  
  // Additional metadata
  tags?: string[];
  auditStatus?: string;
  auditScore?: string;
  
  // For DEX pairs
  baseToken?: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  
  // For compatibility with different data sources
  [key: string]: unknown;
}

export interface TokenBalance {
  token: TokenData;
  balance: string;
  balanceUsd: number;
  price: number;
}

export interface TokenPriceResponse {
  tokenAddress: string;
  chainId: number;
  price: number;
  source: string;
  timestamp: string;
}
