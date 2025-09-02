import { TokenData } from "@/types/token";

// Helper function to transform API response to TokenData
export function transformTokenData(apiData: any): TokenData | null {
  if (!apiData) return null;
  
  return {
    name: apiData.name || '',
    symbol: apiData.symbol || '',
    address: apiData.address || apiData.pairAddress || '',
    chainId: parseInt(apiData.chainId) || 1, // Default to Ethereum mainnet
    price: apiData.priceUsd ? parseFloat(apiData.priceUsd) : undefined,
    price_24h_change: apiData.priceChange?.h24 || apiData.price_24h_change,
    volume_24h: apiData.volume?.h24 || apiData.volume_24h,
    liquidity: apiData.liquidity?.usd || apiData.liquidity_usd,
    market_cap: apiData.market_cap,
    holders_count: apiData.holders_count,
    website: apiData.website || apiData.socials?.website,
    twitter: apiData.twitter || apiData.socials?.twitter,
    telegram: apiData.telegram || apiData.socials?.telegram,
    // Add any additional fields from the API
    ...apiData,
  };
}
