import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

// Hook for real trading functionality
export const useRealSwap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const { address: userAddress, isConnected } = useAccount();

  // Get real-time swap quote
  const getQuote = useCallback(async (
    fromToken: string,
    toToken: string,
    amount: string,
    chainId: number,
    slippage: number = 1
  ) => {
    if (!isConnected || !userAddress) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenIn: fromToken,
          tokenOut: toToken,
          amountIn: amount,
          slippage,
          chainId,
          userAddress,
          execute: false
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuote(data.data);
        return data.data;
      } else {
        setError(data.error || 'Failed to get quote');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress]);

  // Execute swap transaction
  const executeSwap = useCallback(async (
    quote: any,
    chainId: number,
    slippage: number = 1
  ) => {
    if (!isConnected || !userAddress) {
      setError('Wallet not connected');
      return null;
    }

    if (!quote) {
      setError('No quote available');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote,
          userAddress,
          chainId,
          slippage,
          execute: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTransaction(data.data);
        return data.data;
      } else {
        setError(data.error || 'Failed to execute swap');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress]);

  // Prepare transaction without executing
  const prepareTransaction = useCallback(async (
    quote: any,
    chainId: number,
    slippage: number = 1
  ) => {
    if (!isConnected || !userAddress) {
      setError('Wallet not connected');
      return null;
    }

    if (!quote) {
      setError('No quote available');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote,
          userAddress,
          chainId,
          slippage,
          execute: false
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTransaction(data.data);
        return data.data;
      } else {
        setError(data.error || 'Failed to prepare transaction');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress]);

  // Get transaction status
  const getTransactionStatus = useCallback(async (
    txHash: string,
    chainId: number
  ) => {
    try {
      const response = await fetch(`/api/execute?txHash=${txHash}&chainId=${chainId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to get transaction status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Clear state
  const clearState = useCallback(() => {
    setQuote(null);
    setTransaction(null);
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    quote,
    transaction,
    
    // Actions
    getQuote,
    executeSwap,
    prepareTransaction,
    getTransactionStatus,
    clearState,
    
    // Computed
    hasQuote: !!quote,
    hasTransaction: !!transaction,
    canExecute: !!quote && isConnected && !!userAddress
  };
};
