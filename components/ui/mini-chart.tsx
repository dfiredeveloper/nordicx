'use client';

import React from 'react';

interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
}

function getSmoothPoints(data: number[], width: number, height: number) {
  // Normalize data to fit in the chart area
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - 4) + 2;
    const y = height - 2 - ((value - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');
}

export default function MiniChart({ 
  data, 
  width = 100, 
  height = 36, 
  isPositive = true 
}: MiniChartProps) {
  if (!data || data.length < 2) {
    return (
      <div 
        className="flex items-center justify-center text-xs text-gray-400"
        style={{ width, height }}
      >
        --
      </div>
    );
  }

  const points = getSmoothPoints(data, width, height);
  const chartColor = isPositive ? '#00D084' : '#F94F6B';

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        fill="none"
        stroke={chartColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
} 