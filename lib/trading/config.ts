// Trading configuration and API keys
export const TRADING_CONFIG = {
  // API Keys (you'll need to get these)
  API_KEYS: {
    // Get from: https://portal.1inch.dev/
    ONEINCH_API_KEY: process.env.NEXT_PUBLIC_1INCH_API_KEY || 'YOUR_1INCH_API_KEY',
    
    // Get from: https://www.coingecko.com/en/api
    COINGECKO_API_KEY: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || 'YOUR_COINGECKO_API_KEY',
    
    // Get from: https://dexscreener.com/api
    DEXSCREENER_API_KEY: process.env.NEXT_PUBLIC_DEXSCREENER_API_KEY || 'YOUR_DEXSCREENER_API_KEY',
  },

  // Trading settings
  TRADING: {
    DEFAULT_SLIPPAGE: 0.5, // 0.5%
    MAX_SLIPPAGE: 5.0,     // 5%
    MIN_AMOUNT: 0.001,     // Minimum trade amount
    MAX_AMOUNT: 1000,      // Maximum trade amount
    GAS_LIMIT_BUFFER: 1.2, // 20% buffer for gas estimation
  },

  // Price feed settings
  PRICE_FEED: {
    CACHE_DURATION: 30000, // 30 seconds
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Transaction settings
  TRANSACTION: {
    MAX_PRIORITY_FEE: '2000000000', // 2 gwei
    DEFAULT_GAS_LIMIT: '150000',
    CONFIRMATION_BLOCKS: 12,
    TIMEOUT_SECONDS: 300, // 5 minutes
  },

  // Supported DEXes
  SUPPORTED_DEXES: {
    1: ['Uniswap V3', '1inch', 'Paraswap'], // Ethereum
    56: ['PancakeSwap', '1inch', 'Paraswap'], // BSC
    8453: ['BaseSwap', '1inch', 'Paraswap'], // Base
    81457: ['BlastSwap', '1inch', 'Paraswap'], // Blast
  },

  // Contract addresses for each chain
  CONTRACTS: {
    1: { // Ethereum
      UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      UNISWAP_V3_FACTORY: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    56: { // BSC
      PANCAKESWAP_ROUTER: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      PANCAKESWAP_FACTORY: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
      WBNB: '0xbb4CdB9CBd36B01bD1cBaEF2aF8C6b1e6Bf4',
    },
    8453: { // Base
      BASESWAP_ROUTER: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
      BASESWAP_FACTORY: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
      WETH: '0x4200000000000000000000000000000000000006',
    },
    81457: { // Blast
      BLASTSWAP_ROUTER: '0x...', // Add when available
      BLASTSWAP_FACTORY: '0x...', // Add when available
      WETH: '0x4200000000000000000000000000000000000006',
    },
  },
};

// Helper function to get API key
export const getApiKey = (service: keyof typeof TRADING_CONFIG.API_KEYS): string => {
  const key = TRADING_CONFIG.API_KEYS[service];
  if (key === `YOUR_${service.toUpperCase()}_API_KEY`) {
    console.warn(`⚠️ ${service} API key not configured. Please set NEXT_PUBLIC_${service.toUpperCase()}_API_KEY in your environment variables.`);
  }
  return key;
};

// Helper function to check if trading is fully enabled
export const isTradingEnabled = (): boolean => {
  const has1inchKey = TRADING_CONFIG.API_KEYS.ONEINCH_API_KEY !== 'YOUR_1INCH_API_KEY';
  const hasCoingeckoKey = TRADING_CONFIG.API_KEYS.COINGECKO_API_KEY !== 'YOUR_COINGECKO_API_KEY';
  
  return has1inchKey && hasCoingeckoKey;
};

// Helper function to get supported DEXes for a chain
export const getSupportedDexes = (chainId: number): string[] => {
  return TRADING_CONFIG.SUPPORTED_DEXES[chainId as keyof typeof TRADING_CONFIG.SUPPORTED_DEXES] || [];
};

// Helper function to get contract address
export const getContractAddress = (chainId: number, contract: string): string | null => {
  const chainContracts = TRADING_CONFIG.CONTRACTS[chainId as keyof typeof TRADING_CONFIG.CONTRACTS];
  return chainContracts?.[contract as keyof typeof chainContracts] || null;
};
