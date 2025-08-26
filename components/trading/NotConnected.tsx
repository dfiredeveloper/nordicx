import React from 'react';

export function NotConnected() {
    return (
        <div className="py-8 text-center">
            <div className="text-accent-aux-1 mb-2">Wallet not connected</div>
            <p className="text-sm text-gray-400">Please connect your wallet to start trading</p>
        </div>
    );
}

export default NotConnected;
