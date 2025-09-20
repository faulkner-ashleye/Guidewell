import React from 'react';
import { COLORS } from '../ui/colors';
import { Button, ButtonVariants, ButtonColors, ButtonSizes } from './Button';
import { Icon, IconNames } from './Icon';
import './Button.css';

interface AccountRowProps {
  name: string;
  value: string;
  meta?: string;
  health?: 'ok' | 'warn' | 'alert';
  accountId?: string;
  accountType?: 'checking' | 'savings' | 'credit_card' | 'loan' | 'investment' | 'debt';
  hasGoal?: boolean;
  goalName?: string;
  goalId?: string;
  onCreateGoal?: (accountId: string) => void;
  onViewGoal?: (goalId: string) => void;
  onNavigateToAccount?: (accountId: string) => void;
}

export function AccountRow({ 
  name, 
  value, 
  meta, 
  health = 'ok',
  accountId,
  accountType,
  hasGoal = false,
  goalName,
  goalId,
  onCreateGoal,
  onViewGoal,
  onNavigateToAccount
}: AccountRowProps) {
  const badge = health === 'ok' ? '✅' : health === 'warn' ? '⚠️' : '❗';
  const canHaveGoal = true; // All account types can now have goals
  
  const getGoalButtonText = () => {
    switch (accountType) {
      case 'savings':
        return 'Create Savings Goal';
      case 'checking':
        return 'Create Emergency Fund';
      case 'credit_card':
        return 'Create Payoff Goal';
      case 'loan':
        return 'Create Payoff Goal';
      case 'investment':
        return 'Create Investment Goal';
      default:
        return 'Create Goal';
    }
  };

  const getGoalButtonColor = () => {
    switch (accountType) {
      case 'savings':
      case 'checking':
        return COLORS.savings;
      case 'credit_card':
      case 'loan':
        return COLORS.debt;
      case 'investment':
        return COLORS.investing;
      default:
        return COLORS.primary;
    }
  };
  
  return (
    <div className="flex flex-col gap-xs">
      <div 
        className={`grid grid-cols-[1fr_auto] items-center p-xs rounded-md transition-colors ${
          onNavigateToAccount && accountId ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
        }`}
        onClick={() => onNavigateToAccount && accountId && onNavigateToAccount(accountId)}
      >
        <div>
          <div className="text-gray-900">{badge} {name}</div>
          {meta && <div className="text-gray-500 text-xs">{meta}</div>}
        </div>
        <div className="text-gray-900">{value}</div>
      </div>
      
      {/* Goal Section - Now available for all account types */}
      {accountId && (
        <div className="flex justify-between items-center px-sm py-xs bg-gray-50 border border-gray-200 rounded-md text-xs">
          {hasGoal ? (
            <>
              <div className="text-gray-500">
                🎯 Linked to: <span className="text-blue-600">{goalName}</span>
              </div>
              <button
                onClick={() => goalId && onViewGoal?.(goalId)}
                className="bg-transparent border-none text-blue-600 cursor-pointer text-xs underline hover:text-blue-700"
              >
                View Goal
              </button>
            </>
          ) : (
            <>
              <div className="text-gray-500">
                {accountType === 'credit_card' ? 'No payoff goal set' :
                 accountType === 'loan' ? 'No payoff goal set' :
                 accountType === 'investment' ? 'No investment goal set' :
                 'No goal linked to this account'}
              </div>
              <Button
                variant={ButtonVariants.text}
                color={ButtonColors.secondary}
                size={ButtonSizes.small}
                onClick={() => onCreateGoal?.(accountId)}
              >
                Set Goal
                <Icon name={IconNames.add} size="lg" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
