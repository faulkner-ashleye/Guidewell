import React from 'react';
import { formatCurrency } from '../state/selectors';

interface LegendDotProps {
  color: string;
  label: string;
  value: number;
}

export function LegendDot({ color, label, value }: LegendDotProps) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: color } as React.CSSProperties}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-[#B6B6B6]">{label}</span>
        <span className="text-sm font-semibold text-white">{formatCurrency(value)}</span>
      </div>
    </div>
  );
}





