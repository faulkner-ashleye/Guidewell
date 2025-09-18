import React, { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined';
}

export function Input({ label, error, helperText, variant = 'default', ...props }: InputProps) {
  const baseClasses = 'px-4 py-3 rounded-lg border text-base transition-all duration-200 bg-white focus:outline-none focus:ring-3 focus:ring-blue-100';
  
  const variantClasses = {
    default: 'border-gray-300',
    outlined: 'border-2 border-gray-300'
  };
  
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500';
  const responsiveClasses = 'sm:px-3 sm:py-2.5 sm:text-base'; // Prevent zoom on iOS
  
  const inputClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${responsiveClasses}`;
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
      {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, helperText, options, ...props }: SelectProps) {
  const baseClasses = 'px-4 py-3 rounded-lg border text-base bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-100';
  
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500';
  const responsiveClasses = 'sm:px-3 sm:py-2.5 sm:text-base'; // Prevent zoom on iOS
  
  const selectClasses = `${baseClasses} ${errorClasses} ${responsiveClasses}`;
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
}









