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
  const canProceed = !!(data.name && data.email && data.password);

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">Create your account</h1>
          <p>Let's get you set up with Guidewell.</p>
          <p className="typography-caption">This step is just for demo purposes. Enter any info to continue — no validation required</p>

          {/* Account Creation Fields */}
          <div className="account-fields">
            <div className="field-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={data.name || ''}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Enter your full name"
                className="onboarding-input"
              />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={data.email || ''}
                onChange={(e) => update('email', e.target.value)}
                placeholder="Enter your email"
                className="onboarding-input"
              />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={data.password || ''}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Create a password"
                className="onboarding-input"
              />
            </div>
          </div>


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
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
