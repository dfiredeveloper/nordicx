import React from 'react'
import Feed1 from './feed1'
import Feed2 from './feed2'
import Feed3 from './feed3'

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
};

interface FeedProps {
    tokenData: TokenData[];
    loading: boolean;
    error: string | null;
}

export default function Feed({ tokenData, loading, error }: FeedProps) {
  return (
    <div className='grid grid-cols-3 px-[1.3rem] h-[781px] gap-5'>
        <Feed1 tokenData={tokenData} loading={loading} error={error} />
        <Feed2 tokenData={tokenData} loading={loading} error={error} />
        <Feed3 tokenData={tokenData} loading={loading} error={error} />
    </div>
  )
}
