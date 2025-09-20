import React from 'react';
import { OnboardingState } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

interface WelcomeProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function Welcome({ data, update, onNext, onSkip }: WelcomeProps) {
  return (
    <div className="welcome-screen">
      <OnboardingHeader animated={true} />

      {/* Bottom Section with Content */}
      <div className="welcome-bottom-section">
        <div className="welcome-content">
          <h1 className="typography-display2">Your guide begins here</h1>
          <h2 className="typography-h2">You've got goals. We'll help you see the options.</h2>
          <p>Guidewell organizes your financial picture and points out opportunities to explore.</p>

          <div className="onboarding-actions">
            <div className="action-buttons single-button">
              <Button
                variant={ButtonVariants.contained}
                color={ButtonColors.secondary}
                fullWidth={true}
                onClick={onNext}
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
