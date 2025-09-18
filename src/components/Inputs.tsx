import React, { InputHTMLAttributes } from 'react';
import './Inputs.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined';
}

export function Input({ label, error, helperText, variant = 'default', ...props }: InputProps) {
  const inputClasses = `input input--${variant} ${error ? 'input--error' : ''}`;
  
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
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
  const selectClasses = `select ${error ? 'select--error' : ''}`;
  
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <select className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
}






