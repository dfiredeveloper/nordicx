import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export default function BuyDip() {
    const { address } = useAccount();
    const [amount, setAmount] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        if (!amount || !targetPrice) {
            setError('Please fill in all fields');
            return;
        }

        const amountNum = parseFloat(amount);
        const targetPriceNum = parseFloat(targetPrice);

        if (isNaN(amountNum) || amountNum <= 0 || isNaN(targetPriceNum) || targetPriceNum <= 0) {
            setError('Please enter valid numbers');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Buy dip order created successfully!');
            // Reset form
            setAmount('');
            setTargetPrice('');
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm text-accent-aux-1">Target Price (ETH)</label>
                <input
                    type="text"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.0"
                    className="w-full p-3 rounded-lg bg-accent-2 text-white border border-accent-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="block text-sm text-accent-aux-1">Amount to Buy</label>
                    <span className="text-xs text-accent-aux-1">Balance: 0.0 ETH</span>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="0.0"
                        className="w-full p-3 rounded-lg bg-accent-2 text-white border border-accent-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAmount('25')}
                            className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                            disabled={isLoading}
                        >
                            25%
                        </button>
                        <button
                            type="button"
                            onClick={() => setAmount('50')}
                            className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                            disabled={isLoading}
                        >
                            50%
                        </button>
                        <button
                            type="button"
                            onClick={() => setAmount('75')}
                            className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                            disabled={isLoading}
                        >
                            75%
                        </button>
                        <button
                            type="button"
                            onClick={() => setAmount('100')}
                            className="text-xs px-2 py-1 bg-accent-3 rounded hover:bg-accent-4"
                            disabled={isLoading}
                        >
                            MAX
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !amount || !targetPrice}
                className={`w-full py-3 rounded-lg font-medium ${
                    isLoading || !amount || !targetPrice
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
            >
                {isLoading ? 'Creating Order...' : 'Create Buy Dip Order'}
            </button>

            <div className="text-xs text-accent-aux-1 mt-2">
                <p>This will automatically buy when the price drops to your target price</p>
            </div>
        </form>
    );
}
