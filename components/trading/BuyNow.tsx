'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { useTrading } from '@/lib/trading/hooks/useTrading';

interface BuyNowProps {
    setTpSlCheck: (value: boolean) => void;
    tpSlCheck: boolean;
    tokenAddress: string;
    chainId?: number;
}

export function BuyNow({ setTpSlCheck, tpSlCheck, tokenAddress, chainId = 1 }: BuyNowProps) {
    // --- Trading logic state ---
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const { address: walletAddress } = useAccount();
    const { executeSwap } = useTrading();

    // Handle percentage button clicks
    const handlePercentageClick = (percent: number) => {
        // TODO: Get actual wallet balance
        const balance = 1; // Replace with actual wallet balance
        const calculatedAmount = (balance * percent / 100).toFixed(6);
        setAmount(calculatedAmount);
    };

    // Handle buy action
    const handleBuy = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!tokenAddress) {
            setError('Token address is not available');
            return;
        }

        if (!walletAddress) {
            setError('Please connect your wallet');
            return;
        }

        setIsLoading(true);
        
        try {
            const result = await executeSwap({
                fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native token
                toToken: tokenAddress,
                amount: amount,
                chainId: chainId,
                slippage: 0.5, // Default slippage
            });

            if (result.success) {
                setTxHash(result.txHash || null);
                toast.success('Swap executed successfully!', {
                    action: result.txHash ? {
                        label: 'View on Explorer',
                        onClick: () => window.open(`https://etherscan.io/tx/${result.txHash}`, '_blank')
                    } : undefined
                });
            } else {
                setError(result.error || 'Failed to execute swap');
                toast.error(result.error || 'Failed to execute swap');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Amount Input */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Amount</label>
                    <span className="text-xs text-gray-400">Balance: 1.0 ETH</span>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-right pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <button
                            type="button"
                            onClick={() => handlePercentageClick(25)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                            disabled={isLoading}
                        >
                            25%
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePercentageClick(50)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                            disabled={isLoading}
                        >
                            50%
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePercentageClick(75)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                            disabled={isLoading}
                        >
                            75%
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePercentageClick(100)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                            disabled={isLoading}
                        >
                            MAX
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* Buy Button */}
            <button
                onClick={handleBuy}
                disabled={isLoading || !amount}
                className={`w-full py-3 rounded-lg font-medium text-white ${
                    isLoading || !amount
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isLoading ? 'Processing...' : 'Buy'}
            </button>

            {/* Transaction Link */}
            {txHash && (
                <div className="text-center">
                    <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                    >
                        View on Etherscan
                    </a>
                </div>
            )}
        </div>
    );
}

export default BuyNow;
