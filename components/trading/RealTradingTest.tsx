'use client';
import React, { useState } from 'react';
import { useRealSwap } from '@/lib/trading/hooks/useRealSwap';
import { usePriceFeed } from '@/lib/trading/hooks/usePriceFeed';
import { useAccount } from 'wagmi';

export default function RealTradingTest() {
  const [fromToken, setFromToken] = useState('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'); // WETH
  const [toToken, setToToken] = useState('0xdAC17F958D2ee523a2206206994597C13D831ec7'); // USDT
  const [amount, setAmount] = useState('0.1');
  const [chainId, setChainId] = useState(1);
  const [slippage, setSlippage] = useState(0.5);

  const { address, isConnected } = useAccount();
  const { 
    getQuote, 
    executeSwap, 
    isLoading: swapLoading, 
    error: swapError, 
    quote 
  } = useRealSwap();
  
  const { 
    getTokenPrice, 
    prices, 
    isLoading: priceLoading 
  } = usePriceFeed();

  const handleGetQuote = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    const result = await getQuote(fromToken, toToken, amount, chainId, slippage);
    if (result) {
      console.log('Real quote received:', result);
    }
  };

  const handleExecuteSwap = async () => {
    if (!quote) {
      alert('Please get a quote first');
      return;
    }
    
    const result = await executeSwap(quote, chainId, slippage);
    if (result) {
      console.log('Swap executed:', result);
    }
  };

  const handleGetPrice = async () => {
    const result = await getTokenPrice(fromToken, chainId);
    if (result) {
      console.log('Price received:', result);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Real Trading Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">From Token (Address)</label>
          <input
            type="text"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">To Token (Address)</label>
          <input
            type="text"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            placeholder="0.1"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Chain ID</label>
          <select
            value={chainId}
            onChange={(e) => setChainId(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
          >
            <option value={1}>Ethereum (1)</option>
            <option value={56}>BSC (56)</option>
            <option value={8453}>Base (8453)</option>
            <option value={81457}>Blast (81457)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Slippage (%)</label>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            step="0.1"
            min="0.1"
            max="50"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={handleGetPrice}
            disabled={priceLoading}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {priceLoading ? 'Getting Price...' : 'Get Token Price'}
          </button>

          <button
            onClick={handleGetQuote}
            disabled={swapLoading || !isConnected}
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {swapLoading ? 'Getting Quote...' : 'Get Swap Quote'}
          </button>

          {quote && (
            <button
              onClick={handleExecuteSwap}
              disabled={swapLoading || !isConnected}
              className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {swapLoading ? 'Executing...' : 'Execute Swap'}
            </button>
          )}
        </div>

        {!isConnected && (
          <div className="text-yellow-400 text-sm text-center">
            Please connect your wallet to test trading
          </div>
        )}

        {swapError && (
          <div className="text-red-400 text-sm text-center">
            Error: {swapError}
          </div>
        )}

        {quote && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <h3 className="text-lg font-semibold text-white mb-2">Quote Details</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Provider: {quote.provider}</div>
              <div>Amount In: {quote.amountIn}</div>
              <div>Amount Out: {quote.amountOut}</div>
              <div>Gas Estimate: {quote.gasEstimate}</div>
              <div>Price Impact: {quote.priceImpact}%</div>
              <div>Chain: {quote.chainName}</div>
              <div>Real Quote: {quote.isRealQuote ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}

        {Object.keys(prices).length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <h3 className="text-lg font-semibold text-white mb-2">Price Data</h3>
            <div className="text-sm text-gray-300 space-y-1">
              {Object.entries(prices).map(([address, priceData]) => (
                <div key={address}>
                  {truncateAddress(address)}: ${priceData.price} ({priceData.source})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
