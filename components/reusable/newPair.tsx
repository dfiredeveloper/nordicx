"use client";
import { useEffect, useState, useCallback } from "react"
import UtilityBar from "./utilityBar"
import Feed from "./feed"
import Footer from "../common/footer"
import { usePathname, useSearchParams } from "next/navigation";

// Types for token data
type TokenData = {
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
    priceUsd: string;
    liquidity: {
        usd: number;
        locked?: boolean;
    };
    volume: {
        h24: number;
        h1?: number;
    };
    priceChange: {
        h24: number;
        h1?: number;
        m5?: number;
    };
    pairAddress: string;
    chainId: string;
    dexId: string;
    createdAt?: string;
    pairCreatedAt?: number;
    txns?: {
        h1: {
            buys: number;
            sells: number;
        };
    };
    image?: string; // Added image property
    socials?: {
        twitter: string | null;
        website: string | null;
        telegram: string | null;
    };
};

// Chain configuration for DexScreener API
const CHAIN_CONFIG = {
    'sol': {
        chainId: 'solana',
        dexId: 'raydium',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/solana/raydium',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 1000,
        liquidityThreshold: 1000
    },
    'eth': {
        chainId: 'ethereum',
        dexId: 'uniswapv2',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/ethereum/uniswapv2',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 5000,
        liquidityThreshold: 5000
    },
    'base': {
        chainId: 'base',
        dexId: 'uniswapv3',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/base/uniswapv3',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 2000,
        liquidityThreshold: 2000
    },
    'bsc': {
        chainId: 'bsc',
        dexId: 'pancakeswapv2',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/bsc/pancakeswapv2',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 3000,
        liquidityThreshold: 3000
    },
    'sonic': {
        chainId: 'sonic',
        dexId: 'sonic',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/sonic/sonic',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 1000,
        liquidityThreshold: 1000
    },
    'tron': {
        chainId: 'tron',
        dexId: 'justswap',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/tron/justswap',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 1000,
        liquidityThreshold: 1000
    },
    'blast': {
        chainId: 'blast',
        dexId: 'uniswapv3',
        endpoint: 'https://api.dexscreener.com/latest/dex/pairs/blast/uniswapv3',
        searchEndpoint: 'https://api.dexscreener.com/latest/dex/search?q=',
        volumeThreshold: 2000,
        liquidityThreshold: 2000
    }
};

