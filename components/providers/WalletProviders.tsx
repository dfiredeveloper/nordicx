'use client';
import { ReactNode } from 'react';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, bsc, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { SolanaWalletProvider } from './SolanaWalletProvider';

const wagmiConfig = getDefaultConfig({
  appName: 'Nordic.AI',
  projectId: '17530c504453fa187cf8d73c4667c564',
  chains: [mainnet, bsc, base], // Only chains with Alchemy apps
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