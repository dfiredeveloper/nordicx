export interface TokenData {
  name?: string;
  symbol?: string;
  price?: number;
  logo?: string;
  price_24h_change?: number;
  address?: string;
  chain?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  age?: string;
  sniperCount?: number;
  sniperTotal?: number;
  bluechipPercent?: string;
  top10Percent?: string;
  auditStatus?: string;
  auditScore?: string;
  volume_24h?: number;
  [key: string]: unknown;
}
