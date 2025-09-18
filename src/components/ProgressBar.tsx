import React from 'react';

interface ProgressBarProps {
  percent: number;
  color?: string;
}

export function ProgressBar({ percent, color = '#10b981' }: ProgressBarProps) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-300 ease-in-out"
        style={{ 
          width: `${Math.max(0, Math.min(100, percent))}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}





