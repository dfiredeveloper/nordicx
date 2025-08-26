/**
 * Trading Configuration
 * 
 * This file contains configuration for the trading functionality.
 * Update the values below to enable/disable features as needed.
 */

// Check if all required API keys are configured
const hasRequiredApiKeys = (): boolean => {
  try {
    const requiredKeys = [
      process.env.NEXT_PUBLIC_1INCH_API_KEY,
      process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
      process.env.NEXT_PUBLIC_DEXSCREENER_API_KEY
    ];
    return requiredKeys.every(key => key && key !== 'YOUR_API_KEY_HERE');
  } catch (e) {
    return false;
  }
};

// Trading configuration
export const tradingConfig = {
  // Enable/disable trading functionality
  isTradingEnabled: hasRequiredApiKeys(),
  
  // API endpoints (can be overridden if needed)
  endpoints: {
    oneInch: 'https://api.1inch.io/v5.0',
    coinGecko: 'https://api.coingecko.com/api/v3',
    dexScreener: 'https://api.dexscreener.com/latest/dex'
  },
  
  // Trading settings
  settings: {
    defaultSlippage: 0.5, // 0.5%
    maxSlippage: 5.0,     // 5%
    minAmount: 0.001,     // Minimum trade amount
    maxAmount: 1000,      // Maximum trade amount
    gasLimitBuffer: 1.2   // 20% buffer for gas estimation
  }
};

// Make the config available globally for debugging
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__TRADING_CONFIG__ = tradingConfig;
}

export default tradingConfig;
