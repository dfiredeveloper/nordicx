import React, { useState } from 'react';
import SellNow from './SellNow';
import SellAuto from './SellAuto';

export default function SellTab() {
    const [sellTabs, setSellTabs] = useState<'sell-now' | 'sell-auto'>('sell-now');

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
                <div className="flex gap-3">
                    <button
                        onClick={() => setSellTabs('sell-now')}
                        className={`font-medium ${
                            sellTabs === 'sell-now' ? 'text-white' : 'text-accent-aux-1 hover:text-white'
                        }`}
                    >
                        Sell Now
                    </button>
                    <button
                        onClick={() => setSellTabs('sell-auto')}
                        className={`font-medium ${
                            sellTabs === 'sell-auto' ? 'text-white' : 'text-accent-aux-1 hover:text-white'
                        }`}
                    >
                        Sell Auto
                    </button>
                </div>
                <div className="whitespace-nowrap text-accent-aux-1">
                    Bal: --ETH
                </div>
            </div>

            {sellTabs === 'sell-now' ? (
                <SellNow />
            ) : (
                <SellAuto />
            )}
        </div>
    );
}
