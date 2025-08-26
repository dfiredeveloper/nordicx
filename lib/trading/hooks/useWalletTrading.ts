import { useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import RealTradingService from '../realTradingService';

export function useWalletTrading() {
  // EVM wallet hooks
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  // Solana wallet hooks
  const { publicKey: solanaPublicKey, signTransaction: signSolanaTransaction } = useWallet();
  const { connection: solanaConnection } = useConnection();

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

      // Handle EVM chains
      if (isEvmConnected && walletClient) {
        const txHash = await walletClient.sendTransaction({
          to: quote.to as `0x${string}`,
          data: quote.data as `0x${string}`,
          value: BigInt(quote.value || '0'),
        });
        return { hash: txHash };
      }
      // Handle Solana
      else if (solanaPublicKey && signSolanaTransaction && solanaConnection) {
        // Convert the quote data to a Solana transaction
        const transaction = Transaction.from(Buffer.from(quote.data, 'base64'));
        
        // Sign and send the transaction
        const signedTx = await signSolanaTransaction(transaction);
        const signature = await solanaConnection.sendRawTransaction(signedTx.serialize());
        
        // Confirm the transaction
        await solanaConnection.confirmTransaction(signature, 'confirmed');
        
        return { hash: signature };
      } else {
        throw new Error('No connected wallet found');
      }
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }, [isEvmConnected, walletClient, solanaPublicKey, signSolanaTransaction, solanaConnection]);

  return {
    executeSwap,
    isConnected: isEvmConnected || !!solanaPublicKey,
    address: isEvmConnected ? evmAddress : solanaPublicKey?.toBase58(),
  };
}
