import { Address } from 'viem';

// Trading-related types
export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

// Legacy TradeQuote interface (for backward compatibility)
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

// New Real Trading Quote interface
export interface RealTradeQuote {
  fromToken: string;
  toToken: string;
  amountIn: string;
  amountOut: string;
  estimatedOutput?: string;
  gasEstimate: string;
  priceImpact?: number;
  provider: string;
  to?: string;
  data?: string;
  value?: string;
  isRealQuote?: boolean;
  isSimulation?: boolean;
  chainId?: number;
  chainName?: string;
  slippage?: number;
  timestamp?: string;
}

// Extended TradeQuote that supports both old and new data
export interface ExtendedTradeQuote extends TradeQuote {
  // New real trading properties
  fromToken?: string;
  toToken?: string;
  amountIn?: string;
  amountOut?: string;
  estimatedOutput?: string;
  gasEstimate?: string;
  provider?: string;
  isRealQuote?: boolean;
  isSimulation?: boolean;
  chainId?: number;
  chainName?: string;
  timestamp?: string;
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
  chainId?: number;
}

export interface SwapResult {
  hash: Address;
  success: boolean;
  error?: string;
  gasUsed?: string;
  effectiveGasPrice?: string;
  transactionData?: TransactionData;
  quote?: RealTradeQuote;
}

export interface TradingState {
  isLoading: boolean;
  quote: ExtendedTradeQuote | null;
  error: string | null;
  lastUpdate: number;
}

export interface PlatformFeeInfo {
  feePercent: number;
  feeAmount: string;
  feeToken: Token;
  treasuryWallet: Address;
}

// Real trading specific types
export interface PriceData {
  tokenAddress: string;
  chainId: number;
  price: number;
  source: string;
  timestamp: string;
}

export interface TransactionData {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  chainId: number;
  nonce: number;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

// Hook return types
export interface UseSwapQuoteReturn {
  quote: ExtendedTradeQuote | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  getPriceUpdate: () => Promise<number | null>;
  isConnected: boolean;
  userAddress: Address | undefined;
}

export interface UseSwapReturn {
  swap: (params: SwapParams) => Promise<SwapResult>;
  isLoading: boolean;
  error: string | null;
}
