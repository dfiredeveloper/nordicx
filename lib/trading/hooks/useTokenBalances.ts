import { useQuery } from '@tanstack/react-query';
import { useAccount, useBalance, useReadContract, usePublicClient } from 'wagmi';
import { TokenData, TokenBalance } from '@/types/token';
import { formatUnits, erc20Abi } from 'viem';

export function useTokenBalances(tokens: TokenData[] = []) {
  const { address, isConnected } = useAccount();
  
  // Fetch native token balance (ETH, BNB, etc.)
  const { data: nativeBalance, isLoading: isLoadingNative } = useBalance({
    address,
    query: {
      enabled: isConnected,
    },
  });

  const publicClient = usePublicClient();

  // Fetch ERC20 token balances
  const tokenBalances = useQuery<TokenBalance[]>({
    queryKey: ['tokenBalances', address, tokens.map(t => t.address)],
    queryFn: async () => {
      if (!address || !isConnected || !publicClient) return [];
      
      const balancePromises = tokens.map(async (token) => {
        try {
          // Get token balance and decimals in parallel
          const [balanceData, decimalsData] = await Promise.all([
            publicClient.readContract({
              address: token.address as `0x${string}`,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [address as `0x${string}`],
            }),
            publicClient.readContract({
              address: token.address as `0x${string}`,
              abi: erc20Abi,
              functionName: 'decimals',
            }),
          ]);
          
          const decimals = Number(decimalsData || token.decimals || 18);
          const balance = formatUnits(balanceData || BigInt(0), decimals);
          const price = token.price || 0;
          const balanceUsd = parseFloat(balance) * price;
          
          return {
            token: {
              ...token,
              decimals
            },
            balance,
            balanceUsd,
            price
          };
        } catch (error) {
          console.error(`Error fetching balance for token ${token.address}:`, error);
          return {
            token,
            balance: '0',
            balanceUsd: 0,
            price: token.price || 0,
          };
        }
      });
      
      return Promise.all(balancePromises);
    },
    enabled: isConnected && tokens.length > 0 && !!publicClient,
    refetchInterval: 30000,
  });

  // Combine native and token balances
  const allBalances = [
    ...(isConnected && nativeBalance ? [{
      token: {
        address: '0x0000000000000000000000000000000000000000',
        name: nativeBalance.symbol,
        symbol: nativeBalance.symbol,
        decimals: nativeBalance.decimals,
        chainId: 1, // This should be dynamic based on the chain
      },
      balance: nativeBalance.formatted,
      balanceUsd: parseFloat(nativeBalance.formatted) * (parseFloat(nativeBalance.formatted) || 0),
      price: 0, // This should come from price feed
    }] : []),
    ...(tokenBalances.data || []),
  ];

  return {
    balances: allBalances,
    isLoading: isLoadingNative || (isConnected && tokenBalances.isLoading),
    error: tokenBalances.error,
    refetch: tokenBalances.refetch,
  };
}
