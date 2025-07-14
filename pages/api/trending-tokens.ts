import type { NextApiRequest, NextApiResponse } from 'next';
import { freeAPIService } from '@/lib/services/free-apis';

const CMC_API_KEY = process.env.CMC_API_KEY || '';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

// Type for infoData from /cryptocurrency/info
type InfoData = {
  data: {
    [id: string]: {
      logo?: string;
      date_added?: string;
    };
  };
};

// Type for DexScreener pair data
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

// Utility: fetch with retry
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('fetchWithRetry: failed all retries');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('CMC_API_KEY:', process.env.CMC_API_KEY);
  const { limit, timeframe } = req.query;
  const tokenLimit = Math.max(1, Math.min(Number(limit) || 100, 500)); // CMC free tier max is 500
  
  // Determine sort field based on timeframe
  let sortField = 'percent_change_24h'; // default
  if (timeframe === '1h') {
    sortField = 'percent_change_1h';
  } else if (timeframe === '7d') {
    sortField = 'percent_change_7d';
  }
  
  const url = `${CMC_BASE_URL}/cryptocurrency/listings/latest?sort=${sortField}&sort_dir=desc&limit=${tokenLimit}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetchWithRetry(url, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`CoinMarketCap API Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: 'Failed to fetch from CoinMarketCap' });
    }
    
    const data = await response.json();

  // Get the list of token IDs
  const ids = Array.isArray(data.data) ? data.data.map((token: unknown) => {
    if (typeof token === 'object' && token !== null && 'id' in token) {
      return (token as { id: number }).id;
    }
    return null;
  }).filter((id): id is number => id !== null).join(',') : '';

  // Fetch token logos from /cryptocurrency/info
  let logos: Record<string, string> = {};
  let infoData: InfoData | null = null; // Declare infoData here
  if (ids) {
    const infoUrl = `${CMC_BASE_URL}/cryptocurrency/info?id=${ids}`;
    const infoRes = await fetchWithRetry(infoUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
    });
    if (infoRes.ok) {
      infoData = await infoRes.json();
      if (infoData && infoData.data) {
        logos = Object.fromEntries(
          Object.entries(infoData.data)
            .map(([id, info]: [string, unknown]) => {
              if (typeof info === 'object' && info !== null && 'logo' in info && typeof (info as { logo: unknown }).logo === 'string') {
                return [id, (info as { logo: string }).logo];
              }
              return null;
            })
            .filter((entry): entry is [string, string] => Array.isArray(entry) && typeof entry[1] === 'string')
        );
      }
    }
  }

  // Attach logo and age to each token
  let tokensWithLogos = Array.isArray(data.data) ? data.data.map((token: unknown) => {
    if (typeof token === 'object' && token !== null && 'id' in token) {
      const t = token as { id: number };
      // Get date_added from infoData
      let age: number | null = null;
      if (logos && logos[t.id]) {
        // infoData is not available here, so we need to get date_added from the same place as logo
        // But logos only has logo URLs, so we need to fetch date_added from infoData
      }
      // We'll need to fetch infoData here to get date_added
      // But since we already have infoData in the previous fetch, let's parse it above and pass it here
      // For now, let's assume we have infoData available as a variable
      let dateAdded: string | null = null;
      if (
        infoData !== null &&
        infoData.data &&
        infoData.data[t.id] &&
        typeof infoData.data[t.id].date_added !== 'undefined'
      ) {
        dateAdded = infoData.data[t.id].date_added ?? null;
      }
      if (dateAdded) {
        const addedDate = new Date(dateAdded);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - addedDate.getTime());
        age = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // age in days
      }
      let contract_address: string | null = null;
      if (
        'platform' in token &&
        token.platform &&
        typeof token.platform === 'object' &&
        'token_address' in token.platform &&
        typeof token.platform.token_address === 'string'
      ) {
        contract_address = token.platform.token_address;
      }
      return {
        ...token,
        logo: logos[t.id] || null,
        age,
        contract_address,
      };
    }
    return token;
  }) : [];

  // Filter by chain if provided
  const { chain } = req.query;
  console.log('Chain parameter received:', chain);
  if (chain) {
    const chainName = String(chain).toLowerCase();
    console.log('Chain name after processing:', chainName);
    if (chainName === 'sonic') {
      // Fetch Sonic trending tokens from DexScreener
      console.log('Fetching Sonic trending tokens from DexScreener...');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        // Fetch trending pairs from DexScreener for Sonic
        const dexScreenerResponse = await fetchWithRetry(
          'https://api.dexscreener.com/latest/dex/search?q=sonic',
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        console.log('DexScreener response status:', dexScreenerResponse.status);
        
        if (dexScreenerResponse.ok) {
          const dexData = await dexScreenerResponse.json();
          console.log('DexScreener data received, pairs count:', dexData.pairs?.length || 0);
          
          if (dexData.pairs && Array.isArray(dexData.pairs)) {
            // Filter for Sonic chain pairs and convert to CMC format
            const sonicPairs = dexData.pairs
              .filter((pair: DexScreenerPair) => {
                const isSonic = pair.chainId === 'sonic';
                const hasVolume = pair.volume.h24 > 0.1; // Lowered from 10 to 0.1 for Sonic
                const hasLiquidity = pair.liquidity.usd > 10; // Lowered from 100 to 10 for Sonic
                const notStable = !['USDT', 'USDC', 'DAI'].includes(pair.baseToken.symbol);
                
                console.log(`Pair ${pair.baseToken.symbol}: chainId=${pair.chainId}, volume=${pair.volume.h24}, liquidity=${pair.liquidity.usd}`);
                
                return isSonic && hasVolume && hasLiquidity && notStable;
              })
              .sort((a: DexScreenerPair, b: DexScreenerPair) => b.volume.h24 - a.volume.h24) // Sort by volume
              .slice(0, 50) // Limit to top 50
              .map((pair: DexScreenerPair, index: number) => ({
                id: index + 1, // Generate unique ID
                name: pair.baseToken.name,
                symbol: pair.baseToken.symbol,
                quote: {
                  USD: {
                    price: parseFloat(pair.priceUsd) || 0,
                    percent_change_1h: pair.priceChange.h1 || 0,
                    percent_change_24h: pair.priceChange.h24 || 0,
                    percent_change_7d: 0, // DexScreener doesn't provide 7d change
                    market_cap: 0, // Will be calculated if needed
                    volume_24h: pair.volume.h24 || 0
                  }
                },
                platform: { name: 'Sonic' },
                logo: null, // DexScreener doesn't provide logos
                age: null, // Will need to calculate from contract creation
                contract_address: pair.baseToken.address,
                // Additional data from DexScreener
                holders_count: 0, // Will be fetched separately
                buy_tx_1m: pair.txns.h1.buys || 0,
                sell_tx_1m: pair.txns.h1.sells || 0,
                total_tx_1m: (pair.txns.h1.buys || 0) + (pair.txns.h1.sells || 0),
                liquidity_usd: pair.liquidity.usd || 0,
                pool_address: pair.pairAddress
              }));
            
            console.log('Sonic pairs found:', sonicPairs.length);
            tokensWithLogos = sonicPairs;
          }
        }
      } catch (error) {
        console.error('Error fetching Sonic trending tokens from DexScreener:', error);
        tokensWithLogos = [];
      }
    } else if (chainName === 'blast') {
      // Fetch Blast trending tokens from DexScreener (CMC doesn't have Blast trending data)
      console.log('Fetching Blast trending tokens from DexScreener...');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        // Fetch trending pairs from DexScreener for Blast
        const dexScreenerResponse = await fetchWithRetry(
          'https://api.dexscreener.com/latest/dex/search?q=blast',
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        console.log('DexScreener response status:', dexScreenerResponse.status);
        
        if (dexScreenerResponse.ok) {
          const dexData = await dexScreenerResponse.json();
          console.log('DexScreener data received, pairs count:', dexData.pairs?.length || 0);
          
          if (dexData.pairs && Array.isArray(dexData.pairs)) {
            // Filter for Blast chain pairs and convert to CMC format
            const blastPairs = dexData.pairs
              .filter((pair: DexScreenerPair) => {
                const isBlast = pair.chainId === 'blast';
                const hasVolume = pair.volume.h24 > 100; // Standard threshold for Blast
                const hasLiquidity = pair.liquidity.usd > 1000; // Standard threshold for Blast
                const notStable = !['USDT', 'USDC', 'DAI'].includes(pair.baseToken.symbol);
                
                console.log(`Pair ${pair.baseToken.symbol}: chainId=${pair.chainId}, volume=${pair.volume.h24}, liquidity=${pair.liquidity.usd}`);
                
                return isBlast && hasVolume && hasLiquidity && notStable;
              })
              .sort((a: DexScreenerPair, b: DexScreenerPair) => b.volume.h24 - a.volume.h24) // Sort by volume
              .slice(0, 50) // Limit to top 50
              .map((pair: DexScreenerPair, index: number) => ({
                id: index + 1, // Generate unique ID
                name: pair.baseToken.name,
                symbol: pair.baseToken.symbol,
                quote: {
                  USD: {
                    price: parseFloat(pair.priceUsd) || 0,
                    percent_change_1h: pair.priceChange.h1 || 0,
                    percent_change_24h: pair.priceChange.h24 || 0,
                    percent_change_7d: 0, // DexScreener doesn't provide 7d change
                    market_cap: 0, // Will be calculated if needed
                    volume_24h: pair.volume.h24 || 0
                  }
                },
                platform: { name: 'Blast' },
                logo: null, // DexScreener doesn't provide logos
                age: null, // Will need to calculate from contract creation
                contract_address: pair.baseToken.address,
                // Additional data from DexScreener
                holders_count: 0, // Will be fetched separately
                buy_tx_1m: pair.txns.h1.buys || 0,
                sell_tx_1m: pair.txns.h1.sells || 0,
                total_tx_1m: (pair.txns.h1.buys || 0) + (pair.txns.h1.sells || 0),
                liquidity_usd: pair.liquidity.usd || 0,
                pool_address: pair.pairAddress
              }));
            
            console.log('Blast pairs found:', blastPairs.length);
            tokensWithLogos = blastPairs;
          }
        }
      } catch (error) {
        console.error('Error fetching Blast trending tokens from DexScreener:', error);
        tokensWithLogos = [];
      }
    } else {
      tokensWithLogos = tokensWithLogos.filter((token) => {
        if (
          typeof token === 'object' &&
          token !== null &&
          'platform' in token &&
          token.platform &&
          typeof token.platform === 'object' &&
          'name' in token.platform &&
          typeof token.platform.name === 'string'
        ) {
          const platformName = token.platform.name.toLowerCase();
          if (chainName === 'bsc') {
            // Match common BSC platform names
            return platformName.includes('bnb') || platformName.includes('binance');
          }
          // Add more mappings as needed for other chains
          return platformName.includes(chainName);
        }
        return false;
      });
    }
  }

  // Enhance tokens with free API data (holders, transactions, liquidity)
  // Note: Holders count for Ethereum requires Etherscan API Pro subscription
  // For free tier, holders count will be 0 for Ethereum tokens
  const enhancedTokens = await Promise.all(
    tokensWithLogos.map(async (token) => {
      if (
        typeof token === 'object' &&
        token !== null &&
        'contract_address' in token &&
        token.contract_address &&
        typeof token.contract_address === 'string'
      ) {
        try {
          const analytics = await freeAPIService.getTokenAnalytics(
            token.contract_address,
            String(chain || 'eth')
          );
          
          return {
            ...token,
            holders_count: analytics.holdersCount,
            buy_tx_1m: analytics.transactionData.buyTx1m,
            sell_tx_1m: analytics.transactionData.sellTx1m,
            total_tx_1m: analytics.transactionData.totalTx1m,
            liquidity_usd: analytics.liquidityData.liquidityUSD,
            pool_address: analytics.liquidityData.poolAddress,
          };
        } catch (error) {
          console.error(`Error fetching analytics for token ${token.contract_address}:`, error);
          return {
            ...token,
            holders_count: 0,
            buy_tx_1m: 0,
            sell_tx_1m: 0,
            total_tx_1m: 0,
            liquidity_usd: 0,
            pool_address: '',
          };
        }
      }
      return {
        ...token,
        holders_count: 0,
        buy_tx_1m: 0,
        sell_tx_1m: 0,
        total_tx_1m: 0,
        liquidity_usd: 0,
        pool_address: '',
      };
    })
  );

  // --- Address filtering and fallback logic ---
  const { address } = req.query;
  let finalTokens = enhancedTokens;
  if (address && typeof address === 'string') {
    // Filter for matching contract_address (case-insensitive)
    finalTokens = enhancedTokens.filter(
      t => t && t.contract_address && t.contract_address.toLowerCase() === address.toLowerCase()
    );
    // If not found, try DexScreener fallback
    if (finalTokens.length === 0 && chain && typeof chain === 'string') {
      try {
        const dsRes = await fetchWithRetry(`https://api.dexscreener.com/latest/dex/search?q=${chain}`);
        if (dsRes.ok) {
          const dsData = await dsRes.json();
          if (dsData.pairs && Array.isArray(dsData.pairs)) {
            const match = dsData.pairs.find(
              (pair: DexScreenerPair) => pair.baseToken && pair.baseToken.address && pair.baseToken.address.toLowerCase() === address.toLowerCase()
            );
            if (match) {
              // Map DexScreener pair to token format
              finalTokens = [{
                id: match.pairAddress,
                name: match.baseToken.name,
                symbol: match.baseToken.symbol,
                quote: {
                  USD: {
                    price: parseFloat(match.priceUsd) || 0,
                    percent_change_1h: match.priceChange.h1 || 0,
                    percent_change_24h: match.priceChange.h24 || 0,
                    percent_change_7d: 0,
                    market_cap: 0,
                    volume_24h: match.volume.h24 || 0
                  }
                },
                platform: { name: chain },
                logo: null,
                age: null,
                contract_address: match.baseToken.address,
                holders_count: 0,
                buy_tx_1m: match.txns.h1.buys || 0,
                sell_tx_1m: match.txns.h1.sells || 0,
                total_tx_1m: (match.txns.h1.buys || 0) + (match.txns.h1.sells || 0),
                liquidity_usd: match.liquidity.usd || 0,
                pool_address: match.pairAddress
              }];
            }
          }
        }
      } catch (err) {
        console.error('DexScreener fallback error:', err);
      }
    }
  }

  res.status(200).json({ ...data, data: finalTokens });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('CoinMarketCap API timeout after 15 seconds');
      return res.status(408).json({ error: 'Request timeout' });
    } else {
      console.error('CoinMarketCap API Error:', error);
      return res.status(500).json({ error: 'Failed to fetch from CoinMarketCap' });
    }
  }
}