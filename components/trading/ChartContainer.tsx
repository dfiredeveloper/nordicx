import { useMemo, useEffect, useState } from 'react';

interface ChartContainerProps {
  chain: string;
  address: string;
}

const CHAIN_MAP: Record<string, string> = {
  sol: 'solana',
  solana: 'solana',
  eth: 'ethereum',
  ethereum: 'ethereum',
  bsc: 'bsc',
  binance: 'bsc',
  polygon: 'polygon',
  matic: 'polygon',
  arbitrum: 'arbitrum',
  optimism: 'optimism',
  base: 'base',
  avalanche: 'avalanche',
  avax: 'avalanche',
  fantom: 'fantom',
  ftm: 'fantom',
  celo: 'celo',
  cronos: 'cronos',
  zk: 'zksync',
  zksync: 'zksync',
  moonbeam: 'moonbeam',
  moonriver: 'moonriver',
  harmony: 'harmony',
  aurora: 'aurora',
  kava: 'kava',
  metis: 'metis',
  canto: 'canto',
  linea: 'linea',
  scroll: 'scroll',
  manta: 'manta',
  blast: 'blast',
};

export default function ChartContainer({ chain, address }: ChartContainerProps) {
  // Normalize chain for DexScreener
  const dsChain = useMemo(() => {
    if (!chain) return '';
    const key = chain.toLowerCase();
    return CHAIN_MAP[key] || key;
  }, [chain]);

  const valid = dsChain && address && address.length > 20;
  const widgetUrl = valid
    ? `https://dexscreener.com/${dsChain}/${address}?embed=1&theme=dark`
    : '';

  // Responsive: adjust height and margin for mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: restore original values. Mobile: show info message only.
  const containerHeight = 370;
  const iframeHeight = 900;
  const marginTop = -167;

  return (
    <div className="w-full h-full bg-black rounded-lg">
      {isMobile ? (
        <div className="w-full h-[250px] flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-lg mb-2">📊</div>
            <div className="text-sm font-semibold">Pro API Required for Chart</div>
            <div className="text-xs mt-1">Free API only supports desktop view</div>
          </div>
        </div>
      ) : valid ? (
        <div
          style={{
            width: '127%',
            height: containerHeight,
            overflow: 'hidden',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <iframe
            src={widgetUrl}
            title="DexScreener Chart"
            style={{
              width: '100%',
              height: iframeHeight,
              border: 0,
              borderRadius: 8,
              marginTop: marginTop,
            }}
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full h-[calc(100%-40px)] min-h-[250px] flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-lg mb-2">📊</div>
            <div className="text-sm">No chart available for this token</div>
            <div className="text-xs mt-1">Check if the token address and chain are correct</div>
          </div>
        </div>
      )}
    </div>
  );
} 