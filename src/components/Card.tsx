import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const baseClasses = 'bg-white rounded-xl p-4 transition-all duration-200';
  
  const variantClasses = {
    default: 'border border-gray-200',
    outlined: 'border-2 border-gray-300',
    elevated: 'shadow-lg border-0'
  };
  
  const clickableClasses = onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0' : '';
  
  const responsiveClasses = 'sm:p-3 sm:rounded-lg';
  
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${clickableClasses} ${responsiveClasses} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}









