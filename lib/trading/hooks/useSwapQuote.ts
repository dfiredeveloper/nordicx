import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { TradeQuote } from '../types';
import { TRADING_CONFIG } from '../constants';

interface UseSwapQuoteParams {
  tokenIn: Address | null;
  tokenOut: Address | null;
  amountIn: string;
  slippage?: number;
  enabled?: boolean;
}

export function useSwapQuote({
  tokenIn,
  tokenOut,
  amountIn,
  slippage = TRADING_CONFIG.DEFAULT_SLIPPAGE,
  enabled = true,
}: UseSwapQuoteParams) {
  const [quote, setQuote] = useState<TradeQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0 || !enabled) {
      setQuote(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenIn,
          tokenOut,
          amountIn,
          slippage,
          chainId: 1, // Make this dynamic based on current chain
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get swap quote');
      }

      setQuote(data.quote);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quote');
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, [tokenIn, tokenOut, amountIn, slippage, enabled]);

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

  return {
    quote,
    isLoading,
    error,
    refetch,
  };
}
