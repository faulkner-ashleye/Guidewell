import React from 'react';
import { Logo } from '../../../components/Logo';
import './OnboardingHeader.css';

interface OnboardingHeaderProps {
  className?: string;
}

export function OnboardingHeader({ className = '' }: OnboardingHeaderProps) {
  return (
    <div className={`onboarding-header ${className}`}>
      {/* Top Section with Logo */}
      <div className="onboarding-header-top">
        <div className="onboarding-header-logo-container">
          <Logo size="lg" className="onboarding-header-logo" />
        </div>
      </div>

      {/* Wave Division */}
      <div className="onboarding-header-wave">
        <svg viewBox="0 0 375 100" preserveAspectRatio="none" className="onboarding-header-wave-svg">
          <path d="M0,50 Q93.75,10 187.5,50 T375,50 L375,100 L0,100 Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
}
