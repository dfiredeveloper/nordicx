import { Address } from 'viem';

// Trading-related types
export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface TradeQuote {
  calldata: string;
  value: string;
  to: Address;
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  platformFee: string;
  platformFeePercent: number;
  netInputAmount: string;
  estimatedGas: string;
  priceImpact: number;
  route: RouteInfo[];
  slippage: number;
  minimumOutput: string;
}

export interface RouteInfo {
  protocol: string;
  percentage: number;
  pool?: {
    address: Address;
    fee: number;
  };
}

export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: string;
  slippage: number;
  recipient: Address;
  deadline?: number;
}

export interface SwapResult {
  hash: Address;
  success: boolean;
  error?: string;
  gasUsed?: string;
  effectiveGasPrice?: string;
}

export interface TradingState {
  isLoading: boolean;
  quote: TradeQuote | null;
  error: string | null;
  lastUpdate: number;
}

export interface PlatformFeeInfo {
  feePercent: number;
  feeAmount: string;
  feeToken: Token;
  treasuryWallet: Address;
}

// Hook return types
export interface UseSwapQuoteReturn {
  quote: TradeQuote | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseSwapReturn {
  swap: (params: SwapParams) => Promise<SwapResult>;
  isLoading: boolean;
  error: string | null;
}
