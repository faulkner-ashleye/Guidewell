import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoalsFromAccounts, formatMoney } from '../state/planSelectors';
import { ProgressBar } from './ProgressBar';
import { COLORS } from '../ui/colors';
import { Goal } from '../app/types';
import { Account } from '../state/AppStateContext';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Icon, IconNames } from './Icon';
import './GoalList.css';

interface GoalListProps {
  accounts: Account[];
  goals?: Goal[]; // Optional goals from app state
}

const getGoalType = (goalName: string) => {
  const name = goalName.toLowerCase();

  // Credit card and debt goals
  if (name.includes('credit card') || name.includes('card') || name.includes('debt') || name.includes('payoff') || name.includes('loan') || name.includes('student')) {
    return 'debt';
  }

  // Emergency fund goals
  if (name.includes('emergency')) {
    return 'emergency';
  }

  // Investment and retirement goals
  if (name.includes('investment') || name.includes('retirement') || name.includes('401k') || name.includes('roth')) {
    return 'investment';
  }

  // Savings goals
  if (name.includes('savings') || name.includes('save')) {
    return 'savings';
  }

  // Trip and travel goals
  if (name.includes('trip') || name.includes('vacation') || name.includes('travel')) {
    return 'trip';
  }

  // Home and house goals
  if (name.includes('house') || name.includes('home') || name.includes('renovation') || name.includes('down payment')) {
    return 'home';
  }

  // Car and vehicle goals
  if (name.includes('car') || name.includes('vehicle') || name.includes('auto')) {
    return 'car';
  }

  // Wedding goals
  if (name.includes('wedding')) {
    return 'wedding';
  }

  // Education goals
  if (name.includes('education') || name.includes('school') || name.includes('college')) {
    return 'education';
  }

  // Default savings goal
  return 'savings';
};

const getGoalIcon = (goalName: string) => {
  const goalType = getGoalType(goalName);

  switch (goalType) {
    case 'debt':
      return IconNames.credit_card;
    case 'emergency':
      return IconNames.security;
    case 'investment':
      return IconNames.trending_up;
    case 'savings':
      return IconNames.savings;
    case 'trip':
      return IconNames.schedule;
    case 'home':
      return IconNames.home;
    case 'car':
      return IconNames.directions_car;
    case 'wedding':
      return IconNames.favorite;
    case 'education':
      return IconNames.school;
    default:
      return IconNames.attach_money;
  }
};

const getGoalColor = (goalName: string) => {
  const name = goalName.toLowerCase();
  if (name.includes('trip') || name.includes('vacation') || name.includes('travel')) {
    return '#10B981'; // Green for trips
  }
  if (name.includes('house') || name.includes('home') || name.includes('renovation')) {
    return '#3B82F6'; // Blue for home
  }
  if (name.includes('emergency')) {
    return '#8B5CF6'; // Purple for emergency
  }
  return '#10B981'; // Default green
};

