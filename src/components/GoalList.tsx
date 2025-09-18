import React from 'react';
import { getGoalsFromAccounts, formatMoney } from '../state/planSelectors';
import { ProgressBar } from './ProgressBar';
import { COLORS } from '../ui/colors';
import './GoalList.css';

interface GoalListProps {
  accounts: any[]; // Using any[] to match Account[] from AppStateContext
}

export function GoalList({ accounts }: GoalListProps) {
  const goals = getGoalsFromAccounts(accounts);
  
  if (goals.length === 0) {
    return (
      <div className="goal-list-empty">
        <div className="empty-message text-gray-500">
          No goals yet — add one to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="goal-list">
      {goals.map(goal => (
        <div key={goal.id} className="goal-card bg-white border-gray-200">
          <div className="goal-card-header">
            <span className="goal-name text-gray-900">
              {goal.name}
            </span>
            <span className="goal-progress-text text-gray-900">
              {goal.progress}%
            </span>
          </div>
          <div className="goal-amounts text-gray-500">
            {formatMoney(goal.current)} of {formatMoney(goal.target)}
          </div>
          <ProgressBar percent={goal.progress} color={COLORS.savings} />
        </div>
      ))}
    </div>
  );
}





