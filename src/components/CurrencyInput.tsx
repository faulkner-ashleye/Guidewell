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
    <div className="w-full">
      {label && (
        <label className="block mb-xs text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <span className="absolute left-md top-1/2 transform -translate-y-1/2 text-gray-500 text-base font-medium pointer-events-none">
          $
        </span>
        
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-lg pr-md py-md border-2 border-gray-200 rounded-lg text-base font-medium outline-none transition-colors ${
            disabled 
              ? 'bg-gray-50 text-gray-400' 
              : 'bg-white text-gray-900 focus:border-blue-600'
          }`}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
