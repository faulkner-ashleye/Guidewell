import React from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Chip({ label, selected = false, onClick, variant = 'default' }: ChipProps) {
  const baseClasses = 'chip';
  const selectedClasses = selected ? 'chip-active' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const chipClasses = `${baseClasses} ${selectedClasses} ${clickableClasses}`.trim();
  
  return (
    <span className={chipClasses} onClick={onClick}>
      {label}
    </span>
  );
}

interface ChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ChipGroup({ children, className = '' }: ChipGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 sm:gap-1.5 ${className}`}>
      {children}
    </div>
  );
}









