import React from 'react';
import { OnboardingState, Comfort as ComfortType } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Chip } from '../components/Chip';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

interface ComfortProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const comfortOptions: { value: ComfortType; label: string }[] = [
  { value: 'beginner', label: 'Just starting out' },
  { value: 'intermediate', label: 'Building confidence' },
  { value: 'confident', label: 'Comfortable' }
];

export function Comfort({ data, update, onNext, onBack, onSkip }: ComfortProps) {
  const canProceed = !!data.comfort;

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">What's your comfort level?</h1>
          <p className="typography-body1">How confident do you feel managing your finances?</p>

          <div className="chip-container">
            {comfortOptions.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                selected={data.comfort === option.value}
                onClick={() => update('comfort', option.value)}
              />
            ))}
          </div>


        </div>
      </div>
      <div className="onboarding-actions">
        <div className="action-buttons">
        <Button
          variant={ButtonVariants.contained}
          color={ButtonColors.secondary}
          fullWidth={true}
          onClick={onNext}
          disabled={!canProceed}
        >
          Next
        </Button>
          <Button
            variant={ButtonVariants.outline}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant={ButtonVariants.text}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={onSkip}
          >
            {onboardingCopy.skip}
          </Button>
        </div>
      </div>
    </div>
  );
}
