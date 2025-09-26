import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const baseClasses = 'card card-visible';
  
  const variantClasses = {
    default: '',
    outlined: 'card-outlined',
    elevated: 'card-elevated'
  };
  
  const clickableClasses = onClick ? 'card-clickable card-interactive' : '';
  
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${clickableClasses} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}









