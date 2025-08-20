import { parseUnits, formatUnits, Address } from 'viem';
import { Token, TradeQuote, PlatformFeeInfo } from './types';
import { TRADING_CONFIG } from './constants';

/**
 * Calculate platform fee for a trade
 */
export function calculatePlatformFee(
  inputAmount: string,
  inputToken: Token
): PlatformFeeInfo {
  const amountBigInt = parseUnits(inputAmount, inputToken.decimals);
  const feeAmount = (amountBigInt * BigInt(Math.floor(TRADING_CONFIG.PLATFORM_FEE_PERCENT * 100))) / BigInt(10000);
  
  return {
    feePercent: TRADING_CONFIG.PLATFORM_FEE_PERCENT,
    feeAmount: formatUnits(feeAmount, inputToken.decimals),
    feeToken: inputToken,
    treasuryWallet: TRADING_CONFIG.TREASURY_WALLET as Address,
  };
}

/**
 * Calculate net amount after platform fee
 */
export function calculateNetAmount(
  inputAmount: string,
  inputToken: Token
): string {
  const amountBigInt = parseUnits(inputAmount, inputToken.decimals);
  const feeAmount = (amountBigInt * BigInt(Math.floor(TRADING_CONFIG.PLATFORM_FEE_PERCENT * 100))) / BigInt(10000);
  const netAmount = amountBigInt - feeAmount;
  
  return formatUnits(netAmount, inputToken.decimals);
}

/**
 * Calculate minimum output amount with slippage protection
 */
export function calculateMinimumOutput(
  outputAmount: string,
  outputToken: Token,
  slippage: number
): string {
  const amountBigInt = parseUnits(outputAmount, outputToken.decimals);
  const slippageBigInt = BigInt(Math.floor(slippage * 100));
  const minimumAmount = (amountBigInt * (BigInt(10000) - slippageBigInt)) / BigInt(10000);
  
  return formatUnits(minimumAmount, outputToken.decimals);
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(
  amount: string,
  decimals: number,
  displayDecimals: number = 6
): string {
  const num = parseFloat(amount);
  if (num === 0) return '0';
  
  if (num < 0.000001) {
    return num.toExponential(2);
  }
  
  return num.toFixed(displayDecimals).replace(/\.?0+$/, '');
}

/**
 * Validate swap parameters
 */
export function validateSwapParams(
  tokenIn: Address,
  tokenOut: Address,
  amountIn: string,
  slippage: number
): { isValid: boolean; error?: string } {
  if (!tokenIn || !tokenOut) {
    return { isValid: false, error: 'Token addresses are required' };
  }
  
  if (tokenIn.toLowerCase() === tokenOut.toLowerCase()) {
    return { isValid: false, error: 'Cannot swap token to itself' };
  }
  
  if (!amountIn || parseFloat(amountIn) <= 0) {
    return { isValid: false, error: 'Invalid input amount' };
  }
  
  if (slippage < 0 || slippage > TRADING_CONFIG.MAX_SLIPPAGE) {
    return { isValid: false, error: `Slippage must be between 0 and ${TRADING_CONFIG.MAX_SLIPPAGE}%` };
  }
  
  return { isValid: true };
}

/**
 * Get deadline timestamp (20 minutes from now)
 */
export function getDeadline(): number {
  return Math.floor(Date.now() / 1000) + 1200; // 20 minutes
}

/**
 * Parse error message from transaction failure
 */
export function parseSwapError(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.message) {
    // Common error patterns
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for this transaction';
    }
    if (error.message.includes('slippage')) {
      return 'Transaction failed due to slippage. Try increasing slippage tolerance.';
    }
    if (error.message.includes('deadline')) {
      return 'Transaction deadline exceeded. Please try again.';
    }
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    }
    
    return error.message;
  }
  
  return 'An unknown error occurred during the swap';
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert chain name to chain ID
 */
export function getChainId(chainName: string): number {
  const chainMap: Record<string, number> = {
    'ethereum': 1,
    'eth': 1,
    'polygon': 137,
    'matic': 137,
    'arbitrum': 42161,
    'arb': 42161,
    'base': 8453,
  };
  
  return chainMap[chainName.toLowerCase()] || 1;
}
