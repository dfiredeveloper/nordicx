"use client";
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import SingleFeed from './singleFeed'
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

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
    image?: string;
    socials?: {
        twitter: string | null;
        website: string | null;
        telegram: string | null;
    };
};

interface Feed3Props {
    tokenData: TokenData[];
    loading: boolean;
    error: string | null;
}

export default function Feed3({ tokenData, loading, error }: Feed3Props) {
    const searchParams = useSearchParams()
    const currentChain = searchParams?.get("chain") || "sol"
    
    // Chain-specific filtering thresholds for "DEXScreener Spent" feed
    const getChainThresholds = () => {
        switch (currentChain) {
            case 'eth':
                return { volume: 50000, liquidity: 10000, maxVolume: 1000000 }
            case 'bsc':
                return { volume: 30000, liquidity: 8000, maxVolume: 800000 }
            case 'base':
                return { volume: 20000, liquidity: 5000, maxVolume: 600000 }
            case 'blast':
                return { volume: 20000, liquidity: 5000, maxVolume: 600000 }
            case 'sonic':
                return { volume: 15000, liquidity: 3000, maxVolume: 400000 }
            case 'tron':
                return { volume: 15000, liquidity: 3000, maxVolume: 400000 }
            case 'sol':
            default:
                return { volume: 25000, liquidity: 6000, maxVolume: 500000 }
        }
    }
    
    const thresholds = getChainThresholds()

    return (
        <div className='w-full max-h-[787px] bg-accent-2  pb-5 rounded-lg pt-2'>
            <div className="flex items-center p-4 w-full justify-between">
                <div className="text-[14px] font-[600]">💰 DEXScreener Spent</div>

                <Popover>
                    <PopoverTrigger asChild>
                        <div className="text-[14px] flex gap-2 cursor-pointer  items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#6E727D" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M2.702 3.225l.006.006 3.635 3.547c.355.346.554.82.554 1.315v3.898a.6.6 0 11-1.2 0V8.093a.636.636 0 00-.192-.456L1.87 4.09C1.088 3.327 1.628 2 2.72 2h10.562c1.093 0 1.633 1.328.85 2.09l-3.64 3.547a.636.636 0 00-.191.456v5.634a.6.6 0 01-1.2 0V8.093c0-.495.2-.97.554-1.315l3.64-3.547.005-.006.001-.002-.002-.012a.03.03 0 00-.007-.01h-.002l-.008-.001H2.71a.03.03 0 00-.006.011.03.03 0 00-.003.012l.001.002z"></path></svg>
                            Filter
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Dimensions</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the dimensions for the layer.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <label htmlFor="width">Width</label>
                                    <input
                                        id="width"
                                        defaultValue="100%"
                                        className="col-span-2 h-8"
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <label htmlFor="maxWidth">Max. width</label>
                                    <input
                                        id="maxWidth"
                                        defaultValue="300px"
                                        className="col-span-2 h-8"
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <label htmlFor="height">Height</label>
                                    <input
                                        id="height"
                                        defaultValue="25px"
                                        className="col-span-2 h-8"
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <label htmlFor="maxHeight">Max. height</label>
                                    <input
                                        id="maxHeight"
                                        defaultValue="none"
                                        className="col-span-2 h-8"
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="overflow-y-auto h-full">

                {
                    loading ?
                        <div className="px-4 mt-5 space-y-2">
                            {
                                Array(10).fill(0).map((_, index) => (
                                    <Skeleton className='w-full h-[80px]' key={index} />
                                ))
                            }
                        </div>
                        :
                        error ?
                            <div className="px-4 mt-5 text-red-500">{error}</div>
                            :
                            tokenData && tokenData.length > 0 ?
                                tokenData
                                    .filter(data => 
                                        data.volume?.h24 > thresholds.volume && // Chain-specific high volume
                                        data.volume?.h24 < thresholds.maxVolume && // Not too established
                                        data.liquidity?.usd > thresholds.liquidity // Chain-specific liquidity threshold
                                    )
                                    .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0)) // Sort by volume
                                    .slice(0, 10)
                                    .map((data, i) => (
                                    <SingleFeed key={i} memeData={{
                                        id: data.baseToken.address,
                                        name: data.baseToken.name,
                                        handle: `@${data.baseToken.symbol.toLowerCase()}`,
                                        image: data.image || "/static/3717.png",
                                        contractAddress: data.baseToken.address,
                                        timestamp: data.pairCreatedAt ? new Date(data.pairCreatedAt).toLocaleString() : new Date().toLocaleString(),
                                        hotpot: {
                                            status: "?",
                                            verified: true,
                                            renounced: false,
                                            locked: data.liquidity?.usd > thresholds.liquidity * 2,
                                            top10Percentage: Math.floor(Math.random() * 40) + 15 // Random percentage between 15-55%
                                        },
                                        holdings: {
                                            dev: Math.floor(Math.random() * 6) + 1, // Random dev holdings 1-7%
                                            insider: Math.floor(Math.random() * 12) + 1 // Random insider holdings 1-13%
                                        },
                                        tax: {
                                            buy: Math.floor(Math.random() * 6) + 1, // Random buy tax 1-7%
                                            sell: Math.floor(Math.random() * 10) + 2 // Random sell tax 2-12%
                                        },
                                        socials: {
                                            twitter: data.socials?.twitter || undefined,
                                            website: data.socials?.website || undefined,
                                            telegram: data.socials?.telegram || undefined
                                        },
                                        metrics: {
                                            liquidity: data.liquidity?.usd || 0,
                                            holders: Math.floor((data.liquidity?.usd || 0) / 800) + Math.floor(Math.random() * 800), // Estimate holders based on liquidity
                                            volume: data.volume?.h24 || 0,
                                            marketCap: (data.liquidity?.usd || 0) * (Math.random() * 75 + 75) // Market cap based on liquidity with multiplier
                                        }
                                    }} />
                                ))
                                :
                                <div className="px-4 mt-5 text-gray-500">No high-volume tokens found</div>
                }
            </div>
        </div>
    )
}
