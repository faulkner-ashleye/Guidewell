import React, { ReactNode } from 'react';

interface ChipGroupProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function ChipGroup({ children, direction = 'horizontal' }: ChipGroupProps) {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: '12px',
        flexWrap: 'wrap'
      }}
    >
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
  const getVariantStyles = () => {
    if (disabled) {
      return {
        backgroundColor: '#f3f4f6',
        borderColor: '#d1d5db',
        color: '#9ca3af',
        cursor: 'not-allowed'
      };
    }

    if (selected) {
      switch (variant) {
        case 'success':
          return {
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            color: 'white'
          };
        case 'warning':
          return {
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b',
            color: 'white'
          };
        case 'error':
          return {
            backgroundColor: '#ef4444',
            borderColor: '#ef4444',
            color: 'white'
          };
        default:
          return {
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            color: 'white'
          };
      }
    }

    return {
      backgroundColor: 'white',
      borderColor: '#d1d5db',
      color: '#374151'
    };
  };

  const styles = getVariantStyles();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 20px',
        border: '2px solid',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        ...styles
      }}
      onMouseEnter={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      {label}
    </button>
  );
}




