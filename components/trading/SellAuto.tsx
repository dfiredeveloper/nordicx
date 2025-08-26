import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export default function SellAuto() {
    const { address } = useAccount();
    const [takeProfit, setTakeProfit] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        if (!takeProfit || !stopLoss || !amount) {
            setError('Please fill in all fields');
            return;
        }

        const tp = parseFloat(takeProfit);
        const sl = parseFloat(stopLoss);
        const amt = parseFloat(amount);

        if (isNaN(tp) || tp <= 0 || isNaN(sl) || sl <= 0 || isNaN(amt) || amt <= 0) {
            setError('Please enter valid numbers');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Auto sell order created successfully!');
            // Reset form
            setTakeProfit('');
            setStopLoss('');
            setAmount('');
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm text-accent-aux-1">Take Profit (%)</label>
                <input
                    type="text"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="10"
                    className="w-full p-3 rounded-lg bg-accent-2 text-white border border-accent-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm text-accent-aux-1">Stop Loss (%)</label>
                <input
                    type="text"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="5"
                    className="w-full p-3 rounded-lg bg-accent-2 text-white border border-accent-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="block text-sm text-accent-aux-1">Amount</label>
                    <span className="text-xs text-accent-aux-1">Balance: 0.0</span>
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
                disabled={isLoading || !takeProfit || !stopLoss || !amount}
                className={`w-full py-3 rounded-lg font-medium ${
                    isLoading || !takeProfit || !stopLoss || !amount
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
            >
                {isLoading ? 'Creating Order...' : 'Create Auto Sell Order'}
            </button>

            <div className="text-xs text-accent-aux-1 mt-2">
                <p>• Take Profit: Sells when price increases by the specified percentage</p>
                <p>• Stop Loss: Sells when price decreases by the specified percentage</p>
            </div>
        </form>
    );
}
