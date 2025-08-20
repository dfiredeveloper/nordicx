import { useState, useCallback, useEffect } from 'react';

// Hook for real-time price feeds
export const usePriceFeed = () => {
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get single token price
  const getTokenPrice = useCallback(async (
    tokenAddress: string,
    chainId: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/price?token=${tokenAddress}&chainId=${chainId}`);
      const data = await response.json();
      
      if (data.success) {
        setPrices(prev => ({
          ...prev,
          [tokenAddress]: data.data
        }));
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to get price');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get multiple token prices
  const getMultipleTokenPrices = useCallback(async (
    tokenAddresses: string[],
    chainId: number
  ) => {
    if (tokenAddresses.length === 0) return {};

    setIsLoading(true);
    setError(null);

    try {
      const tokenParam = tokenAddresses.join(',');
      const response = await fetch(`/api/price?token=${tokenParam}&chainId=${chainId}&multiple=true`);
      const data = await response.json();
      
      if (data.success) {
        setPrices(prev => ({
          ...prev,
          ...data.data
        }));
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to get prices');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get price history for charts
  const getPriceHistory = useCallback(async (
    tokenAddress: string,
    chainId: number,
    days: number = 7
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress,
          chainId,
          days
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to get price history');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh prices
  const startPriceRefresh = useCallback((
    tokenAddresses: string[],
    chainId: number,
    intervalMs: number = 30000 // 30 seconds
  ) => {
    const interval = setInterval(() => {
      getMultipleTokenPrices(tokenAddresses, chainId);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [getMultipleTokenPrices]);

  // Get cached price
  const getCachedPrice = useCallback((tokenAddress: string) => {
    return prices[tokenAddress] || null;
  }, [prices]);

  // Clear prices
  const clearPrices = useCallback(() => {
    setPrices({});
    setError(null);
  }, []);

  return {
    // State
    prices,
    isLoading,
    error,
    
    // Actions
    getTokenPrice,
    getMultipleTokenPrices,
    getPriceHistory,
    startPriceRefresh,
    getCachedPrice,
    clearPrices,
    
    // Computed
    hasPrices: Object.keys(prices).length > 0,
    priceCount: Object.keys(prices).length
  };
};
