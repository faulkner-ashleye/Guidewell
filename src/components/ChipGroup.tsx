import React, { ReactNode } from 'react';

interface ChipGroupProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function ChipGroup({ children, direction = 'horizontal' }: ChipGroupProps) {
  return (
    <div className={`flex gap-sm flex-wrap ${
      direction === 'vertical' ? 'flex-col' : 'flex-row'
    }`}>
      {children}
    </div>
  );
}

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Chip({ 
  label, 
  selected, 
  onClick, 
  disabled = false,
  variant = 'default'
}: ChipProps) {
  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed';
    }

    if (selected) {
      switch (variant) {
        case 'success':
          return 'bg-success border-success text-white';
        case 'warning':
          return 'bg-warning border-warning text-white';
        case 'error':
          return 'bg-error border-error text-white';
        default:
          return 'bg-blue-600 border-blue-600 text-white';
      }
    }

    return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-lg py-md border-2 rounded-full text-sm font-medium transition-all ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${getVariantClasses()}`}
    >
      {label}
    </button>
  );
}




