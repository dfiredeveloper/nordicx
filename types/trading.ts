export interface TokenData {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    tags?: string[];
    chainId?: number;
    market_cap?: number;
    volume_24h?: number;
    percent_change_24h?: number;
    holders_count?: number;
    price?: number;
    liquidity?: number;
    price_change_24h?: number;
    total_supply?: string;
    circulating_supply?: string;
    max_supply?: string;
}

export interface TradingPair {
    baseToken: TokenData;
    quoteToken: TokenData;
    price: number;
    priceChange24h: number;
    volume24h: number;
    liquidity: number;
}

export interface TradingFormData {
    amount: string;
    price?: string;
    total?: string;
    slippage?: number;
    expiration?: string;
}

export interface TradingTabProps {
    tokenAddress: string;
    chainId: number;
}

export interface MetricProps {
    title: string;
    value?: string | number;
    change?: number;
    isCurrency?: boolean;
    className?: string;
}

export interface PoolInfoProps {
    chain: string;
    address: string;
    tokenData?: TokenData | null;
}

export interface DegenAuditProps {
    chain: string;
    address: string;
    tokenData?: TokenData | null;
}
