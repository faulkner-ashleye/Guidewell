import React from 'react';
import { getGoalsFromAccounts, formatMoney } from '../state/planSelectors';
import { ProgressBar } from './ProgressBar';
import { COLORS } from '../ui/colors';

interface GoalListProps {
  accounts: any[]; // Using any[] to match Account[] from AppStateContext
}

export function GoalList({ accounts }: GoalListProps) {
  const goals = getGoalsFromAccounts(accounts);
  
  if (goals.length === 0) {
    return (
      <div className="text-center py-10 px-5">
        <div className="text-base italic text-gray-500">
          No goals yet — add one to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {goals.map(goal => (
        <div key={goal.id} className="p-4 rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              {goal.name}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {goal.progress}%
            </span>
          </div>
          <div className="text-xs mb-2 text-gray-500">
            {formatMoney(goal.current)} of {formatMoney(goal.target)}
          </div>
          <ProgressBar percent={goal.progress} color={COLORS.savings} />
        </div>
      ))}
    </div>
  );
}