export function GoalList({ accounts, goals: appGoals }: GoalListProps) {
  const navigate = useNavigate();

  // Get goals from accounts (legacy method)
  const accountGoals = getGoalsFromAccounts(accounts).map(goal => ({
    ...goal,
    accountId: undefined,
    accountIds: undefined,
    targetDate: undefined,
    type: 'savings' as const
  }));

  // Add debt goals for accounts without goalTarget and without app goals
  const debtGoals = accounts
    .filter(account =>
      (account.type === 'credit_card' || account.type === 'loan' || account.type === 'debt') &&
      account.balance > 0 &&
      !accountGoals.find(goal => goal.id === account.id) &&
      !appGoals?.find(goal => goal.accountId === account.id)
    )
    .map(account => {
      // For debt goals: target = original debt amount, current = remaining balance
      // If no payments made yet, original amount = current balance
      const originalAmount = account.goalTarget || account.balance;

      return {
        id: account.id,
        name: account.name,
        current: account.balance, // Current remaining balance
        target: originalAmount, // Original debt amount
        progress: originalAmount > 0 ? Math.round(((originalAmount - account.balance) / originalAmount) * 100) : 0,
        accountId: account.id,
        accountIds: undefined,
        targetDate: undefined,
        type: 'debt' as const
      };
    });

  // Convert app goals to display format
  const convertedAppGoals = appGoals?.map(goal => {
    // Calculate current amount from linked account(s)
    let current = 0;
    let target = goal.target;

    if (goal.accountId) {
      const account = accounts.find(a => a.id === goal.accountId);
      if (account) {
        current = account.balance;

        // For debt goals with target: 0, use account balance as original amount
        if (goal.type === 'debt' || goal.type === 'debt_payoff') {
          if (goal.target === 0) {
            target = account.balance; // Original debt amount
          }
        }
      }
    } else if (goal.accountIds && goal.accountIds.length > 0) {
      current = goal.accountIds.reduce((sum, accountId) => {
        const account = accounts.find(a => a.id === accountId);
        return sum + (account ? account.balance : 0);
      }, 0);
    }

    // For debt goals, calculate progress as amount paid off
    let progress = 0;
    if (goal.type === 'debt' || goal.type === 'debt_payoff') {
      progress = target > 0 ? Math.min(100, Math.round(((target - current) / target) * 100)) : 0;
    } else {
      progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    }

    return {
      id: goal.id,
      name: goal.name,
      current,
      target,
      progress,
      accountId: goal.accountId,
      accountIds: goal.accountIds,
      targetDate: goal.targetDate,
      type: goal.type
    };
  }) || [];

  // Combine all types of goals
  const allGoals = [...convertedAppGoals, ...accountGoals, ...debtGoals];

  if (allGoals.length === 0) {
    return (
      <div className="text-center py-10 px-5">
        <div className="text-base italic text-gray-500">
          No goals yet — add one to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      {allGoals.map(goal => {
        const goalType = getGoalType(goal.name);
        const goalColor = getGoalColor(goal.name);
        const remaining = Math.max(0, goal.target - goal.current);
        const spent = 0; // We don't track spent amounts yet, but could add this

        // Debug logging for debt goals
        if (goalType === 'debt') {
          console.log('Debt goal debug:', {
            name: goal.name,
            target: goal.target,
            current: goal.current,
            progress: goal.progress,
            goalObject: goal
          });
        }

        // Get context-specific text based on goal type
        const getGoalContext = (type: string, current: number, target: number, remaining: number) => {
          switch (type) {
            case 'debt':
              // For debt goals: current = remaining balance, target = original debt amount
              const paidOff = Math.max(0, target - current);
              return {
                progressText: `${formatMoney(paidOff)} paid off`,
                availableText: `Paid off ${formatMoney(paidOff)}`,
                spentText: `Still owe ${formatMoney(current)}`,
                leftText: `Left to pay ${formatMoney(current)}`,
                goalText: `Original debt ${formatMoney(target)}`
              };
            case 'emergency':
              return {
                progressText: `${formatMoney(current)} saved`,
                availableText: `Available ${formatMoney(current)}`,
                spentText: `Spent ${formatMoney(spent)}`,
                leftText: `Left to save ${formatMoney(remaining)}`,
                goalText: `Goal ${formatMoney(target)}`
              };
            case 'investment':
              return {
                progressText: `${formatMoney(current)} invested`,
                availableText: `Invested ${formatMoney(current)}`,
                spentText: `Spent ${formatMoney(spent)}`,
                leftText: `Left to invest ${formatMoney(remaining)}`,
                goalText: `Target ${formatMoney(target)}`
              };
            default: // savings, trip, home, car, wedding, education
              return {
                progressText: `${formatMoney(current)} saved`,
                availableText: `Available ${formatMoney(current)}`,
                spentText: `Spent ${formatMoney(spent)}`,
                leftText: `Left to save ${formatMoney(remaining)}`,
                goalText: `Goal ${formatMoney(target)}`
              };
          }
        };

        const context = getGoalContext(goalType, goal.current, goal.target, remaining);


        return (
          <div key={goal.id} className="card goal">
            {/* Header with icon and name */}
            <div className="card-header goal">
              <Icon
                name={getGoalIcon(goal.name)}
                size="xl"
              />
              <span className="chart-name text-base">
                {goal.name}
              </span>
            </div>

            <div className="card-content">
            {/* Account and Target Date Info */}
            {(goal.accountId || goal.accountIds || goal.targetDate) && (
              <div className="goal-meta mb-md">
                {goal.accountId && (
                  <div className="meta-item">
                    <span className="meta-label">Account:</span>
                    <span className="meta-value">
                      {accounts.find(a => a.id === goal.accountId)?.name || 'Unknown Account'}
                    </span>
                  </div>
                )}
                {goal.accountIds && goal.accountIds.length > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">Accounts:</span>
                    <span className="meta-value">
                      {goal.accountIds.map(accountId => 
                        accounts.find(a => a.id === accountId)?.name || 'Unknown Account'
                      ).join(', ')}
                    </span>
                  </div>
                )}
                {goal.targetDate && (
                  <div className="meta-item">
                    <span className="meta-label">Target Date:</span>
                    <span className="meta-value">
                      {new Date(goal.targetDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Progress visualization */}
            <div className="mb-md card-chart">
              <ProgressBar
                target={goal.target || 0}
                current={goal.current || 0}
                goalType={goalType as 'debt' | 'savings' | 'investment' | 'emergency' | 'other'}
              />
            </div>

            {/* Goal Summary */}
            <div className="goal-summary">
              {goalType === 'debt' ? (
                <>
                  <div className="summary-row">
                    <span className="summary-label">Original:</span>
                    <span className="summary-value">{formatMoney(goal.target)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Progress:</span>
                    <span className="summary-value">{formatMoney(Math.max(0, goal.target - goal.current))}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Remaining:</span>
                    <span className="summary-value">{formatMoney(goal.current)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="summary-row">
                    <span className="summary-label">Target:</span>
                    <span className="summary-value">{formatMoney(goal.target)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Progress:</span>
                    <span className="summary-value">{formatMoney(goal.current)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Remaining:</span>
                    <span className="summary-value">{formatMoney(Math.max(0, goal.target - goal.current))}</span>
                  </div>
                </>
              )}
            </div>
            </div>
            <div className="card-footer">
                {/* Action button for incomplete goals */}
                {goal.progress < 100 && (
                  <Button
                    variant={ButtonVariants.text}
                    color={ButtonColors.secondary}
                    fullWidth={true}
                    onClick={() => navigate(`/goals/${goal.id}`)}
                  >
                    Review goal
                  </Button>
                )}
          </div>

      </div>
        );
      })}
    </div>
  );
}
