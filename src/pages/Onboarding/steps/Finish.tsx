import React from 'react';
import { OnboardingState } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';

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
  return (
    <div className="onboarding-step">
      <h1>You're all set!</h1>
      <p>Here's what we'll use to personalize your experience:</p>
      
      <ul>
        <li><strong>Main goals:</strong> {data.mainGoals.map(goal => goalLabels[goal]).join(', ')}</li>
        <li><strong>Top priority:</strong> {data.topPriority ? goalLabels[data.topPriority] : 'Not set'}</li>
        <li><strong>Timeline:</strong> {data.timeline ? timelineLabels[data.timeline] : 'Not set'}</li>
        <li><strong>Comfort level:</strong> {data.comfort ? comfortLabels[data.comfort] : 'Not set'}</li>
      </ul>

      <div>
        <button onClick={onBack}>Back</button>
        <button onClick={() => onFinish(data)}>Save & continue</button>
      </div>
      <p className="disclaimer">{onboardingCopy.disclaimer}</p>
    </div>
  );
}
