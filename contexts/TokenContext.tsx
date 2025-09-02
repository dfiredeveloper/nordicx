import React, { createContext, useContext, useEffect, useState } from 'react';
import { TokenData } from '@/types/token';
import { useTokenPrices } from '@/lib/trading/hooks/useTokenPrices';
import { useTokenBalances } from '@/lib/trading/hooks/useTokenBalances';

interface TokenContextType {
  tokens: TokenData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  getToken: (address: string, chainId?: number) => TokenData | undefined;
  getTokenBalance: (address: string, chainId?: number) => string | undefined;
  getTokenPrice: (address: string, chainId?: number) => number | undefined;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children, initialTokens = [] }: { children: React.ReactNode; initialTokens?: TokenData[] }) {
  const [tokens, setTokens] = useState<TokenData[]>(initialTokens);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch token prices
  const { data: tokenPrices } = useTokenPrices(tokens);
  
  // Update tokens with prices when they're fetched
  useEffect(() => {
    if (tokenPrices) {
      setTokens(currentTokens => 
        currentTokens.map(token => {
          const priceData = tokenPrices.find(
            p => p.tokenAddress.toLowerCase() === token.address.toLowerCase() && 
                 p.chainId === token.chainId
          );
          return priceData ? { ...token, price: priceData.price } : token;
        })
      );
    }
  }, [tokenPrices]);

  // Fetch token balances
  const { balances: tokenBalances } = useTokenBalances(tokens);

  // Helper functions
  const getToken = (address: string, chainId?: number) => {
    return tokens.find(
      t => t.address.toLowerCase() === address.toLowerCase() && 
           (!chainId || t.chainId === chainId)
    );
  };

  const getTokenBalance = (address: string, chainId?: number) => {
    const balance = tokenBalances.find(
      b => b.token.address.toLowerCase() === address.toLowerCase() &&
           (!chainId || b.token.chainId === chainId)
    );
    return balance?.balance;
  };

  const getTokenPrice = (address: string, chainId?: number) => {
    const token = getToken(address, chainId);
    return token?.price;
  };

  const refetch = async () => {
    try {
      setIsLoading(true);
      // Implement refetch logic here
      // This would typically involve refetching tokens from your API
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tokens'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TokenContext.Provider
      value={{
        tokens,
        isLoading,
        error,
        refetch,
        getToken,
        getTokenBalance,
        getTokenPrice,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}
