import React from 'react';
import './OnboardingHeader.css';

interface OnboardingHeaderProps {
  className?: string;
  animated?: boolean;
}

export function OnboardingHeader({ className = '', animated = false }: OnboardingHeaderProps) {
  return (
    <div className={`onboarding-header ${className}`}>
      {/* Top Section with Logo and Arrow Background */}
      <div className="onboarding-header-top">
        {/* Arrow Background */}
        <div className="onboarding-header-arrow-bg">

        </div>

        {/* Logo */}
        <div className={`onboarding-header-logo-container ${animated ? 'animated' : ''}`}>
          <img
            src="/guidewell-logo_light.svg"
            alt="Guidewell"
            className="onboarding-header-logo light-logo"
          />
          <img
            src="/guidewell-logo_dark.png"
            alt="Guidewell"
            className="onboarding-header-logo dark-logo"
          />
        </div>
      </div>
    </div>
  );
}
