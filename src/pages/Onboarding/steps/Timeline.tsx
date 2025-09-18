import React from 'react';
import { OnboardingState, Timeline as TimelineType } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Chip } from '../components/Chip';

interface TimelineProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const timelineOptions: { value: TimelineType; label: string }[] = [
  { value: 'short', label: 'Short (1–2 years)' },
  { value: 'mid', label: 'Mid (3–5 years)' },
  { value: 'long', label: 'Long (5+ years)' }
];

export function Timeline({ data, update, onNext, onBack, onSkip }: TimelineProps) {
  const canProceed = !!data.timeline;

  return (
    <div className="onboarding-step">
      <h1>What's your timeline?</h1>
      <p>How long are you planning to work on these goals?</p>
      
      <div className="chip-container">
        {timelineOptions.map(option => (
          <Chip
            key={option.value}
            label={option.label}
            selected={data.timeline === option.value}
            onClick={() => update('timeline', option.value)}
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
