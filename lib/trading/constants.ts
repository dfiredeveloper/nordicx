// Trading constants and configuration
export const TRADING_CONFIG = {
  // Platform fee (0.50%)
  PLATFORM_FEE_PERCENT: 0.50,
  
  // Treasury wallet address (replace with your actual wallet)
  TREASURY_WALLET: '0x86d45b3087a6c777B8A0a1FF360ecf066B742a5d', // TODO: Replace with your wallet
  
  // Default slippage tolerance (0.5%)
  DEFAULT_SLIPPAGE: 0.5,
  
  // Max slippage tolerance (5%)
  MAX_SLIPPAGE: 5.0,
  
  // Gas limit multiplier for safety
  GAS_LIMIT_MULTIPLIER: 1.2,
} as const;

// Supported chains for trading (using public RPCs for now)
export const SUPPORTED_CHAINS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/vwhLjdpqLByxFgQfTG6qH',
  },
  bsc: {
    chainId: 56,
    name: 'Binance Smart Chain',
    nativeCurrency: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org', // Public RPC
  },
  base: {
    chainId: 8453,
    name: 'Base',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://mainnet.base.org', // Public RPC
  },
  blast: {
    chainId: 81457,
    name: 'Blast',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://rpc.blast.io', // Public RPC
  },
} as const;

// Common token addresses (updated for supported chains)
export const COMMON_TOKENS = {
  ethereum: {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86a33E6441e6e80A4f8b0b7F3b8b4b3b8b4b3',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  bsc: {
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEF2aF8C6b1e6Bf4',
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
  },
  base: {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  blast: {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x4200000000000000000000000000000000000006', // Update with actual Blast USDC address
  },
} as const;

export type SupportedChain = keyof typeof SUPPORTED_CHAINS;
export type ChainConfig = typeof SUPPORTED_CHAINS[SupportedChain];