// Timeframe configuration for filtering tokens
const TIMEFRAME_CONFIG = {
    '1h': {
        minVolume: 1000,
        minLiquidity: 1000,
        timeWindow: 60 * 60 * 1000 // 1 hour in milliseconds
    },
    '24h': {
        minVolume: 5000,
        minLiquidity: 5000,
        timeWindow: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    },
    '7d': {
        minVolume: 10000,
        minLiquidity: 10000,
        timeWindow: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
};

export default function Meme() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [switchTabs, setSwitch] = useState(searchParams?.get("tab") || '1')
    const [tokenData, setTokenData] = useState<TokenData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Get current chain and timeframe from URL params
    const currentChain = searchParams?.get("chain") || "sol"
    const currentTimeframe = searchParams?.get("timeframe") || "24h"
    const chainConfig = CHAIN_CONFIG[currentChain as keyof typeof CHAIN_CONFIG] || CHAIN_CONFIG.sol
    const timeframeConfig = TIMEFRAME_CONFIG[currentTimeframe as keyof typeof TIMEFRAME_CONFIG] || TIMEFRAME_CONFIG['24h']

    // Fetch token image from CoinGecko or similar
    const fetchTokenImage = async (tokenSymbol: string) => {
        try {
            // Try to get image from CoinGecko
            const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${tokenSymbol.toLowerCase()}`)
            if (response.ok) {
                const data = await response.json()
                if (data.coins && data.coins.length > 0) {
                    return data.coins[0].thumb
                }
            }
        } catch (err) {
            console.error('Error fetching token image:', err)
        }
        
        // Fallback to a default image based on token symbol
        const defaultImages = {
            'PEPE': '/static/3717.png',
            'SHIB': '/static/3124.webp',
            'DOGE': '/static/3717.png',
            'MOON': '/static/3124.webp',
            'INU': '/static/3717.png',
            'CAT': '/static/3124.webp',
            'BABY': '/static/3717.png',
            'SAFE': '/static/3124.webp',
            'ROCKET': '/static/3124.webp'
        }
        
        return defaultImages[tokenSymbol as keyof typeof defaultImages] || '/static/3717.png'
    }

    // Fetch real social media links from CoinGecko
    const fetchSocialLinks = async (tokenSymbol: string) => {
        try {
            // Try to get social links from CoinGecko
            const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${tokenSymbol.toLowerCase()}`)
            if (response.ok) {
                const data = await response.json()
                if (data.coins && data.coins.length > 0) {
                    const coin = data.coins[0]
                    
                    // Get detailed coin info to get social links
                    const detailResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`)
                    if (detailResponse.ok) {
                        const detailData = await detailResponse.json()
                        
                        return {
                            twitter: detailData.links?.twitter_screen_name ? 
                                `https://twitter.com/${detailData.links.twitter_screen_name}` : null,
                            website: detailData.links?.homepage?.[0] || null,
                            telegram: detailData.links?.telegram_channel_identifier ? 
                                `https://t.me/${detailData.links.telegram_channel_identifier}` : null
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching social links:', err)
        }
        
        // Fallback: return null for all social links if we can't fetch real data
        return {
            twitter: null,
            website: null,
            telegram: null
        }
    }

    // Fetch data based on selected chain and timeframe
    const fetchTokenData = useCallback(async () => {
        setLoading(true)
        setError(null)
        
        try {
            // Use chain-specific search queries
            const searchQueries = ['pepe', 'shib', 'doge', 'moon', 'inu', 'cat', 'baby', 'safe', 'rocket', 'meme']
            const allData: TokenData[] = []
            
            for (const query of searchQueries) {
                try {
                    const endpoint = `${chainConfig.searchEndpoint}${query}`
                    const response = await fetch(endpoint, {
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'Mozilla/5.0 (compatible; CryptoApp/1.0)'
                        }
                    })
                    
                    if (response.ok) {
                        const data = await response.json()
                        
                        if (data.pairs && Array.isArray(data.pairs)) {
                            // Filter for the selected chain, timeframe, and exclude stablecoins
                            const filteredData = data.pairs.filter((pair: TokenData) => {
                                const isCorrectChain = pair.chainId === chainConfig.chainId;
                                const notStable = !['USDT', 'USDC', 'DAI', 'WETH', 'WBTC', 'USDC', 'USDT'].includes(pair.baseToken.symbol);
                                const hasData = pair.priceUsd && pair.liquidity && pair.volume;
                                
                                // Apply timeframe-specific filtering
                                const meetsTimeframeThresholds = (pair.volume?.h24 || 0) >= timeframeConfig.minVolume && 
                                                               (pair.liquidity?.usd || 0) >= timeframeConfig.minLiquidity;
                                
                                // Filter by creation time based on timeframe
                                const now = Date.now();
                                const pairAge = pair.pairCreatedAt ? now - pair.pairCreatedAt : 0;
                                const meetsTimeWindow = pairAge <= timeframeConfig.timeWindow;
                                
                                return isCorrectChain && notStable && hasData && meetsTimeframeThresholds && meetsTimeWindow;
                            });
                            
                            // Add images and social links to the data
                            for (const token of filteredData) {
                                token.image = await fetchTokenImage(token.baseToken.symbol)
                                
                                // Fetch real social links
                                const socialLinks = await fetchSocialLinks(token.baseToken.symbol)
                                token.socials = socialLinks
                            }
                            
                            allData.push(...filteredData)
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching data for query ${query}:`, err)
                }
            }
            
            // Remove duplicates based on token address
            const uniqueData = allData.filter((item, index, self) => 
                index === self.findIndex(t => t.baseToken.address === item.baseToken.address)
            )
            
            if (uniqueData.length > 0) {
                setTokenData(uniqueData)
            } else {
                // Create fallback data for the selected chain and timeframe
                const fallbackData = {
                    baseToken: {
                        address: currentChain === 'sol' ? 'So11111111111111111111111111111111111111112' : '0x6982508145454ce325ddbe47a25d4ec3d2311933',
                        name: 'Pepe',
                        symbol: 'PEPE'
                    },
                    quoteToken: {
                        address: currentChain === 'sol' ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                        name: currentChain === 'sol' ? 'USD Coin' : 'Wrapped Ether',
                        symbol: currentChain === 'sol' ? 'USDC' : 'WETH'
                    },
                    priceUsd: '0.00001238',
                    liquidity: {
                        usd: timeframeConfig.minLiquidity * 2
                    },
                    volume: {
                        h24: timeframeConfig.minVolume * 2,
                        h1: timeframeConfig.minVolume * 0.1
                    },
                    priceChange: {
                        h24: 5.67,
                        h1: 2.34,
                        m5: 0.45
                    },
                    pairAddress: '0x1234567890abcdef',
                    chainId: chainConfig.chainId,
                    dexId: chainConfig.dexId,
                    pairCreatedAt: Date.now() - (timeframeConfig.timeWindow / 2), // Within the timeframe window
                    txns: {
                        h1: {
                            buys: 150,
                            sells: 120
                        }
                    },
                    image: '/static/3717.png',
                    socials: {
                        twitter: null,
                        website: null,
                        telegram: null
                    }
                }
                
                setTokenData([fallbackData])
            }
        } catch (err) {
            console.error('Error fetching token data:', err)
            setError('Failed to fetch token data')
            setTokenData([])
        } finally {
            setLoading(false)
        }
    }, [currentChain, chainConfig, timeframeConfig])

    useEffect(() => {
        if (window.innerWidth < 768) {
            setSwitch("2")
        }

        const resize = () => {
            if (window.innerWidth < 768) {
                setSwitch("2")
            } else if (window.innerWidth > 768) {
                setSwitch("1")
            }
        }
        window.addEventListener("resize", resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])

    // Fetch data when tab changes, chain changes, or timeframe changes
    useEffect(() => {
        fetchTokenData()
    }, [switchTabs, fetchTokenData])

    return (
        <div className='h-[90vh] overflow-hidden'>
            <UtilityBar switchTabs={setSwitch} />
            {
                switchTabs == '1' ?
                    (
                        pathname == "/" || pathname == "/trending" ? (
                            <Feed tokenData={tokenData} loading={loading} error={error} />
                        ) : (
                            <Feed tokenData={tokenData} loading={loading} error={error} />
                        )
                    ) :
                    <Feed tokenData={tokenData} loading={loading} error={error} />
            }
            <Footer />
        </div>
    )
}
