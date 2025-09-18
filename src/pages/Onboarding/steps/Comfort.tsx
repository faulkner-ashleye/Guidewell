import React from 'react';
import { OnboardingState, Comfort as ComfortType } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Chip } from '../components/Chip';

interface ComfortProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const comfortOptions: { value: ComfortType; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'confident', label: 'Confident' }
];

export function Comfort({ data, update, onNext, onBack, onSkip }: ComfortProps) {
  const canProceed = !!data.comfort;

  return (
    <div className="onboarding-step">
      <h1>What's your comfort level?</h1>
      <p>How comfortable are you with different types of financial strategies?</p>
      
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

      <div className="onboarding-actions">
        <div className="action-buttons">
          <button className="action-button secondary" onClick={onBack}>
            Back
          </button>
          <button className="action-button secondary" onClick={onSkip}>
            {onboardingCopy.skip}
          </button>
          <button className="action-button primary" onClick={onNext} disabled={!canProceed}>
            Next
          </button>
        </div>
      </div>
      <p className="disclaimer">{onboardingCopy.disclaimer}</p>
    </div>
  );
}
