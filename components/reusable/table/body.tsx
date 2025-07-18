import { formatNumber, truncAddress } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

// Add props interface
interface TokenData {
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
}

interface TableBodyProps {
    tokenData: TokenData[];
    loading: boolean;
    error: string | null;
}

export default function TableBody({ tokenData, loading, error }: TableBodyProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const chain = searchParams?.get("chain") ?? "eth";

    if (loading) {
        return [<tr key="loading"><td colSpan={15} className="text-center py-8">Loading...</td></tr>];
    }
    if (error) {
        return [<tr key="error"><td colSpan={15} className="text-center py-8 text-red-500">{error}</td></tr>];
    }
    if (!tokenData || tokenData.length === 0) {
        return [<tr key="none"><td colSpan={15} className="text-center py-8">No tokens found.</td></tr>];
    }

    const calculateAge = (createdAt?: number) => {
        if (!createdAt) return '-';
        const now = Date.now();
        const diff = now - createdAt;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        return '<1h';
    };

    return (
        <tbody>
            {tokenData.map((token, index) => (
                <tr key={token.pairAddress || index}>
                    {/* Token Column */}
                    <td className="py-3 px-2 sticky z-[1] left-0 bg-accent-2 ">
                <Link role="button" className="flex items-center md:w-[290px] w-[136px] md:flex-[290px] flex-[136px]" href={{ pathname: `/${chain}/token/${token.baseToken.address}`, query: { data: encodeURIComponent(JSON.stringify(token)) } }}>
                            <div className="flex items-center gap-2">
                                <div className="">
                                    {/* Placeholder for token logo */}
                                    <Image src={"/static/3717.png"} className='md:w-[30px] w-[25px] md:h-[30px] h-[25px]' width={35} height={35} alt='' />
                                </div>
                                <div className="">
                                    <div className="flex items-center gap-1">
                                        <h1 className="uppercase md:text-[14px] text-[13px] font-[400]">{token.baseToken.symbol}</h1>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <p className='text-[#AEB2DB] text-[12px]'>{truncAddress(token.baseToken.address)}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </td>

                    {/* Age Column */}
                    <td className="py-3 px-2 md:block hidden">
                        {calculateAge(token.pairCreatedAt)}
                    </td>

                    {/* Liq/MC Column */}
                    <td className="py-3 px-2">
                        {token.liquidity?.usd ? formatNumber(token.liquidity.usd) : '-'}
                    </td>

                    {/* MC Column (only for non-home pages) */}
                    {pathname !== "/" && (
                        <td className="py-3 px-2">
                            {token.liquidity?.usd ? formatNumber(token.liquidity.usd * 100) : '-'}
                        </td>
                    )}

                    {/* BlueChip Column (only for home page) */}
                    {pathname === "/" && (
                        <td className="py-3 px-2">
                            -
                        </td>
                    )}

                    {/* Holders Column */}
                    <td className="py-3 px-2">
                        -
                    </td>

                    {/* Smart/KOL Column (only for non-eth chains on home page) */}
                    {pathname === "/" && chain !== "eth" && (
                        <td className="py-3 px-2">
                            -
                        </td>
                    )}

                    {/* Smart Txn Column (only for eth on home page) */}
                    {pathname === "/" && chain === "eth" && (
                        <td className="py-3 px-2">
                            -
                        </td>
                    )}

                    {/* 1m TXs Column */}
                    <td className="py-3 px-2">
                        {token.txns?.h1 ? (token.txns.h1.buys + token.txns.h1.sells) : '-'}
                    </td>

                    {/* 1m Vol Column */}
                    <td className="py-3 px-2">
                        {token.volume?.h1 ? formatNumber(token.volume.h1) : '-'}
                    </td>

                    {/* Price Column */}
                    <td className="py-3 px-2">
                        {token.priceUsd ? `$${parseFloat(token.priceUsd).toFixed(6)}` : '-'}
                    </td>

                    {/* 1m% Column */}
                    <td className="py-3 px-2">
                        {token.priceChange?.m5 ? `${token.priceChange.m5.toFixed(2)}%` : '-'}
                    </td>

                    {/* 5m% Column */}
                    <td className="py-3 px-2">
                        {token.priceChange?.h1 ? `${token.priceChange.h1.toFixed(2)}%` : '-'}
                    </td>

                    {/* 1h% Column */}
                    <td className="py-3 px-2">
                        {token.priceChange?.h24 ? `${token.priceChange.h24.toFixed(2)}%` : '-'}
                    </td>

                    {/* Degen Audit Column */}
                    <td className="py-2 px-2">
                        <button className="text-blue-500 hover:text-blue-700">
                            Audit
                        </button>
                    </td>

                    {/* Token B/S Column (only for home page) */}
                    {pathname === "/" && (
                        <td className="py-2 px-2">
                            -
                        </td>
                    )}

                    {/* Dev Column */}
                    <td className="py-2 px-2">
                        <button className="text-green-500 hover:text-green-700">
                            Dev
                        </button>
                    </td>

                    {/* Empty column for spacing */}
                    <td className="py-2 px-2 sticky right-0 bg-accent-2 w-full">
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
