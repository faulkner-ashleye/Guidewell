import React, { useState, useEffect } from 'react';
import { COLORS } from '../ui/colors';
import { Button, ButtonVariants, ButtonColors, ButtonSizes } from './Button';
import { Icon, IconNames } from './Icon';
import { InstitutionLogoService } from '../services/institutionLogoService';
import { AccountType } from '../app/types';
import './Button.css';
import './AccountRow.css';

interface AccountRowProps {
  name: string;
  value: string;
  meta?: string;
  health?: 'ok' | 'warn' | 'alert';
  accountId?: string;
  accountType?: AccountType;
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
    if (!type) return IconNames.account_balance_wallet;
    
    // Map account types to icons with fallbacks for new types
    switch (type) {
      // Depository accounts
      case 'checking':
      case 'cash_management':
        return IconNames.account_balance_wallet;
      case 'savings':
      case 'money_market':
      case 'hsa':
        return IconNames.savings;
      case 'cd':
      case 'gic':
        return IconNames.schedule; // Clock icon for time-based accounts
      case 'prepaid':
        return IconNames.payment;
      
      // Credit accounts
      case 'credit_card':
        return IconNames.credit_card;
      case 'line_of_credit':
      case 'overdraft':
        return IconNames.account_balance;
      
      // Investment accounts
      case '401a':
      case '401k':
      case '403b':
      case '457b':
      case 'roth_401k':
        return IconNames.account_balance; // Work-related retirement
      case 'ira':
      case 'roth_ira':
      case 'sep_ira':
      case 'simple_ira':
      case 'sipp':
        return IconNames.account_balance_wallet; // Personal retirement
      case '529':
      case 'esa':
        return IconNames.school; // Education
      case 'brokerage':
      case 'stock_plan':
        return IconNames.trending_up;
      case 'pension':
      case 'profit_sharing':
        return IconNames.account_balance;
      case 'tsp':
        return IconNames.account_balance;
      case 'tfsa':
      case 'isa':
        return IconNames.savings;
      case 'custodial':
        return IconNames.person; // Use person icon for custodial accounts
      case 'variable_annuity':
        return IconNames.trending_up;
      case 'investment':
        return IconNames.trending_up;
      
      // Loan accounts
      case 'auto':
        return IconNames.directions_car;
      case 'student':
        return IconNames.school;
      case 'mortgage':
      case 'home_equity':
        return IconNames.home;
      case 'commercial':
      case 'construction':
      case 'consumer':
        return IconNames.account_balance;
      case 'loan':
        return IconNames.account_balance;
      case 'debt':
        return IconNames.account_balance;
      
      default:
        return IconNames.account_balance_wallet;
    }
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
                Linked to: <span className="account-row-goal-name">{goalName}</span>
              </div>
              <Button
                variant={ButtonVariants.text}
                color={ButtonColors.secondary}
                size={ButtonSizes.small}
                onClick={() => goalId && onViewGoal?.(goalId)}
              >
                View Goal
              </Button>
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
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
