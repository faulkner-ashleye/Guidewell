import React from 'react';
import { COLORS } from '../ui/colors';

interface AccountRowProps {
  name: string;
  value: string;
  meta?: string;
  health?: 'ok' | 'warn' | 'alert';
  accountId?: string;
  accountType?: 'checking' | 'savings' | 'credit_card' | 'loan' | 'investment';
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div 
        style={{
          display: 'grid', 
          gridTemplateColumns: '1fr auto', 
          alignItems: 'center',
          cursor: onNavigateToAccount && accountId ? 'pointer' : 'default',
          padding: '8px',
          borderRadius: '6px',
          transition: 'background-color 0.2s ease'
        }}
        onClick={() => onNavigateToAccount && accountId && onNavigateToAccount(accountId)}
        onMouseEnter={(e) => {
          if (onNavigateToAccount && accountId) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (onNavigateToAccount && accountId) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div>
          <div style={{ color: COLORS.text }}>{badge} {name}</div>
          {meta && <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{meta}</div>}
        </div>
        <div style={{ color: COLORS.text }}>{value}</div>
      </div>
      
      {/* Goal Section - Now available for all account types */}
      {accountId && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {hasGoal ? (
            <>
              <div style={{ color: COLORS.textMuted }}>
                🎯 Linked to: <span style={{ color: getGoalButtonColor() }}>{goalName}</span>
              </div>
              <button
                onClick={() => goalId && onViewGoal?.(goalId)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: COLORS.primary,
                  cursor: 'pointer',
                  fontSize: '12px',
                  textDecoration: 'underline'
                }}
              >
                View Goal
              </button>
            </>
          ) : (
            <>
              <div style={{ color: COLORS.textMuted }}>
                {accountType === 'credit_card' ? 'No payoff goal set' :
                 accountType === 'loan' ? 'No payoff goal set' :
                 accountType === 'investment' ? 'No investment goal set' :
                 'No goal linked to this account'}
              </div>
              <button
                onClick={() => onCreateGoal?.(accountId)}
                style={{
                  background: getGoalButtonColor(),
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}
              >
                {getGoalButtonText()}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
