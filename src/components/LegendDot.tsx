import React from 'react';
import { formatCurrency } from '../state/selectors';
import './LegendDot.css';

interface LegendDotProps {
  color: string;
  label: string;
  value: number;
}

export function LegendDot({ color, label, value }: LegendDotProps) {
  return (
    <div className="legend-dot">
      <div 
        className="legend-dot-color" 
        style={{ backgroundColor: color } as React.CSSProperties}
      />
      <div className="legend-dot-text">
        <span className="legend-dot-label">{label}</span>
        <span className="legend-dot-value">{formatCurrency(value)}</span>
      </div>
    </div>
  );
}





