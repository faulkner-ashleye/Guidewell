import React from 'react';
import { OnboardingState, MainGoal } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Chip } from '../components/Chip';

interface PriorityProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const goalOptions: { value: MainGoal; label: string }[] = [
  { value: 'pay_down_debt', label: 'Pay down debt' },
  { value: 'save_big_goal', label: 'Save for a big goal' },
  { value: 'build_emergency', label: 'Build an emergency fund' },
  { value: 'start_investing', label: 'Start investing' }
];

export function Priority({ data, update, onNext, onBack, onSkip }: PriorityProps) {
  const canProceed = data.topPriority !== undefined;

  return (
    <div className="onboarding-step">
      <h1>Which is your top priority?</h1>
      <p>We'll focus on this goal first, but you can always adjust your strategy later.</p>
      
      <div className="chip-container">
        {data.mainGoals.map(goal => (
          <Chip
            key={goal}
            label={goalOptions.find(opt => opt.value === goal)?.label || goal}
            selected={data.topPriority === goal}
            onClick={() => update('topPriority', goal)}
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
