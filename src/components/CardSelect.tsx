import React, { ReactNode } from 'react';

interface CardSelectProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function CardSelect({ children, direction = 'horizontal' }: CardSelectProps) {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      {children}
    </div>
  );
}

interface SelectCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}

export function SelectCard({ 
  title, 
  description, 
  selected, 
  onClick, 
  disabled = false,
  icon
}: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '20px',
        border: selected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: selected ? '#eff6ff' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        width: '100%',
        minWidth: '200px',
        opacity: disabled ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      {icon && (
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>
          {icon}
        </div>
      )}
      
      <h4 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '16px', 
        fontWeight: '600',
        color: selected ? '#1d4ed8' : '#111827'
      }}>
        {title}
      </h4>
      
      <p style={{ 
        margin: '0', 
        fontSize: '14px', 
        color: '#6b7280',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
    </button>
  );
}



