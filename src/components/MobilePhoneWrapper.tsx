import React from 'react';
import './MobilePhoneWrapper.css';

interface MobilePhoneWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MobilePhoneWrapper({ children, className = '' }: MobilePhoneWrapperProps) {
  return (
    <div className={`phone-wrapper ${className}`}>
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-content">
            {children}
          </div>
        </div>
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  );
}
