import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../state/planSelectors';
import { ProgressBar } from './ProgressBar';
import { COLORS } from '../ui/colors';
import { Account } from '../state/AppStateContext';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Icon, IconNames, IconName } from './Icon';
import './GoalCard.css';

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    current: number;
    target: number;
    progress: number;
    accountId?: string;
    accountIds?: string[];
    targetDate?: string;
    type?: string;
  };
  accounts: Account[];
  showActionButton?: boolean;
  showLogButton?: boolean;
  showHeader?: boolean;
  isLinkedAccount?: boolean;
  onLogContribution?: () => void;
  className?: string;
}

export function GoalCard({ goal, accounts, showActionButton = true, showLogButton = false, showHeader = true, isLinkedAccount = false, onLogContribution, className = '' }: GoalCardProps) {
  const navigate = useNavigate();

  // Determine goal type for styling and labels
  const getGoalType = (goalName: string, goalType?: string): 'debt' | 'savings' | 'investment' | 'emergency' | 'other' => {
    const name = goalName.toLowerCase();
    const type = goalType?.toLowerCase() || '';

    if (name.includes('debt') || name.includes('loan') || name.includes('credit') || name.includes('student') || type.includes('debt')) {
      return 'debt';
    }
    if (name.includes('emergency') || type.includes('emergency')) {
      return 'emergency';
    }
    if (name.includes('investment') || name.includes('retirement') || type.includes('investment')) {
      return 'investment';
    }
    return 'savings';
  };

  const goalType = getGoalType(goal.name, goal.type);
  const remaining = Math.max(0, goal.target - goal.current);

  // Get goal icon
  const getGoalIcon = (goalName: string): IconName => {
    const name = goalName.toLowerCase();
    if (name.includes('debt') || name.includes('loan') || name.includes('credit')) return IconNames.credit_card;
    if (name.includes('emergency')) return IconNames.security;
    if (name.includes('investment') || name.includes('retirement')) return IconNames.trending_up;
    if (name.includes('house') || name.includes('home')) return IconNames.home;
    if (name.includes('car') || name.includes('vehicle')) return IconNames.directions_car;
    if (name.includes('wedding')) return IconNames.favorite;
    if (name.includes('education') || name.includes('school')) return IconNames.school;
    return IconNames.savings;
  };

  const handleActionClick = () => {
    if (goalType === 'debt') {
      // Navigate to debt payoff strategy or account detail
      navigate(`/accounts/${goal.accountId}`);
    } else {
      // Navigate to savings strategy or account detail
      navigate(`/accounts/${goal.accountId}`);
    }
  };

  return (
    <div className={`card goal goal-card shadow-sm ${className}`}>
      {/* Header with icon and name */}
      {showHeader && (
        <div className="goal-card--page-header">
          <span className="goal-card-name">
            {goal.name}
          </span>
        </div>
      )}

      {/* Summary Header */}
      <div className="card-header">
        <h4 className="summary-title">Summary</h4>
      </div>

      <div className="goal-card-content">


        {/* Account and Target Date Info */}
        {(goal.accountId || goal.accountIds || goal.targetDate) && (
          <div className="goal-meta">
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
        <div className="goal-chart">
          <ProgressBar
            target={goal.target || 0}
            current={goal.current || 0}
            goalType={goalType}
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

        {/* Action button for incomplete goals */}
        {showActionButton && goal.progress < 100 && (
          <div className="goal-card-action">
            <Button
              variant={ButtonVariants.text}
              color={ButtonColors.secondary}
              onClick={handleActionClick}
              className="goal-action-button"
            >
              {goalType === 'debt' ? 'Start paying down' : 'Start saving now'}
            </Button>
          </div>
        )}
      </div>

      {/* Card Footer with Log Button */}
      {showLogButton && onLogContribution && !isLinkedAccount && (
        <div className="card-footer">
          <Button
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            onClick={onLogContribution}
            fullWidth={true}
          >
            Log Contribution
          </Button>
        </div>
      )}
    </div>
  );
}
