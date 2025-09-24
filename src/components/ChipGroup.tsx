import React, { ReactNode } from 'react';

interface ChipGroupProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function ChipGroup({ children, direction = 'horizontal' }: ChipGroupProps) {
  return (
    <div className={`flex gap-sm flex-wrap chipgroup ${
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
  const baseClasses = 'chip';
  const selectedClasses = selected ? 'chip-active' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${selectedClasses}`.trim()}
    >
      {label}
    </button>
  );
}
