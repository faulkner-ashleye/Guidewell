import React, { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const cardClasses = `card card--${variant} ${onClick ? 'card--clickable' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}






