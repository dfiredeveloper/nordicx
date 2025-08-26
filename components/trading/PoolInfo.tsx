import React from 'react';
import { formatNumber } from '@/lib/utils';
import { TokenData } from '@/types/token';

interface TokenPoolData {
    liquidity_usd?: number | string | null;
    market_cap?: number | string | null;
    volume_24h?: number | string | null;
    holders_count?: number | string | null;
    [key: string]: unknown;
}

interface PoolInfoProps {
    chain: string;
    address: string;
    tokenData?: TokenPoolData | null;
}

export function PoolInfo({ chain, address, tokenData }: PoolInfoProps) {
    const safeFormat = (value: unknown): string => {
        if (value === undefined || value === null || value === '--') return '--';
        try {
            const num = typeof value === 'string' ? parseFloat(value) : Number(value);
            return isNaN(num) ? '--' : `$${formatNumber(num)}`;
        } catch (e) {
            return '--';
        }
    };

    const formatHolders = (value: unknown): string => {
        if (value === undefined || value === null) return '--';
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') return value || '--';
        return '--';
    };

    return (
        <div className="mt-3 w-full flex flex-col bg-accent-search rounded-xl p-3">
            <div className="w-full flex justify-between items-center pb-2">
                <h2 className='text-white text-sm'>Pool info</h2>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="#9AA0AA" 
                    viewBox="0 0 20 20"
                    className="cursor-pointer"
                >
                    <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10zM6.465 5.501a.386.386 0 00-.266.11L4.39 7.42a.188.188 0 00.133.32h9.164c.101 0 .197-.04.266-.109l1.81-1.81a.188.188 0 00-.133-.32H6.465zm0 6.758a.376.376 0 00-.266.11l-1.81 1.81a.188.188 0 00.133.32h9.164c.101 0 .197-.04.266-.11l1.81-1.81a.188.188 0 00-.133-.32H6.465zm7.487-3.289a.376.376 0 00-.266-.11H4.522a.188.188 0 00-.133.321l1.81 1.81c.07.07.165.11.266.11h9.164a.188.188 0 00.133-.32l-1.81-1.81z"
                    />
                </svg>
            </div>
            <div className="w-full text-xs text-accent-aux-1 space-y-2">
                <div className="flex w-full justify-between items-center">
                    <p>Total liq</p>
                    <p className="text-white">
                        {safeFormat(tokenData?.liquidity_usd)}
                    </p>
                </div>
                <div className="flex w-full justify-between items-center">
                    <p>FDV</p>
                    <p className="text-white">
                        {safeFormat(tokenData?.market_cap)}
                    </p>
                </div>
                <div className="flex w-full justify-between items-center">
                    <p>24h Vol</p>
                    <p className="text-white">
                        {safeFormat(tokenData?.volume_24h)}
                    </p>
                </div>
                <div className="flex w-full justify-between items-center">
                    <p>Holders</p>
                    <p className="text-white">
                        {formatHolders(tokenData?.holders_count)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PoolInfo;
