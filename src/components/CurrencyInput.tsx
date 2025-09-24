import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export function CurrencyInput({ 
  value, 
  onChange, 
  placeholder = '0.00',
  disabled = false,
  label
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value.toFixed(2));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Parse the input value
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onChange(numericValue);
    } else if (inputValue === '') {
      onChange(undefined);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Format the value on blur
    if (value !== undefined) {
      setDisplayValue(value.toFixed(2));
    }
  };

  return (
    <div className="currency-input-container">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      
      <div className="currency-input-wrapper">
        <span className="currency-symbol">$</span>
        
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input currency-input"
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
