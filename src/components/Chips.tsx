import React from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Chip({ label, selected = false, onClick, variant = 'default' }: ChipProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const selectedClasses = selected ? 'bg-blue-500 text-white border-blue-500' : '';
  const clickableClasses = onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-sm' : '';
  const responsiveClasses = 'sm:px-2 sm:py-1 sm:text-xs';
  
  const chipClasses = `${baseClasses} ${variantClasses[variant]} ${selectedClasses} ${clickableClasses} ${responsiveClasses}`;
  
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









