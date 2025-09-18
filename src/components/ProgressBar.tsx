import React from 'react';
import { COLORS } from '../ui/colors';
import './ProgressBar.css';

interface ProgressBarProps {
  percent: number;
  color?: string;
}

export function ProgressBar({ percent, color = COLORS.savings }: ProgressBarProps) {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill"
        style={{ 
          width: `${Math.max(0, Math.min(100, percent))}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}


