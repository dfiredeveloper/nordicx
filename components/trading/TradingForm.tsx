"use client";

import { useState, useEffect } from 'react';
import { useTrading } from '@/lib/trading/hooks/useTrading';
import { toast } from 'sonner';

// TokenData type with optional fields to match the type in types/token.ts
type TokenData = {
  name?: string;
  symbol?: string;
  price?: number;
  logo?: string;
  price_24h_change?: number;
  address?: string;
  chain?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  age?: string;
  sniperCount?: number;
  sniperTotal?: number;
  bluechipPercent?: string;
  top10Percent?: string;
  auditStatus?: string;
  auditScore?: string;
  volume_24h?: number;
  baseToken?: {
    address: string;
    name?: string;
    symbol?: string;
  };
  token?: {
    address: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

interface TradingFormProps {
  tokenData: TokenData | null;
  onTradeSuccess?: (txHash: string) => void;
}

// Define the return type of useTrading hook
type UseTradingReturn = {
  executeSwap: (params: {
    fromToken: string;
    toToken: string;
    amount: string;
    chainId: number;
    slippage: number;
  }) => Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    [key: string]: any; // Allow for additional properties
  }>;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  address?: string;
};

// Export the component with proper typing
export default function TradingForm({ tokenData, onTradeSuccess }: TradingFormProps) {
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('1');
  const [isBuy, setIsBuy] = useState(true);
  
  // Use type assertion for the useTrading hook return value
  const { executeSwap, isLoading, error, isConnected } = useTrading() as unknown as UseTradingReturn;
  
  // Debug log the tokenData structure and check for address in different fields
  useEffect(() => {
    console.log('Token Data:', tokenData);
    if (tokenData) {
      // Check all possible address fields
      const possibleAddressFields = ['address', 'contract_address', 'id', 'baseToken.address', 'contractAddress'];
      const foundAddress = possibleAddressFields.some(field => {
        const value = field.split('.').reduce<unknown>((obj, key) => {
          if (obj && typeof obj === 'object' && key in obj) {
            return (obj as Record<string, unknown>)[key];
          }
          return undefined;
        }, tokenData);
        
        if (value) {
          console.log(`Found address in ${field}:`, value);
          return true;
        }
        return false;
      });
      
      if (!foundAddress) {
        console.warn('Token data is missing address property. Available keys:', Object.keys(tokenData));
      }
    }
  }, [tokenData]);

  // Show loading state if tokenData is not available yet
  if (!tokenData) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading token data...
      </div>
    );
  }
  
  // Try to extract token address from various possible fields
  const getTokenAddress = (data: TokenData): string | undefined => {
    // Check for baseToken.address first (common in DexScreener responses)
    if (data.baseToken?.address) {
      console.log('Found token address in baseToken.address:', data.baseToken.address);
      return data.baseToken.address;
    }
    
    // Check for direct address fields
    const directAddressFields = [
      'address',
      'contract_address',
      'contractAddress',
      'tokenAddress',
      'token_address',
      'id'
    ];

    for (const field of directAddressFields) {
      if (data[field as keyof TokenData] && typeof data[field as keyof TokenData] === 'string') {
        const value = data[field as keyof TokenData] as string;
        console.log(`Found token address in field '${field}':`, value);
        return value;
      }
    }
    
    // Check for nested token object
    if (data.token?.address) {
      console.log('Found token address in token.address:', data.token.address);
      return data.token.address;
    }

    console.warn('Could not find token address in data. Available keys:', Object.keys(data));
    return undefined;
  };

  const tokenAddress = getTokenAddress(tokenData);
  
  // Import the trading config
  const [isTradingEnabled, setIsTradingEnabled] = useState(false);
  
  // Check trading status on mount
  useEffect(() => {
    try {
      // @ts-ignore - This is a dynamic check for the trading config
      const config = window.__TRADING_CONFIG__ || {};
      setIsTradingEnabled(config.isTradingEnabled === true);
    } catch (e) {
      console.error('Failed to load trading config:', e);
      setIsTradingEnabled(false);
    }
  }, []);

  if (!isTradingEnabled) {
    return (
      <div className="p-4 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Trading is currently disabled. To enable trading, please configure the required API keys in the trading configuration.
              </p>
              <div className="mt-2 text-sm text-yellow-600">
                <p>Required API keys:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>1inch API Key</li>
                  <li>CoinGecko API Key</li>
                  <li>DexScreener API Key</li>
                </ul>
                <p className="mt-2">
                  Add these to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we can't find a token address, show an error
  if (!tokenAddress) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error: Could not determine token address</p>
        <p className="text-sm text-muted-foreground mt-2">
          The token data is missing a valid address field. Please try another token or contact support.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log the current state for debugging
    console.log('Form submitted with:', {
      tokenData,
      tokenAddress,
      amount,
      isBuy,
      slippage
    });
    
    // Validate token data and address
    if (!tokenData) {
      console.error('Token data is not available');
      toast.error('Failed to load token data. Please try again.');
      return;
    }
    
    if (!tokenAddress) {
      console.error('Token address could not be determined');
      console.log('Available token data keys:', Object.keys(tokenData));
      console.log('baseToken:', tokenData.baseToken);
      console.log('token:', tokenData.token);
      toast.error('Invalid token: Could not determine token address');
      return;
    }
    
    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error('Invalid amount');
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      // Ensure we have valid token addresses before proceeding
      if (!tokenAddress) {
        throw new Error('Token address is required for the swap');
      }
      
      // Create a properly typed swap params object
      const swapParams = {
        fromToken: isBuy ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : tokenAddress,
        toToken: isBuy ? tokenAddress : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        amount: amount.toString(),
        chainId: 1, // Default to Ethereum
        slippage: parseFloat(slippage) || 1.0, // Default to 1% slippage if not set
      };
      
      // Call executeSwap with proper error handling
      const result = await executeSwap(swapParams);

      // Handle the result with proper type checking
      if (result && 'success' in result) {
        if (result.success && result.txHash) {
          onTradeSuccess?.(result.txHash);
          setAmount(''); // Clear amount after successful trade
        } else if (!result.success) {
          throw new Error(result.error || 'Failed to execute swap');
        }
      } else {
        throw new Error('Invalid response from swap service');
      }
    } catch (err) {
      console.error('Trade execution error:', err);
      // Error will be handled by the useTrading hook's error state
    }
  };

  // Set default amount to 0.01 ETH or equivalent
  useEffect(() => {
    if (!amount) {
      setAmount('0.01');
    }
  }, [amount]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-card rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-l-md ${
            isBuy ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setIsBuy(true)}
        >
          Buy
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-r-md ${
            !isBuy ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setIsBuy(false)}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount ({isBuy ? 'ETH' : tokenData?.symbol || 'Token'})
          </label>
          <input
            id="amount"
            type="number"
            step="0.000000000000000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full p-2 border rounded bg-background text-foreground"
            required
          />
        </div>

        <div>
          <label htmlFor="slippage" className="block text-sm font-medium mb-1">
            Slippage (%)
          </label>
          <input
            id="slippage"
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isConnected || isLoading || !tokenData}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading
            ? 'Processing...'
            : !isConnected
            ? 'Connect Wallet'
            : isBuy
            ? `Buy ${tokenData?.symbol || 'Token'}`
            : `Sell ${tokenData?.symbol || 'Token'}`}
        </button>
      </form>
    </div>
  );
}
