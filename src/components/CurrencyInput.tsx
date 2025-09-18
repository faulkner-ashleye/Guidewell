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
    // Reset border color
    e.target.style.borderColor = '#e5e7eb';
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <span 
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
            fontSize: '16px',
            fontWeight: '500',
            pointerEvents: 'none'
          }}
        >
          $
        </span>
        
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '12px 12px 12px 32px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: disabled ? '#f9fafb' : 'white',
            color: disabled ? '#9ca3af' : '#111827',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
          }}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
