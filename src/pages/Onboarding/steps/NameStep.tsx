import React from 'react';
import { OnboardingState } from '../../../data/onboardingTypes';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

interface NameStepProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
}

export function NameStep({ data, update, onNext }: NameStepProps) {
  const canProceed = !!(data.firstName && data.lastName);

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">Let's start with your name</h1>
          <p>This helps Guidewell keep things personal and organized.</p>

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
                fullWidth={true}
                onClick={onNext}
                disabled={!canProceed}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
