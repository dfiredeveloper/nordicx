import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { useTrading } from '@/lib/trading/hooks/useTrading';

export default function SellNow() {
    const { address } = useAccount();
    const { executeSwap } = useTrading();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    const handleSell = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        try {
            const result = await executeSwap({
                fromToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
                toToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
                amount: amount,
                chainId: 1,
                slippage: 0.5,
            });

            if (result.success) {
                setTxHash(result.txHash || null);
                toast.success('Sell order executed successfully!');
            } else {
                setError(result.error || 'Failed to execute sell order');
                toast.error(result.error || 'Failed to execute sell order');
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
            toast.error(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSell} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full p-3 rounded-lg bg-accent-2 text-white border border-accent-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setAmount((parseFloat(amount) * 0.25).toString())}
                        className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                        disabled={isLoading}
                    >
                        25%
                    </button>
                    <button
                        type="button"
                        onClick={() => setAmount((parseFloat(amount) * 0.5).toString())}
                        className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                        disabled={isLoading}
                    >
                        50%
                    </button>
                    <button
                        type="button"
                        onClick={() => setAmount((parseFloat(amount) * 0.75).toString())}
                        className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                        disabled={isLoading}
                    >
                        75%
                    </button>
                    <button
                        type="button"
                        onClick={() => setAmount('100')} // Replace with actual balance
                        className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                        disabled={isLoading}
                    >
                        MAX
                    </button>
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !amount}
                className={`w-full py-3 rounded-lg font-medium ${
                    isLoading || !amount
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                } text-white transition-colors`}
            >
                {isLoading ? 'Selling...' : 'Sell Now'}
            </button>

            {txHash && (
                <div className="text-sm text-center text-blue-400">
                    <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        View on Etherscan
                    </a>
                </div>
            )}
        </form>
    );
}
