import React, { ReactNode } from 'react';

interface CardSelectProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function CardSelect({ children, direction = 'horizontal' }: CardSelectProps) {
  return (
    <div className={`flex gap-md flex-wrap ${
      direction === 'vertical' ? 'flex-col' : 'flex-row'
    }`}>
      {children}
    </div>
  );
}

interface SelectCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}

export function SelectCard({ 
  title, 
  description, 
  selected, 
  onClick, 
  disabled = false,
  icon
}: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-lg border-2 rounded-xl transition-all text-left w-full min-w-50 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
      } ${
        selected 
          ? 'border-blue-600 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-blue-600 hover:bg-gray-50'
      }`}
    >
      {icon && (
        <div className="text-2xl mb-sm">
          {icon}
        </div>
      )}
      
      <h4 className={`mb-xs text-base font-semibold ${
        selected ? 'text-blue-700' : 'text-gray-900'
      }`}>
        {title}
      </h4>
      
      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </button>
  );
}




