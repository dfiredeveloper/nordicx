import { useCallback, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import RealTradingService from '../realTradingService';

export function useTrading() {
  // EVM wallet hooks
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  // Solana wallet hooks
  const { publicKey: solanaPublicKey, signTransaction: signSolanaTransaction } = useWallet();
  const { connection: solanaConnection } = useConnection();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute a token swap using the connected wallet
   */
  const executeSwap = useCallback(async ({
    fromToken,
    toToken,
    amount,
    chainId,
    slippage = 1,
  }: {
    fromToken: string;
    toToken: string;
    amount: string;
    chainId: number;
    slippage?: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the best quote
      const quote = await RealTradingService.getBestQuote(
        fromToken,
        toToken,
        amount,
        chainId,
        slippage
      );

      if (!quote.success) {
        throw new Error(quote.error || 'Failed to get swap quote');
      }

      // Execute the swap
      const result = await RealTradingService.executeSwap(
        quote,
        walletClient || undefined,
        signSolanaTransaction,
        isEvmConnected ? evmAddress : undefined,
        chainId,
        slippage
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to execute swap');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Trading error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, isEvmConnected, evmAddress, signSolanaTransaction]);

  return {
    executeSwap,
    isLoading,
    error,
    isConnected: isEvmConnected || !!solanaPublicKey,
    address: isEvmConnected ? evmAddress : solanaPublicKey?.toBase58(),
  };
}
