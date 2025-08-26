import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { ExtendedTradeQuote } from '../types';
import { TRADING_CONFIG } from '../constants';
import { useAccount } from 'wagmi';

interface UseSwapQuoteParams {
  tokenIn: Address | null;
  tokenOut: Address | null;
  amountIn: string;
  slippage?: number;
  enabled?: boolean;
  chainId?: number;
}

export function useSwapQuote({
  tokenIn,
  tokenOut,
  amountIn,
  slippage = TRADING_CONFIG.DEFAULT_SLIPPAGE,
  enabled = true,
  chainId = 1,
}: UseSwapQuoteParams) {
  const [quote, setQuote] = useState<ExtendedTradeQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address: userAddress, isConnected } = useAccount();

  const fetchQuote = useCallback(async () => {
    if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0 || !enabled) {
      setQuote(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the new real trading API
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenIn,
          tokenOut,
          amountIn,
          slippage,
          chainId,
          userAddress: userAddress || undefined,
          execute: false, // Just get quote, don't execute
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get swap quote');
      }

      // Transform the new API response to match existing ExtendedTradeQuote interface
      const transformedQuote: ExtendedTradeQuote = {
        // Legacy properties (required)
        calldata: data.data.data || '0x...',
        value: data.data.value || '0',
        to: (data.data.to || '0x...') as Address,
        inputToken: { address: tokenIn as Address, symbol: '', name: '', decimals: 18 },
        outputToken: { address: tokenOut as Address, symbol: '', name: '', decimals: 18 },
        inputAmount: data.data.amount,
        outputAmount: data.data.estimatedOutput || data.data.amountOut || '0',
        platformFee: '0',
        platformFeePercent: 0,
        netInputAmount: data.data.amount,
        estimatedGas: data.data.gasEstimate || '150000',
        priceImpact: data.data.priceImpact || 0,
        route: [],
        slippage: data.data.slippage || slippage,
        minimumOutput: data.data.estimatedOutput || data.data.amountOut || '0',
        
        // New real trading properties
        fromToken: data.data.fromToken,
        toToken: data.data.toToken,
        amountIn: data.data.amount,
        amountOut: data.data.estimatedOutput || data.data.amountOut || '0',
        estimatedOutput: data.data.estimatedOutput || data.data.amountOut || '0',
        gasEstimate: data.data.gasEstimate || '150000',
        provider: data.data.provider || 'Unknown',
        isRealQuote: data.data.isRealQuote || false,
        isSimulation: data.data.isSimulation || false,
        chainId: data.data.chainId,
        chainName: data.data.chainName,
        timestamp: data.data.timestamp,
      };

      setQuote(transformedQuote);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quote';
      setError(errorMessage);
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, [tokenIn, tokenOut, amountIn, slippage, enabled, chainId, userAddress]);

  // Auto-fetch quote when parameters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuote();
    }, 500); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [fetchQuote]);

  // Refetch quote manually
  const refetch = useCallback(() => {
    fetchQuote();
  }, [fetchQuote]);

  // Get real-time price updates
  const getPriceUpdate = useCallback(async () => {
    if (!tokenIn || !tokenOut) return null;
    
    try {
      const response = await fetch(`/api/price?token=${tokenIn}&chainId=${chainId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.price;
      }
    } catch (err) {
      console.error('Failed to get price update:', err);
    }
    return null;
  }, [tokenIn, tokenOut, chainId]);

  return {
    quote,
    isLoading,
    error,
    refetch,
    getPriceUpdate,
    isConnected,
    userAddress,
  };
}
