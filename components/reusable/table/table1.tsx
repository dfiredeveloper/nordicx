import TableBody from "./body";
import TableHead from "./head";
import Colgroup from "./colgroup";

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

interface TableProps {
    tokenData: TokenData[];
    loading: boolean;
    error: string | null;
}

export default function Table({ tokenData, loading, error }: TableProps) {
    return (
        <div className='w-full md:px-[1.3rem] h-[781px] gap-5 overflow-y-auto relative'>
            <div className="relative overflow-auto h-full">
                <table className="bg-accent-2">
                    <Colgroup />
                    <TableHead />
                    <tbody>
                    <TableBody tokenData={tokenData} loading={loading} error={error} />
                    </tbody>
                </table>
            </div>
        </div >
    )
}
