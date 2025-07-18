"use client";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Switch } from "@/components/ui/switch"
import { truncAddress } from "@/lib/utils"
import Image from "next/image";
import { useEffect, useState } from "react"
import ChartContainer from '../ChartContainer';

export default function Trade({ chain, address }: { chain: string; address: string }) {
    const [resize, setResize] = useState<"vertical" | "horizontal">("vertical")
    const [toggleLeftPane, setLeftPaneToggle] = useState(false)
    return (
        <div className="md:w-[calc(100vw-300px)] md:h-[calc(100vh-160px)] w-full h-full flex p-[6px]">
            <div className={`${toggleLeftPane ? 'md:block' : 'hidden'} w-[300px] overflow-hidden px-2 space-y-2`}>
                <div className="flex justify-between text-[13px] w-full gap-2">
                    <div className="flex gap-2">
                        <div className="">Trending</div>
                        <div className="text-accent-aux-1">Pump</div>
                    </div>

                    <button className="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="#F5F5F5" viewBox="0 0 16 16"><path d="M6.048 12.537a.6.6 0 01-.35-.546V8.093a.636.636 0 00-.193-.456L1.87 4.09C1.088 3.327 1.628 2 2.72 2h10.562c1.093 0 1.633 1.328.85 2.09l-3.64 3.547a.636.636 0 00-.191.456v5.634a.593.593 0 01-.006.085.582.582 0 01-.855.52l-3.392-1.795z"></path></svg>
                    </button>
                </div>

                <div onClick={() => setLeftPaneToggle(false)} className="flex justify-center relative">
                    <div className="absolute dark:bg-accent-aux-1 right-0 p-[2px] cursor-pointer rounded-tl-[8px] rounded-bl-[8px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="#9AA0AA" viewBox="0 0 20 20">
                            <path d="M12.322 9.582l4.705 4.706-1.607 1.606-6.312-6.312 6.313-6.312 1.606 1.606-4.705 4.706zm-6.887 0l4.706 4.706-1.607 1.606-6.312-6.312L8.419 3.27l1.722 1.606-4.706 4.706z"></path>
                        </svg>
                    </div>
                    <div className="bg-transparent border rounded-[8px] flex items-center flex-wrap gap-[8px] w-fit ">
                        <div className="px-[8px] py-[4px] flex bg-transparent border-r text-accent-aux-1 cursor-pointer text-[12px] rounded-tl-[8px] rounded-bl-[8px] mr-[-1px] justify-center">1m</div>
                        <div className="px-[8px] py-[4px] flex bg-transparent border-r text-accent-aux-1 cursor-pointer text-[12px] rounded-tl-[8px] rounded-bl-[8px] mr-[-1px] justify-center">5m</div>
                        <div className="px-[8px] py-[4px] flex bg-transparent border-r text-accent-aux-1 cursor-pointer text-[12px] rounded-tl-[8px] rounded-bl-[8px] mr-[-1px] justify-center">1h</div>
                        <div className="px-[8px] py-[4px] flex bg-transparent border-r text-accent-aux-1 cursor-pointer text-[12px] rounded-tl-[8px] rounded-bl-[8px] mr-[-1px] justify-center">6h</div>
                        <div className="px-[8px] py-[4px] flex bg-transparent  text-accent-aux-1 cursor-pointer text-[12px] rounded-tl-[8px] rounded-bl-[8px] mr-[-1px] justify-center">24h</div>
                    </div>
                </div>


                {/* table */}
                <div className="flex flex-row border-b border-accent-3 text-accent-aux-1 justify-between">
                    {/* th 1 */}
                    <div className="flex gap-[4px] py-[10px] items-center w-1/2 whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="flex gap-1 items-center cursor-pointer">
                            <div className="text-[12px]">Token</div>
                            <div className="scale-80">
                                <div className="flex cursor-pointer rotate-180 text-accent-aux-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                                </div>
                                <div className="flex cursor-pointer dark:text-[#f5f5f5]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <span className="text-[12px]">/</span>
                        <div className="flex gap-1 items-center cursor-pointer">
                            <div className="text-[12px]">TXs</div>
                            <div className="scale-80">
                                <div className="flex cursor-pointer rotate-180 text-accent-aux-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                                </div>
                                <div className="flex cursor-pointer text-accent-aux-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* th 2 */}

                    <div className="flex gap-[4px] py-[10px] px-[10.58px] items-center justify-end whitespace-nowrap w-1/2 dark:text-[f5f5f5]">
                        <div className="flex items-center gap-1">
                            <div className="text-[12px]">Price</div>
                            <div className="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M9.37 1.846a.6.6 0 01.654.13l4 4a.6.6 0 01-.848.848L10.2 3.85V13.6a.6.6 0 11-1.2 0V2.4a.6.6 0 01.37-.554z"></path><path fillRule="evenodd" clipRule="evenodd" d="M6.63 14.154a.6.6 0 01-.654-.13l-4-4a.6.6 0 01.848-.848L5.8 12.152V2.4a.6.6 0 011.2 0v11.2a.6.6 0 01-.37.554z"></path></svg>
                            </div>
                        </div>
                        <span className="text-[12px]">/</span>
                        <div className="flex items-center gap-1">
                            <div className="text-[12px]">%</div>
                            <div className="scale-80">
                                <div className="flex cursor-pointer rotate-180 text-accent-aux-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                                </div>
                                <div className="flex cursor-pointer dark:text-[#f5f5f5]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BODY AREA */}
                <div className="overflow-y-auto h-full">
                    {
                        Array.from({ length: 15 }).map((_, key) => (
                            <div key={key} className="flex flex-row border-b border-accent-3 text-accent-aux-1 justify-between">
                                {/* th 1 */}
                                <div className="flex gap-[4px]  items-center w-1/2 whitespace-nowrap dark:text-[f5f5f5]">

                                    <div className="rounded-full border w-fit relative">
                                        <Image src={"/static/3717.png"} className='md:min-w-[30px] w-[25px] md:h-[30px] h-[25px]' width={35} height={35} alt='' />
                                        <Image src={"/static/ether.webp"} className='md:min-w-[15px] w-[10px] md:h-[15px] h-[10px] absolute bottom-0 right-0' width={15} height={15} alt='' />
                                    </div>

                                    <div className="">
                                        <h2 className="dark:text-[#f5f5f5] text-[13px] font-[500]">FBI</h2>
                                        <div className="flex items-center gap-1">
                                            <p className="text-accent-aux-1 text-[13px]">1K(527/723)</p>
                                            <p className="text-accent-green text-[12px]">1m</p>
                                        </div>
                                    </div>
                                </div>

                                {/* th 2 */}
                                <div className="flex flex-col gap-[1px] py-[10px] items-end justify-end whitespace-nowrap w-1/2 dark:text-[f5f5f5]">
                                    <div className="dark:text-[#9AA0AA] text-[12px] font-[500]">$1.25436</div>
                                    <div className="text-accent-green text-[12px]">+25k+</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <ResizablePanelGroup direction={resize} className="md:block hidden">
                <ResizablePanel minSize={20} maxSize={90}>
                    <div className="bg-black w-full h-full overflow-y-auto">
                        <ChartContainer chain={chain} address={address} />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={20} maxSize={90} className="overflow-y-auto">
                    <div className="h-full w-full overflow-scroll">
                        <TradeTable setResize={setResize} address={address} chain={chain} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* mobile view */}
            <div className="w-full md:hidden">
                <div className="bg-black w-full h-[400px]">
                    <ChartContainer chain={chain} address={address} />
                </div>
                <div className="w-full overflow-scroll">
                    <TradeTable setResize={setResize} address={address} chain={chain} />
                </div>
            </div>

            {/* left */}
            {!toggleLeftPane && <div onClick={() => setLeftPaneToggle(true)} className="hidden absolute top-[100px] left-0 md:flex dark:bg-accent-aux-1 items-center justify-center cursor-pointer h-[44px] w-[28px] rounded-tr-[12px] rounded-br-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="#9AA0AA" viewBox="0 0 20 20">
                    <path d="M12.322 9.582l4.705 4.706-1.607 1.606-6.312-6.312 6.313-6.312 1.606 1.606-4.705 4.706zm-6.887 0l4.706 4.706-1.607 1.606-6.312-6.312L8.419 3.27l1.722 1.606-4.706 4.706z"></path>
                </svg>
            </div>}
        </div>
    )
}

export function TradeTable({ setResize, address, chain }) {
    return (
        <div className="relative">
            <div className="sticky top-0 dark:bg-[#111111] flex gap-2 overflow-x-scroll items-center justify-between py-[10px] px-[12px]">
                <div className="flex items-center gap-2">
                    <div className="cursor-pointer" onClick={() => setResize((prev) => prev == "horizontal" ? "vertical" : "horizontal")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#5C6068" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M3 1h5v14H3a2 2 0 01-2-2V3a2 2 0 012-2zM0 3a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H3a3 3 0 01-3-3V3z"></path></svg>
                    </div>
                    <div className="flex gap-[15px] text-accent-aux-1 text-[13px] font-[400] capitalize">
                        <div className="dark:hover:text-[#f5f5f5] cursor-pointer transition-all">Activity</div>
                        <div className="dark:hover:text-[#f5f5f5] cursor-pointer transition-all">Traders</div>
                        <div className="flex gap-1 items-center dark:hover:text-[#f5f5f5] cursor-pointer transition-all">
                            <div>Holders</div>
                            <div>10.83k</div>
                        </div>
                        <div className="dark:hover:text-[#f5f5f5] cursor-pointer transition-all">Following</div>
                        <div className="dark:hover:text-[#f5f5f5] cursor-pointer transition-all">position</div>
                        <div className="dark:hover:text-[#f5f5f5] cursor-pointer transition-all">limit</div>
                        <div className="dark:hover:text-[#f5f5f5] cursor-pointer transition-all">Auto</div>
                    </div>
                    <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#5C6068" viewBox="0 0 12 12"><path d="M6.872 8.86a1 1 0 01-1.627 0L2.188 4.582A1 1 0 013.002 3h6.113a1 1 0 01.814 1.581l-3.057 4.28z"></path></svg>
                    </div>
                </div>

                <div className="flex space-x-2 font-[400]">
                    <p className="sm:text-[14px] text-[12px] capitalize whitespace-nowrap">on click</p>
                    <Switch />
                </div>
            </div>
            {/*  */}

            {/* table */}
            <DataTable address={address} chain={chain} />

        </div>
    )
}


export function DataTable({ address, chain }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [summary, setSummary] = useState<any>(null); // For non-Solana summary stats

    // Supported chains for DexScreener
    const supportedChains = [
        'sol', 'solana', 'eth', 'ethereum', 'bsc', 'binance', 'base', 'blast', 'polygon', 'matic', 'arbitrum', 'optimism', 'avalanche', 'avax'
    ];
    const CHAIN_MAP = {
        sol: 'solana',
        eth: 'ethereum',
        bsc: 'bsc',
        base: 'base',
        blast: 'blast',
        polygon: 'polygon',
        matic: 'polygon',
        arbitrum: 'arbitrum',
        optimism: 'optimism',
        avalanche: 'avalanche',
        avax: 'avalanche',
    };
    const apiChain = CHAIN_MAP[chain?.toLowerCase()] || chain?.toLowerCase();
    const isSupported = chain && supportedChains.includes(chain?.toLowerCase());
    const isSolana = apiChain === 'solana';

    useEffect(() => {
        if (!address || !isSupported) return;
        setLoading(true);
        setError(false);
        setTrades([]);
        setSummary(null);
        let intervalId: NodeJS.Timeout;

        const fetchSolanaTrades = async () => {
            try {
                // Step 1: Get pair address from DexScreener
                const dsRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
                const dsData = await dsRes.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let pair: any = null;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pairs: any[] = dsData.pairs || [];
                if (pairs.length > 0) {
                    pair = pairs.find((p) => p.chainId?.toLowerCase() === apiChain);
                    if (!pair) pair = pairs[0];
                }
                const pairAddress = pair?.pairAddress;
                if (!pairAddress) {
                    setError(true);
                    setTrades([]);
                    setLoading(false);
                    return;
                }
                // For testing: use a known active pair address (e.g. Raydium USDC/SOL)
                // pairAddress = '8HoQnePLqPj4M7PUDzfw8e3Yw1E5NH5x5uFWDzj1hJys';
                const beRes = await fetch(`https://public-api.birdeye.so/public/txs/pair/${pairAddress}?limit=20`, {
                    headers: { 'X-API-KEY': '06d5d7fbfc2140d481cae657538988ee' }
                });
                if (beRes.status === 404) {
                    setTrades([]); // No activity, but not an error
                    setLoading(false);
                    return;
                }
                const beData = await beRes.json();
                setTrades(beData.data || []);
            } catch (err) {
                console.error('Birdeye fetch error:', err);
                setError(true);
                setTrades([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchDexScreenerSummary = async () => {
            try {
                const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
                const data = await res.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let pair: any = null;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pairs: any[] = data.pairs || [];
                if (pairs.length > 0) {
                    pair = pairs.find((p) => p.chainId?.toLowerCase() === apiChain);
                    if (!pair) pair = pairs[0];
                }
                setSummary(pair?.txns || null);
            } catch {
                setError(true);
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };

        if (isSolana) {
            fetchSolanaTrades();
            intervalId = setInterval(fetchSolanaTrades, 5000);
        } else {
            fetchDexScreenerSummary();
            intervalId = setInterval(fetchDexScreenerSummary, 5000);
        }
        return () => clearInterval(intervalId);
    }, [address, chain, isSupported, apiChain, isSolana]);

    return (
        <div className="overflow-x-scroll">
            <div className="relatie min-w-[850px] h-full dark:bg-[#111111]">
                <div className="flex flex-row border-b border-accent-3 text-accent-aux-1">
                    {/* th 1 */}
                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[14.11%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="text-[12px]">Time</div>
                        <div className="scale-80">
                            <div className="flex cursor-pointer rotate-180 text-accent-aux-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                            </div>
                            <div className="flex cursor-pointer dark:text-[#f5f5f5]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 7 7"><path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path></svg>
                            </div>
                        </div>
                        <div className="flex items-center cursor-pointer rounded-[4px] mr-[4px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="#5C6068" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M8 13.8A5.8 5.8 0 108 2.2a5.8 5.8 0 000 11.6zM8 15A7 7 0 108 1a7 7 0 000 14z"></path><path fillRule="evenodd" clipRule="evenodd" d="M8 3.4a.6.6 0 01.6.6v4.752l1.824 1.824a.6.6 0 11-.848.848l-1.971-1.97a.7.7 0 01-.205-.495V4a.6.6 0 01.6-.6z"></path></svg>
                        </div>
                        <div className="">
                            <div className="flex cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#5C6068" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M2.702 3.225l.006.006 3.635 3.547c.355.346.554.82.554 1.315v3.898a.6.6 0 11-1.2 0V8.093a.636.636 0 00-.192-.456L1.87 4.09C1.088 3.327 1.628 2 2.72 2h10.562c1.093 0 1.633 1.328.85 2.09l-3.64 3.547a.636.636 0 00-.191.456v5.634a.6.6 0 01-1.2 0V8.093c0-.495.2-.97.554-1.315l3.64-3.547.005-.006.001-.002-.002-.012a.03.03 0 00-.007-.01h-.002l-.008-.001H2.71a.03.03 0 00-.006.011.03.03 0 00-.003.012l.001.002z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* th 2 */}
                    <div className="flex gap-[4px] py-[10px] px-[10.58px] items-center w-[14%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="text-[12px]">Type</div>
                        <div className="">
                            <div className="flex cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="#5C6068" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M2.702 3.225l.006.006 3.635 3.547c.355.346.554.82.554 1.315v3.898a.6.6 0 11-1.2 0V8.093a.636.636 0 00-.192-.456L1.87 4.09C1.088 3.327 1.628 2 2.72 2h10.562c1.093 0 1.633 1.328.85 2.09l-3.64 3.547a.636.636 0 00-.191.456v5.634a.6.6 0 01-1.2 0V8.093c0-.495.2-.97.554-1.315l3.64-3.547.005-.006.001-.002-.002-.012a.03.03 0 00-.007-.01h-.002l-.008-.001H2.71a.03.03 0 00-.006.011.03.03 0 00-.003.012l.001.002z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* th 3 */}
                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[14.11%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="text-[12px]">Total</div>
                        <div className="space-x-1 flex items-center text-[12px]">
                            <span>USD</span>
                        </div>
                    </div>

                    {/* th 4 */}
                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[10.58%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="text-[12px]">Amount</div>
                    </div>

                    {/* th 5 */}
                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[11.76%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="text-[12px]">Price</div>
                    </div>

                    {/* th 6 */}
                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[23.52%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="text-[12px]">Marker</div>
                    </div>

                    {/* th 7 */}
                    <div className="flex gap-[4px] py-[10px] px-[12px] justify-end items-center w-[15.29%] whitespace-nowrap dark:text-[f5f5f5]">
                        <div className="flex rounded-[4px] bg-riskWarn text-risk items-center text-[13px] font-[500] p-[4px] gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" fill="currentColor" viewBox="0 0 14 14"><rect x="1.012" y="1.012" width="3.992" height="11.975"></rect><rect x="8.996" y="1.012" width="3.992" height="11.975"></rect></svg>
                            <span>Paused</span>
                        </div>
                    </div>
                </div>
                <div className="overflow-y-scroll w-full max-h-[600px] min-w-[200px]">
                    {loading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-row border-b border-accent-3 text-accent-aux-1 animate-pulse">
                                <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[14.11%] bg-gray-800 rounded" style={{ height: 24 }} />
                                <div className="flex gap-[4px] py-[10px] px-[10.58px] items-center w-[14%] bg-gray-800 rounded" style={{ height: 24 }} />
                                <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[14.11%] bg-gray-800 rounded" style={{ height: 24 }} />
                                <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[10.58%] bg-gray-800 rounded" style={{ height: 24 }} />
                                <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[11.76%] bg-gray-800 rounded" style={{ height: 24 }} />
                                <div className="flex flex-col gap-[4px] py-[10px] px-[12px] items-start w-[23.52%] bg-gray-800 rounded" style={{ height: 24 }} />
                                <div className="flex justify-end gap-[4px] py-[10px] px-[12px] items-center w-[15.29%] bg-gray-800 rounded" style={{ height: 24 }} />
                            </div>
                        ))
                    ) : error ? (
                        <div className="text-center text-red-500 py-8">Failed to load activity</div>
                    ) : isSolana ? (
                        trades.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">No recent activity</div>
                        ) : (
                            trades.map((trade, i) => (
                                <div key={i} className="flex flex-row border-b border-accent-3 text-accent-aux-1">
                                    {/* td 1: Time */}
                                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[14.11%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className="dark:text-[#9AA0AA] text-[12px]">{trade.blockTime ? new Date(trade.blockTime * 1000).toLocaleString() : '--'}</div>
                                    </div>
                                    {/* td 2: Type */}
                                    <div className="flex gap-[4px] py-[10px] px-[10.58px] items-center w-[14%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className={`text-[12px] px-[12px] py-[4px] rounded-md font-[500] ${trade.side === 'buy' ? 'bg-[rgba(136,214,147,0.2)] text-prettyGreen' : 'bg-[rgba(255,0,0,0.2)] text-red-400'}`}>{trade.side || '--'}</div>
                                    </div>
                                    {/* td 3: Total (USD) */}
                                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[14.11%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className="text-[12px] text-accent-green font-[500]">${trade.amountUsd ? Number(trade.amountUsd).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}</div>
                                    </div>
                                    {/* td 4: Amount */}
                                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[10.58%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className="text-[12px] text-accent-green font-[500]">{trade.amount ? Number(trade.amount).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '--'}</div>
                                    </div>
                                    {/* td 5: Price */}
                                    <div className="flex gap-[4px] py-[10px] px-[12px] items-center w-[11.76%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className="text-[12px] text-accent-green font-[500]">{trade.price ? `$${Number(trade.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '--'}</div>
                                    </div>
                                    {/* td 6: Marker (address) */}
                                    <div className="flex flex-col gap-[4px] py-[10px] px-[12px] items-start  w-[23.52%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className="flex w-[100px] gap-1 items-center">
                                            <div className="text-[12px] text-accent-green font-[500]">{trade.owner ? truncAddress(trade.owner) : '--'}</div>
                                        </div>
                                    </div>
                                    {/* td 7: Share/Actions */}
                                    <div className="flex justify-end gap-[4px] py-[10px] px-[12px] items-center w-[15.29%] whitespace-nowrap dark:text-[f5f5f5]">
                                        <div className="flex items-center">
                                            <a href={`https://solscan.io/tx/${trade.txHash}`} target="_blank" rel="noopener noreferrer" className="flex text-[12px] ml-[0.1rem] underline">View</a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : summary ? (
                        <div className="text-center text-gray-400 py-8">
                            <div>Buys (5m): {summary.m5?.buys ?? '--'} | Sells (5m): {summary.m5?.sells ?? '--'}</div>
                            <div>Buys (1h): {summary.h1?.buys ?? '--'} | Sells (1h): {summary.h1?.sells ?? '--'}</div>
                            <div>Buys (6h): {summary.h6?.buys ?? '--'} | Sells (6h): {summary.h6?.sells ?? '--'}</div>
                            <div>Buys (24h): {summary.h24?.buys ?? '--'} | Sells (24h): {summary.h24?.sells ?? '--'}</div>
                            <div className="mt-2">(Live trade feed not available for this chain)</div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    );
}