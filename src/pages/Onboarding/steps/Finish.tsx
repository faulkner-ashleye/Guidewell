import React from 'react';
import { OnboardingState } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { useAppState } from '../../../state/AppStateContext';
import '../../../components/Button.css';

interface FinishProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onFinish: (data: OnboardingState) => void;
  onBack: () => void;
}

const goalLabels: Record<string, string> = {
  'pay_down_debt': 'Pay down debt',
  'save_big_goal': 'Save for a big goal',
  'build_emergency': 'Build an emergency fund',
  'start_investing': 'Start investing'
};

const timelineLabels: Record<string, string> = {
  'short': 'Short (1–2 years)',
  'mid': 'Mid (3–5 years)',
  'long': 'Long (5+ years)'
};

const comfortLabels: Record<string, string> = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'confident': 'Confident'
};

export function Finish({ data, update, onFinish, onBack }: FinishProps) {
  const { currentScenario } = useAppState();

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content final">
        <div className="onboarding-step">
          <h1>You're all set!</h1>
          <p>Here's what we'll use to personalize your experience:</p>

          <ul>
            <li><strong>Main goals:</strong> {data.mainGoals.map(goal => goalLabels[goal]).join(', ')}</li>
            <li><strong>Top priority:</strong> {data.topPriority ? goalLabels[data.topPriority] : 'Not set'}</li>
            <li><strong>Timeline:</strong> {data.timeline ? timelineLabels[data.timeline] : 'Not set'}</li>
            <li><strong>Comfort level:</strong> {data.comfort ? comfortLabels[data.comfort] : 'Not set'}</li>
          </ul>

          {currentScenario && (
            <p className="typography-caption">
              You've chosen to explore with <strong>{currentScenario.userProfile.firstName}</strong> to start. When you start adding your own data, this {currentScenario.userProfile.firstName}'s data will be cleared and replaced with your own.
            </p>
          )}


        </div>
      </div>
      <div className="onboarding-actions">
        <div className="action-buttons">
        <Button
          variant={ButtonVariants.contained}
          color={ButtonColors.secondary}
          onClick={() => onFinish(data)}
        >
          Create account
        </Button>
        <Button
          variant={ButtonVariants.outline}
          color={ButtonColors.secondary}
          onClick={onBack}
        >
          Back
        </Button>
      </div>
      </div>
    </div>
  );
}
