import React from 'react';

interface MetricProps {
    title: string;
    value: string | number | undefined;
    change?: number;
    isCurrency?: boolean;
}

export function Metric({ title, value, change, isCurrency = false }: MetricProps) {
    const formattedValue = value !== undefined 
        ? isCurrency 
            ? `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
            : value
        : '--';

    const changeClass = change 
        ? change >= 0 
            ? 'text-green-500' 
            : 'text-red-500'
        : '';

    return (
        <div className="mb-4">
            <div className="text-xs text-accent-aux-1 mb-1">{title}</div>
            <div className="flex items-center">
                <span className="text-white text-sm font-medium">{formattedValue}</span>
                {change !== undefined && (
                    <span className={`ml-2 text-xs ${changeClass}`}>
                        {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                    </span>
                )}
            </div>
        </div>
    );
}

export default Metric;
