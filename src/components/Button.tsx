import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outline' | 'text';
  color?: 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function Button({
  children,
  variant = 'contained',
  color = 'secondary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}: ButtonProps) {
  // Force secondary color for all contained variants
  const effectiveColor = variant === 'contained' ? 'secondary' : color;
  
  const baseClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${effectiveColor}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    disabled ? 'btn--disabled' : ''
  ].filter(Boolean).join(' ');

  const finalClassName = `${baseClasses} ${className}`.trim();

  return (
    <button
      type={type}
      className={finalClassName}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </button>
  );
}

// Export button variants for easy access
export const ButtonVariants = {
  contained: 'contained' as const,
  outline: 'outline' as const,
  text: 'text' as const
};

export const ButtonColors = {
  secondary: 'secondary' as const,
  error: 'error' as const
};

export const ButtonSizes = {
  small: 'small' as const,
  medium: 'medium' as const,
  large: 'large' as const
};
