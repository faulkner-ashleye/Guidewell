import React from 'react';
import './Chips.css';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Chip({ label, selected = false, onClick, variant = 'default' }: ChipProps) {
  const chipClasses = `chip chip--${variant} ${selected ? 'chip--selected' : ''} ${onClick ? 'chip--clickable' : ''}`;
  
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
    <div className={`chip-group ${className}`}>
      {children}
    </div>
  );
}









