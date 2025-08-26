import React from 'react';
import { TokenData } from '@/types/token';

interface AuditItemProps {
    label: string;
    value: boolean | string | number | undefined;
    isGood?: boolean;
    tooltip?: string;
}

const AuditItem: React.FC<AuditItemProps> = ({ label, value, isGood = true, tooltip }) => {
    const getValueDisplay = () => {
        if (value === true) return 'Yes';
        if (value === false) return 'No';
        if (value === undefined || value === null) return '--';
        return value;
    };

    const valueClass = value === true || value === 'Yes' 
        ? 'text-green-500' 
        : value === false || value === 'No' 
            ? 'text-red-500' 
            : 'text-white';

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
            <div className="flex items-center">
                <span className="text-xs text-accent-aux-1">{label}</span>
                {tooltip && (
                    <span className="ml-1 text-gray-500 cursor-help" title={tooltip}>
                        ⓘ
                    </span>
                )}
            </div>
            <span className={`text-sm font-medium ${valueClass}`}>
                {getValueDisplay()}
            </span>
        </div>
    );
};

interface DegenAuditProps {
    chain: string;
    address: string;
    tokenData?: TokenData | null;
}

export function DegenAudit({ chain, address, tokenData }: DegenAuditProps) {
    return (
        <div className="mt-3 w-full flex flex-col bg-accent-search rounded-xl p-3">
            <div className="w-full flex justify-between items-center pb-2">
                <h2 className='text-white text-sm'>Degen Audit</h2>
            </div>
            
            <div className="text-xs">
                <AuditItem 
                    label="Mintable" 
                    value={tokenData?.no_mint === 'false' ? 'Yes' : 'No'}
                    isGood={tokenData?.no_mint === 'false'}
                    tooltip="Can more tokens be minted after launch?"
                />
                <AuditItem 
                    label="Blacklist" 
                    value={tokenData?.blacklist === 'true' ? 'Yes' : 'No'}
                    isGood={tokenData?.blacklist !== 'true'}
                    tooltip="Is there a blacklist that can freeze tokens?"
                />
                <AuditItem 
                    label="Burnt" 
                    value={tokenData?.burnt === 'true' ? 'Yes' : 'No'}
                    isGood={tokenData?.burnt === 'true'}
                    tooltip="Have liquidity tokens been burned?"
                />
                <AuditItem 
                    label="Top 10 Holders" 
                    value={tokenData?.top10 ? `${tokenData.top10}%` : '--'}
                    isGood={!tokenData?.top10 || (typeof tokenData.top10 === 'string' && parseFloat(tokenData.top10) < 50)}
                    tooltip="Percentage of supply held by top 10 wallets"
                />
            </div>
        </div>
    );
}

export default DegenAudit;
