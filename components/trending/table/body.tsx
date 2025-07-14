import { copyToClipboard, formatNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CmcTrendingToken } from "@/lib/services/coinmarketcap";
import { useSearchParams } from "next/navigation";
import MiniChart from "@/components/ui/mini-chart";

// Function to format age in human-readable format
const formatAge = (days: number): string => {
    if (days < 1) {
        return "Today";
    } else if (days === 1) {
        return "1 day";
    } else if (days < 30) {
        return `${days} days`;
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months}mon`;
    } else {
        const years = Math.floor(days / 365);
        return `${years}yr`;
    }
};

// Function to generate mock sparkline data
const generateMockSparkline = (token: CmcTrendingToken): number[] => {
    const basePrice = token.price || 1;
    const data = [basePrice];
    
    // Generate 30 data points with random variations
    for (let i = 1; i < 30; i++) {
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const newPrice = data[i-1] * (1 + variation);
        data.push(Math.max(newPrice, 0.000001));
    }
    
    return data;
};

export default function TableBody() {
    const searchParams = useSearchParams();
    const chain = searchParams?.get("chain") || "eth";
    const timeframe = searchParams?.get("timeframe") || "24h";
    const [tokens, setTokens] = useState<CmcTrendingToken[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    // Store sparkline data for each token symbol
    const [sparklines, setSparklines] = useState<Record<string, number[] | null>>({});
    const [sparklineLoading, setSparklineLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLoading(true);
        fetch(`/api/trending-tokens?chain=${chain}&timeframe=${timeframe}&limit=300`)
            .then(res => res.json())
            .then(data => {
                // Map API response to CmcTrendingToken[]
                const tokens: CmcTrendingToken[] = Array.isArray(data.data) ? data.data.map((token: unknown) => {
                    if (
                        typeof token === 'object' && token !== null &&
                        'id' in token && 'name' in token && 'symbol' in token &&
                        'quote' in token && typeof (token as { quote: unknown }).quote === 'object' &&
                        'USD' in (token as { quote: { USD: unknown } }).quote
                    ) {
                        const t = token as {
                            id: number;
                            name: string;
                            symbol: string;
                            platform?: { name: string; address?: string };
                            quote: { USD: {
                                price: number;
                                percent_change_1h: number;
                                percent_change_24h: number;
                                percent_change_7d: number;
                                market_cap: number;
                                volume_24h: number;
                            }};
                            logo?: string;
                            age?: number;
                            contract_address?: string;
                            holders_count?: number;
                            buy_tx_1m?: number;
                            sell_tx_1m?: number;
                            total_tx_1m?: number;
                            liquidity_usd?: number;
                            pool_address?: string;
                        };
                        return {
                            id: t.id,
                            name: t.name,
                            symbol: t.symbol,
                            price: t.quote.USD.price,
                            percent_change_1h: t.quote.USD.percent_change_1h,
                            percent_change_24h: t.quote.USD.percent_change_24h,
                            percent_change_7d: t.quote.USD.percent_change_7d,
                            market_cap: t.quote.USD.market_cap,
                            volume_24h: t.quote.USD.volume_24h,
                            platform: t.platform?.name || 'Ethereum',
                            logo: t.logo || null,
                            age: t.age,
                            contract_address: t.contract_address,
                            holders_count: t.holders_count || 0,
                            buy_tx_1m: t.buy_tx_1m || 0,
                            sell_tx_1m: t.sell_tx_1m || 0,
                            total_tx_1m: t.total_tx_1m || 0,
                            liquidity_usd: t.liquidity_usd || 0,
                            pool_address: t.pool_address || '',
                        };
                    }
                    return null;
                }).filter(Boolean) as CmcTrendingToken[] : [];
                setTokens(tokens);
                setLoading(false);
                // Fetch sparklines for all tokens - use real data for supported, mock for others
                tokens.forEach(token => {
                  const symbol = token.symbol.toLowerCase();
                  const supportedSymbols = ["btc","eth","pepe","shib","doge","sol","arb","link"];
                  
                  if (supportedSymbols.includes(symbol)) {
                    // Try to get real data for supported tokens
                    setSparklineLoading(prev => ({ ...prev, [symbol]: true }));
                    fetch(`/api/token-sparkline?symbol=${symbol}`)
                      .then(res => res.json())
                      .then(data => {
                        setSparklines(prev => ({ ...prev, [symbol]: data.success ? data.prices : null }));
                        setSparklineLoading(prev => ({ ...prev, [symbol]: false }));
                      })
                      .catch(() => {
                        setSparklines(prev => ({ ...prev, [symbol]: null }));
                        setSparklineLoading(prev => ({ ...prev, [symbol]: false }));
                      });
                  } else {
                    // Generate mock data for unsupported tokens
                    const mockData = generateMockSparkline(token);
                    setSparklines(prev => ({ ...prev, [symbol]: mockData }));
                  }
                });
            })
            .catch(() => {
                setTokens([]);
                setLoading(false);
            });
    }, [chain, timeframe]);

    if (loading) {
        return <tbody><tr><td colSpan={12} className="text-center py-10">Loading trending tokens...</td></tr></tbody>;
    }
    if (!tokens || tokens.length === 0) {
        return <tbody><tr><td colSpan={12} className="text-center py-10">No trending tokens found.</td></tr></tbody>;
    }

    return (
        <tbody className="md:text-[14px] text-[13px] divide-y">
            {tokens.map((token, index) => {
                console.log('Token logo:', token.logo, 'for', token.name);
                // Use real sparkline if available, else show no data
                const symbol = token.symbol.toLowerCase();
                const sparklineData = sparklines[symbol];
                const isLoadingSpark = sparklineLoading[symbol];
                
                // Check if we have valid sparkline data
                const hasValidSparkline = sparklineData && 
                  sparklineData.length >= 2; // At least 2 data points for a chart
                
                return (
                    <tr key={token.id}>
                <td className="py-3 px-2 sticky z-[1] left-0 bg-accent-2 ">
                    {/* token */}
                        <Link role="button" className="flex items-center md:w-[290px] w-[136px] md:flex-[290px] flex-[136px]" href={`/${token.platform?.toLowerCase() || 'eth'}/token/${token.id}`}>
                        <div className="flex items-center gap-2">
                            <div className=""><svg xmlns="http://www.w3.org/2000/svg" className="md:w-[16px] w-[13px]" width="16px" height="16px" fill="#AEB2BD" viewBox="0 0 16 16"><g clipPath="url(#clip0_6939_489)"><path fillRule="evenodd" clipRule="evenodd" d="M6.421.99a1.754 1.754 0 013.158 0l1.587 3.127 3.352.603c1.414.254 1.976 2.051.975 3.121l-2.37 2.536.484 3.5c.204 1.477-1.267 2.587-2.554 1.93L8 14.245l-3.053 1.56c-1.287.658-2.758-.452-2.554-1.929l.484-3.5L.507 7.84c-1-1.07-.439-2.867.975-3.121l3.352-.603L6.421.99z"></path></g><defs><clipPath id="clip0_6939_489"><rect width="16" height="16"></rect></clipPath></defs></svg></div>
                            <div className="flex items-center gap-1">
                                <div className="rounded-full border w-fit relative">
                                    {(() => { console.log('Token logo:', token.logo, 'for', token.name); return null; })()}
                                    <Image src={token.logo ? token.logo : "/static/3717.png"} className='md:w-[30px] w-[25px] md:h-[30px] h-[25px]' width={35} height={35} alt={token.name} unoptimized />
                                    {/* No chain icon for now */}
                                </div>
                                <div className="">
                                        {/* token name */}
                                    <div className="flex items-center gap-1">
                                            <h1 className="uppercase md:text-[14px] text-[13px] font-[400]">{token.name}</h1>
                                            <span className="text-xs text-accent-1">{token.symbol}</span>
                                        </div>
                                    <div className="flex items-center gap-1">
                                        <div className="md:flex hidden items-center gap-1`">
                                                <p className='text-[#AEB2DB] text-[12px]'>
                                                  {token.contract_address ? `${token.contract_address.slice(0, 6)}...${token.contract_address.slice(-4)}` : '--'}
                                                </p>
                                                <button
                                                  onClick={e => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    copyToClipboard(token.contract_address ? token.contract_address : '--');
                                                    setCopiedIndex(index);
                                                    setTimeout(() => setCopiedIndex(null), 1200);
                                                  }}
                                                  style={{ position: 'relative', background: 'none', border: 'none', padding: 0, marginLeft: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                  aria-label="Copy contract address"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="#AEB2BD" viewBox="0 0 12 12"><g clipPath="url(#clip0_6972_490)"><path d="M.5 5.214a2.357 2.357 0 012.357-2.357h3.929a2.357 2.357 0 012.357 2.357v3.929A2.357 2.357 0 016.786 11.5H2.857A2.357 2.357 0 01.5 9.143V5.214z"></path><path d="M2.987 2.084c.087-.008.174-.013.263-.013h3.929a2.75 2.75 0 012.75 2.75V8.75c0 .089-.005.177-.013.263A2.358 2.358 0 0011.5 6.786V2.857A2.357 2.357 0 009.143.5H5.214c-1.03 0-1.907.662-2.227 1.584z"></path></g><defs><clipPath id="clip0_6972_490"><rect width="12" height="12"></rect></clipPath></defs></svg>
                                                  {copiedIndex === index && (
                                                    <span style={{
                                                      position: 'absolute',
                                                      top: '-22px',
                                                      left: '50%',
                                                      transform: 'translateX(-50%)',
                                                      background: '#222',
                                                      color: '#fff',
                                                      borderRadius: '4px',
                                                      padding: '2px 8px',
                                                      fontSize: '11px',
                                                      zIndex: 10,
                                                      pointerEvents: 'none',
                                                    }}>CA Copied</span>
                                                  )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </td>
                <td className="py-3 px-2">
                    {/* age */}
                    <div className="flex md:w-[107px] w-[84px] md:flex-[107px] flex-[84px]">
                        <p className="text-accent-aux-1">{typeof token.age === 'number' ? formatAge(token.age) : '--'}</p>
                    </div>
                </td>
                <td className="py-3 px-2">
                        {/* liq/initial */}
                    <div className="md:w-[131px] w-[84px] md:flex-[131px] flex-[84px]">
                            <div className="">USDT <span className="text-accent-red">{token.liquidity_usd ? `$${formatNumber(token.liquidity_usd)}` : '--'}</span></div>
                            <div className="text-accent-green text-[12px]">{token.percent_change_24h > 0 ? '+' : ''}{token.percent_change_24h.toFixed(2)}%</div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* HOLDER */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                            <div className="text-accent-1">{token.holders_count ? formatNumber(token.holders_count) : '--'}</div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* 1m txs */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                            <div className="text-[#ff9839] text-[13px]">{token.total_tx_1m ? formatNumber(token.total_tx_1m) : '--'}</div>
                        <div className="flex text-[12px] items-center">
                                <span className="text-accent-green">{token.buy_tx_1m ? formatNumber(token.buy_tx_1m) : '--'}</span>/
                                <span className="text-accent-red">{token.sell_tx_1m ? formatNumber(token.sell_tx_1m) : '--'}</span>
                        </div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* 1m vol */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                            <div className="text-accent-1">{formatNumber(token.volume_24h)}</div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* PRICE */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                        <div className="text-[#AEB2DB]">
                          {typeof token.price === 'number'
                            ? `$${token.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 6
                                }).replace(/\.0+$/, '')}`
                            : '--'}
                    </div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* 1h% */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                            <div className={token.percent_change_1h > 0 ? "text-accent-green" : "text-accent-red"}>
                              {typeof token.percent_change_1h === 'number'
                                ? `${token.percent_change_1h > 0 ? '+' : ''}${token.percent_change_1h.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`
                                : '--'}
                        </div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* 24h% */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                            <div className={token.percent_change_24h > 0 ? "text-accent-green" : "text-accent-red"}>
                              {typeof token.percent_change_24h === 'number'
                                ? `${token.percent_change_24h > 0 ? '+' : ''}${token.percent_change_24h.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`
                                : '--'}
                            </div>
                    </div>
                </td>
                <td className="py-3 px-2">
                    {/* 7d% */}
                    <div className="md:w-[96px] w-[84px] md:flex-[96px] flex-[84px]">
                            <div className={token.percent_change_7d > 0 ? "text-accent-green" : "text-accent-red"}>
                              {typeof token.percent_change_7d === 'number'
                                ? `${token.percent_change_7d > 0 ? '+' : ''}${token.percent_change_7d.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`
                                : '--'}
                            </div>
                    </div>
                </td>
                <td className="py-3 px-2 -ml-2">
                    <div className="flex items-center justify-center w-[351px] flex-[351px]">
                        {isLoadingSpark ? (
                          <div className="w-[100px] h-[36px] flex items-center justify-center animate-pulse text-xs text-gray-400">...</div>
                        ) : hasValidSparkline ? (
                          <MiniChart
                            data={sparklineData}
                            isPositive={sparklineData[0] < sparklineData[sparklineData.length-1]}
                            width={100}
                            height={36}
                          />
                        ) : (
                          <div className="w-[100px] h-[36px] flex items-center justify-center text-xs text-gray-400">
                            No data
                          </div>
                        )}
                    </div>
                </td>
                </tr>
                );
            })}
        </tbody>
    );
}
