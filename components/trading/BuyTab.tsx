import React, { useState } from 'react';
import BuyNow from './BuyNow';
import BuyDip from './BuyDip';

interface BuyTabProps {
    tokenAddress: string;
    chainId?: number;
}

export default function BuyTab({ tokenAddress, chainId = 1 }: BuyTabProps) {
    const [tpSlCheck, setTpSlCheck] = useState(false);
    const [buyTabs, setBuyTabs] = useState<'buy-now' | 'buy-dip'>('buy-now');

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
                <div className="flex gap-3">
                    <button
                        onClick={() => setBuyTabs('buy-now')}
                        className={`font-medium ${
                            buyTabs === 'buy-now' ? 'text-white' : 'text-accent-aux-1 hover:text-white'
                        }`}
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={() => setBuyTabs('buy-dip')}
                        className={`font-medium ${
                            buyTabs === 'buy-dip' ? 'text-white' : 'text-accent-aux-1 hover:text-white'
                        }`}
                    >
                        Buy Dip
                    </button>
                </div>
                <div className="whitespace-nowrap text-accent-aux-1">
                    Bal: --ETH
                </div>
            </div>

            {buyTabs === 'buy-now' ? (
                <BuyNow 
                    tokenAddress={tokenAddress}
                    chainId={chainId}
                    tpSlCheck={tpSlCheck}
                    setTpSlCheck={setTpSlCheck}
                />
            ) : (
                <BuyDip />
            )}
        </div>
    );
}
