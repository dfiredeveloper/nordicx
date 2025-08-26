import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, Address } from 'viem';
import { SwapParams, SwapResult, RealTradeQuote } from '../types';
import { parseSwapError } from '../utils';

export function useSwap() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swap = useCallback(async (params: SwapParams): Promise<SwapResult> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get swap quote from our API
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
          amountIn: params.amountIn,
          slippage: params.slippage,
          chainId: 1, // You can make this dynamic based on current chain
          recipient: params.recipient || address,
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get swap quote');
      }

      const quote: RealTradeQuote = data.data;

      // Execute the swap using the new real trading API
      const executeResponse = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: data.data,
          userAddress: address,
          chainId: params.chainId || 1,
          slippage: params.slippage,
          execute: true,
        }),
      });

      const executeData = await executeResponse.json();
      
      if (!executeResponse.ok || !executeData.success) {
        throw new Error(executeData.error || 'Failed to execute swap');
      }

      // For now, return success without actual blockchain transaction
      // In the future, this would integrate with the user's wallet
      const hash = '0x...' as Address; // Placeholder for now

      setIsLoading(false);
      return {
        hash,
        success: true,
      };

    } catch (err: any) {
      const errorMessage = parseSwapError(err);
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        hash: '0x' as Address,
        success: false,
        error: errorMessage,
      };
    }
  }, [address, writeContractAsync]);

  return {
    swap,
    isLoading,
    error,
  };
}
