import React from 'react';
import { OnboardingState, Timeline as TimelineType } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Chip } from '../components/Chip';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

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
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">How far out do you see yourself reaching this goal?</h1>
          <p className="typography-body1">Set a timeframe now — it’s a guide, not a deadline.</p>

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
      </div>
    </div>
  );
}
