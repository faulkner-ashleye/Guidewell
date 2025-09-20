import React from 'react';
import { OnboardingState, MainGoal } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Account } from '../../../state/AppStateContext';
import { inferGoalsFromAccounts } from '../../../state/selectors';
import { Chip } from '../components/Chip';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

interface GoalsProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onSkip: () => void;
  accounts: Account[];
}

const goalOptions: { value: MainGoal; label: string }[] = [
  { value: 'pay_down_debt', label: 'Pay down debt' },
  { value: 'save_big_goal', label: 'Save for a big goal' },
  { value: 'build_emergency', label: 'Build an emergency fund' },
  { value: 'start_investing', label: 'Start investing' }
];

export function Goals({ data, update, onNext, onSkip, accounts }: GoalsProps) {
  // Component for selecting financial goals
  const handleGoalToggle = (goal: MainGoal) => {
    const currentGoals = data.mainGoals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    update('mainGoals', newGoals);

    // Clear topPriority if it's no longer in mainGoals
    if (data.topPriority && !newGoals.includes(data.topPriority)) {
      update('topPriority', undefined);
    }
  };

  const canProceed = data.mainGoals.length > 0;

  // Check if we should show the hint
  const inferredGoals = inferGoalsFromAccounts(accounts);
  const shouldShowHint = data.mainGoals.length === 0 && inferredGoals.length > 0;

  const handleAutoSelect = () => {
    update('mainGoals', inferredGoals as MainGoal[]);
  };

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">What do you want to work towards?</h1>
          <p>Select all that apply:</p>

          {shouldShowHint && (
            <div className="hint-box">
              <p>We noticed you have {inferredGoals.includes('pay_down_debt') ? 'debt' : ''}{inferredGoals.includes('pay_down_debt') && inferredGoals.includes('save_big_goal') ? ' and ' : ''}{inferredGoals.includes('save_big_goal') ? 'savings' : ''}—want to include these goals?</p>
              <Button
                variant={ButtonVariants.text}
                color={ButtonColors.secondary}
                onClick={handleAutoSelect}
              >
                Auto-select based on my accounts
              </Button>
            </div>
          )}

          <div className="chip-container">
            {goalOptions.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                selected={data.mainGoals.includes(option.value)}
                onClick={() => handleGoalToggle(option.value)}
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
