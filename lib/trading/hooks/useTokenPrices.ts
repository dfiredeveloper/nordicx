import { useQuery } from '@tanstack/react-query';
import { TokenData } from '@/types/token';
import { priceFeedService } from '@/lib/services/priceFeed';

export function useTokenPrices(tokens: TokenData[]) {
  return useQuery({
    queryKey: ['tokenPrices', tokens.map(t => `${t.chainId}-${t.address}`)],
    queryFn: async () => {
      const pricePromises = tokens.map(async (token) => {
        try {
          const price = await priceFeedService.getTokenPrice(
            token.address,
            token.chainId
          );
          return {
            tokenAddress: token.address,
            chainId: token.chainId,
            price,
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          console.error(`Failed to fetch price for token ${token.address}:`, error);
          return {
            tokenAddress: token.address,
            chainId: token.chainId,
            price: token.price || 0, // Fallback to existing price if available
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          };
        }
      });

      return Promise.all(pricePromises);
    },
    enabled: tokens.length > 0,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
