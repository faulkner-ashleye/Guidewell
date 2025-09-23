import React, { useState, useEffect } from 'react';
import { COLORS } from '../ui/colors';
import { Button, ButtonVariants, ButtonColors, ButtonSizes } from './Button';
import { Icon, IconNames } from './Icon';
import { InstitutionLogoService } from '../services/institutionLogoService';
import './Button.css';
import './AccountRow.css';

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
  institutionId?: string;
  institutionName?: string;
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
  institutionId,
  institutionName,
  onCreateGoal,
  onViewGoal,
  onNavigateToAccount
}: AccountRowProps) {
  const badge = health === 'ok' ? '✅' : health === 'warn' ? '⚠️' : '❗';
  const canHaveGoal = true; // All account types can now have goals

  // State for institution logo
  const [institutionLogo, setInstitutionLogo] = useState<string | null>(null);
  const [fallbackIcon, setFallbackIcon] = useState<string>(IconNames.account_balance_wallet);
  const [logoLoading, setLogoLoading] = useState(false);

  // Load institution logo on mount
  useEffect(() => {
    const loadLogo = async () => {
      if (institutionId || institutionName) {
        setLogoLoading(true);
        try {
          const result = await InstitutionLogoService.getInstitutionLogo(
            institutionId,
            institutionName,
            accountType
          );
          setInstitutionLogo(result.logo || null);
          setFallbackIcon(result.fallbackIcon);
        } catch (error) {
          console.warn('Failed to load institution logo:', error);
          setInstitutionLogo(null);
          setFallbackIcon(getAccountIcon(accountType));
        } finally {
          setLogoLoading(false);
        }
      } else {
        setFallbackIcon(getAccountIcon(accountType));
      }
    };

    loadLogo();
  }, [institutionId, institutionName, accountType]);

  const getAccountIcon = (type: AccountRowProps['accountType']): string => {
    const icons: Record<NonNullable<AccountRowProps['accountType']>, string> = {
      'checking': IconNames.account_balance_wallet,
      'savings': IconNames.savings,
      'credit_card': IconNames.credit_card,
      'loan': IconNames.account_balance,
      'investment': IconNames.trending_up,
      'debt': IconNames.account_balance
    };
    return icons[type || 'checking'] || IconNames.account_balance_wallet;
  };
  
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
    <div className="account-row-container">
      <div 
        className={`account-row-card ${onNavigateToAccount && accountId ? 'account-row-clickable' : ''}`}
        onClick={() => onNavigateToAccount && accountId && onNavigateToAccount(accountId)}
      >
        <div className="account-row-content">
          {/* Institution Logo or Fallback Icon */}
          <div className="account-row-icon">
            {logoLoading ? (
              <div className="account-row-logo-loading">
                <Icon name={IconNames.refresh} size="sm" />
              </div>
            ) : institutionLogo ? (
              <img 
                src={institutionLogo} 
                alt={`${institutionName || name} logo`}
                className="account-row-bank-logo"
                onError={() => {
                  // Fallback to icon if image fails to load
                  setInstitutionLogo(null);
                }}
              />
            ) : (
              <Icon name={fallbackIcon} size="sm" />
            )}
          </div>

          {/* Account Info */}
          <div className="account-row-info">
            <div className="account-row-name">
              {name}
            </div>
          </div>

          {/* Balance */}
          <div className="account-row-balance">
            <div className="account-row-balance-amount">
              {value}
            </div>
            {meta && (
              <div className="account-row-balance-meta">
                {meta}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Goal Section - Now available for all account types */}
      {accountId && (
        <div className="account-row-goal-section">
          {hasGoal ? (
            <>
              <div className="account-row-goal-info">
                🎯 Linked to: <span className="account-row-goal-name">{goalName}</span>
              </div>
              <button
                onClick={() => goalId && onViewGoal?.(goalId)}
                className="account-row-goal-button"
              >
                View Goal
              </button>
            </>
          ) : (
            <>
              <div className="account-row-goal-info">
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
                <Icon name={IconNames.add} size="md" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
