"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { TokenData } from "@/types/token";
import { TokenProvider, useTokens } from "@/contexts/TokenContext";
import { transformTokenData } from "@/lib/utils/token";
import Drawer from '@/components/common/drawer';
import Trade from '@/components/trading/mainSection/trade';
import MobileTradingHeader from '@/components/trading/mobileTrading';
import RightBar from '@/components/trading/rightBar';
import TradingHeader from '@/components/trading/trading';
import { Skeleton } from "@/components/ui/skeleton";
import BuyTab from '@/components/trading/BuyTab';
import SellTab from '@/components/trading/SellTab';
import PoolInfo from '@/components/trading/PoolInfo';
import DegenAudit from '@/components/trading/DegenAudit';

export interface TokenDrawerState {
  buy: boolean;
  sell: boolean;
  info: boolean;
}

// transformTokenData has been moved to @/lib/utils/token

// Helper component for the warning banner
function WarningBanner() {
  return (
    <div className="w-full">
      <div className="text-risk flex justify-center items-center h-[40px] gap-1 bg-riskWarn">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14px" 
          height="14px" 
          fill="#FFD039" 
          viewBox="0 0 14 14"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M8.212 2.093a1.4 1.4 0 00-2.423 0L.517 11.198A1.4 1.4 0 001.73 13.3h10.544a1.4 1.4 0 001.211-2.101L8.212 2.093zM7.001 9.255a.7.7 0 01-.7-.7V5.6a.7.7 0 111.4 0v2.955a.7.7 0 01-.7.7zm.7 1.167a.7.7 0 11-1.4 0 .7.7 0 011.4 0z"
          />
        </svg>
        <p className='text-[12px] font-[500]'>This token has low liquidity. Trade carefully!</p>
      </div>
    </div>
  );
}

// Inner component that consumes the TokenContext
function TokenPageContent({ 
  tokenData,
  isOpen,
  setIsOpen,
  showWarning,
  chain,
  address
}: { 
  tokenData: TokenData;
  isOpen: TokenDrawerState;
  setIsOpen: (state: TokenDrawerState) => void;
  showWarning: boolean;
  chain: string;
  address: string;
}) {
  const { getTokenPrice, getTokenBalance } = useTokens();
  
  return (
    <div className="min-h-screen bg-background">
      {showWarning && <WarningBanner />}

      {/* Desktop View */}
      <div className="md:block hidden">
        <TradingHeader tokenData={tokenData} />
        <div className="flex items-start">
          <Trade chain={chain} address={address} tokenData={tokenData} />
          <RightBar chain={chain} address={address} tokenData={tokenData} />
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <MobileTradingHeader tokenData={tokenData} />
        <Trade chain={chain} address={address} tokenData={tokenData} />
        
        {/* Mobile Trading Bottom Sheet */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-800 z-50">
          <div className="flex justify-around p-2">
            <button 
              onClick={() => setIsOpen({ ...isOpen, buy: true })}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-l-lg transition-colors"
            >
              Buy
            </button>
            <button 
              onClick={() => setIsOpen({ ...isOpen, sell: true })}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-r-lg transition-colors"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <Drawer isOpen={isOpen.buy} onClose={() => setIsOpen({ ...isOpen, buy: false })}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Buy {tokenData.symbol}</h3>
          {/* Replace with your BuyForm component */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
              <input 
                type="number" 
                placeholder="0.0" 
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Buy {tokenData.symbol}
            </button>
          </div>
        </div>
      </Drawer>

      <Drawer isOpen={isOpen.sell} onClose={() => setIsOpen({ ...isOpen, sell: false })}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sell {tokenData.symbol}</h3>
          {/* Replace with your SellForm component */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
              <input 
                type="number" 
                placeholder="0.0" 
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Sell {tokenData.symbol}
            </button>
          </div>
        </div>
      </Drawer>

      <Drawer isOpen={isOpen.info} onClose={() => setIsOpen({ ...isOpen, info: false })}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Token Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Contract:</span>
              <span className="font-mono text-sm">{tokenData.address?.slice(0, 6)}...{tokenData.address?.slice(-4)}</span>
            </div>
            {tokenData.website && (
              <div className="flex justify-between">
                <span className="text-gray-400">Website:</span>
                <a href={tokenData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  Visit
                </a>
              </div>
            )}
            {tokenData.twitter && (
              <div className="flex justify-between">
                <span className="text-gray-400">Twitter:</span>
                <a 
                  href={`https://twitter.com/${tokenData.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:underline"
                >
                  @{tokenData.twitter}
                </a>
              </div>
            )}
            {tokenData.telegram && (
              <div className="flex justify-between">
                <span className="text-gray-400">Telegram:</span>
                <a 
                  href={tokenData.telegram.startsWith('http') ? tokenData.telegram : `https://t.me/${tokenData.telegram}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Join
                </a>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

// Main page component
export default function TokenPage() {
  const params = useParams();
  const { chain, address } = params as { chain: string; address: string };
  const [isOpen, setIsOpen] = useState<TokenDrawerState>({ 
    buy: false, 
    sell: false, 
    info: false 
  });

  // Fetch token data
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ['token', chain, address],
    queryFn: async () => {
      const res = await fetch(`/api/trending-tokens?chain=${chain}&address=${address}`);
      const json = await res.json();
      return transformTokenData(json.data?.[0]);
    },
    enabled: !!chain && !!address,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !tokenData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <div className="text-red-500 text-lg font-medium mb-2">
          Failed to load token data
        </div>
        <p className="text-gray-400">
          {error instanceof Error ? error.message : 'The token could not be found or is not available for trading.'}
        </p>
      </div>
    );
  }

  const showWarning = tokenData.liquidity !== undefined && tokenData.liquidity < 15000;

  // Wrap the page with TokenProvider to make token data available to all child components
  return (
    <div>
      <TokenProvider initialTokens={[tokenData]}>
        <TokenPageContent 
          tokenData={tokenData} 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          showWarning={showWarning}
          chain={chain}
          address={address}
        />

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
          <div className="flex justify-around py-3 px-4">
            <button 
              onClick={() => setIsOpen({ ...isOpen, buy: true })}
              className="bg-primary text-white rounded-lg py-2 px-6 text-sm font-medium flex-1 mx-1"
            >
              Buy
            </button>
            <button 
              onClick={() => setIsOpen({ ...isOpen, sell: true })}
              className="bg-transparent border border-primary text-primary rounded-lg py-2 px-6 text-sm font-medium flex-1 mx-1"
            >
              Sell
            </button>
            <button 
              onClick={() => setIsOpen({ ...isOpen, info: true })}
              className="flex flex-col items-center justify-center text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.577 0 0 3.577 0 8s3.577 8 8 8 8-3.577 8-8-3.577-8-8-8zm0 12.571a1.146 1.146 0 01-1.143-1.142c0-.629.514-1.143 1.143-1.143s1.143.514 1.143 1.143c0 .628-.514 1.142-1.143 1.142zM9.143 8c0 .629-.514 1.143-1.143 1.143A1.146 1.146 0 016.857 8V4.571c0-.628.514-1.142 1.143-1.142s1.143.514 1.143 1.142V8z"/>
              </svg>
              <span className="text-xs">Info</span>
            </button>
          </div>
        </div>

        {/* Info Drawer */}
        <Drawer isOpen={isOpen.info} onClose={() => setIsOpen({ ...isOpen, info: false })}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Token Information</h2>
            <PoolInfo chain={chain} address={address} />
            <DegenAudit chain={chain} address={address} />
          </div>
        </Drawer>
      </TokenProvider>
    </div>
  );
}