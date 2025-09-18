import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4 sm:p-2" onClick={onClose}>
      <div 
        className={`bg-white rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] max-h-[90vh] overflow-y-auto w-full ${sizeClasses[size]} sm:rounded-lg`} 
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-0 border-b border-gray-200 mb-5 sm:px-4 sm:pt-4 sm:mb-4">
            <h2 className="text-lg font-semibold text-gray-900 m-0 sm:text-base">{title}</h2>
            <button className="bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-700" onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className="px-6 pb-6 sm:px-4 sm:pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}









