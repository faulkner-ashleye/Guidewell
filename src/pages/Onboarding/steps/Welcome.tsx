import React from 'react';
import { OnboardingState } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import '../../../components/Button.css';

interface WelcomeProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function Welcome({ data, update, onNext, onSkip }: WelcomeProps) {
  return (
    <div className="onboarding-step">
      {/* Logo Placeholder */}
      <div className="logo-container">
        <div className="logo-placeholder">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">Guidewell</div>
        </div>
      </div>
      
      <h1>{onboardingCopy.header}</h1>
      <p>{onboardingCopy.subtext}</p>
      
      {/* Name Fields */}
      <div className="name-fields">
        <div className="field-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={data.firstName || ''}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="Enter your first name"
            className="onboarding-input"
          />
        </div>
        <div className="field-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={data.lastName || ''}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="Enter your last name"
            className="onboarding-input"
          />
        </div>
      </div>
      
      <div className="onboarding-actions">
        <div className="action-buttons single-button">
          <Button 
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            onClick={onNext}
          >
            Get started
          </Button>
        </div>
      </div>
      
      <p className="disclaimer">{onboardingCopy.disclaimer}</p>
    </div>
  );
}