import React, { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined';
}

export function Input({ label, error, helperText, variant = 'default', ...props }: InputProps) {
  const baseClasses = 'input';
  
  const variantClasses = {
    default: '',
    outlined: 'input-outlined'
  };
  
  const errorClasses = error ? 'input-error' : '';
  
  const inputClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses}`;
  
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && <span className="form-help">{helperText}</span>}
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
  const baseClasses = 'select';
  
  const errorClasses = error ? 'input-error' : '';
  
  const selectClasses = `${baseClasses} ${errorClasses}`;
  
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <select className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && <span className="form-help">{helperText}</span>}
    </div>
  );
}









