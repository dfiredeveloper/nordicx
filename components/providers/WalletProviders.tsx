'use client';
import { ReactNode } from 'react';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, polygon, optimism, arbitrum, base, bsc } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { SolanaWalletProvider } from './SolanaWalletProvider';

const wagmiConfig = getDefaultConfig({
  appName: 'Nordic.AI',
  projectId: 'WALLETCONNECT_PROJECT_ID', // TODO: Replace with your WalletConnect project ID
  chains: [mainnet, polygon, optimism, arbitrum, base, bsc],
  ssr: true,
});

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider theme={darkTheme()}>
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
} 