import React from 'react';
import { Account } from '../data/types';
import { formatCurrency } from '../state/selectors';
import { Icon } from './Icon';
import { Button } from './Button';
import { useAnimatedCurrency, useProgressiveReveal } from '../hooks/useAnimatedCounter';
import { AnimatedCard } from './AnimatedCharts';
import './AccountBalanceCard.css';
import '../styles/card-animations.css';

interface AccountBalanceCardProps {
  accounts: Account[];
}

export function AnimatedAccountBalanceCard({ accounts }: AccountBalanceCardProps) {
  // Group accounts by type
  const groupedAccounts = accounts.reduce((acc, account) => {
    const type = account.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  // Calculate totals by type
  const typeTotals = Object.entries(groupedAccounts).reduce((acc, [type, accounts]) => {
    acc[type] = accounts.reduce((sum, account) => sum + account.balance, 0);
    return acc;
  }, {} as Record<string, number>);

  // Progressive reveal of account types
  const visibleTypes = useProgressiveReveal(Object.entries(typeTotals), 200);

  // Get type display info
  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { label: string; icon: string; color: string }> = {
      checking: { label: 'Cash & Checking', icon: 'wallet', color: 'var(--color-primary-main)' },
      savings: { label: 'Savings', icon: 'piggy-bank', color: 'var(--color-success-main)' },
      credit_card: { label: 'Credit', icon: 'credit-card', color: 'var(--color-error-main)' },
      loan: { label: 'Loans', icon: 'file-text', color: 'var(--color-warning-main)' },
      investment: { label: 'Investments', icon: 'trending-up', color: 'var(--color-info-main)' },
      debt: { label: 'Other Banking', icon: 'minus-circle', color: 'var(--color-text-secondary)' }
    };
    return typeMap[type] || { label: type, icon: 'circle', color: 'var(--color-text-secondary)' };
  };

  return (
    <AnimatedCard delay={0} className="account-balance-card">
      <div className="card-header">
        <h3>Current Balances</h3>
      </div>
      
      <div className="account-types">
        {visibleTypes.map(([type, total], index) => {
          const typeInfo = getTypeInfo(type);
          const accountsOfType = groupedAccounts[type];
          
          return (
            <AnimatedAccountTypeRow
              key={type}
              type={type}
              total={total}
              typeInfo={typeInfo}
              accountsOfType={accountsOfType}
              delay={index * 100}
            />
          );
        })}
      </div>
      
      <div className="card-footer">
        <Button
          variant="text"
          color="secondary"
          size="medium"
          fullWidth={true}
          onClick={() => window.location.href = '/plan'}
        >
          View Financial Plan
          <Icon name="arrow_forward" size="sm" style={{ marginLeft: '4px' }} />
        </Button>
      </div>
    </AnimatedCard>
  );
}

interface AnimatedAccountTypeRowProps {
  type: string;
  total: number;
  typeInfo: { label: string; icon: string; color: string };
  accountsOfType: Account[];
  delay: number;
}

function AnimatedAccountTypeRow({ 
  type, 
  total, 
  typeInfo, 
  accountsOfType, 
  delay 
}: AnimatedAccountTypeRowProps) {
  const animatedTotal = useAnimatedCurrency(total, 1200);
  
  return (
    <div 
      className="account-type-row"
      style={{
        opacity: 0,
        transform: 'translateX(-20px)',
        animation: `slideInLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms forwards`
      }}
    >
      <div className="account-type-info">
        <div className="type-label">{typeInfo.label}</div>
        <div className="account-count">
          {accountsOfType.length === 1 
            ? accountsOfType[0].name 
            : `${accountsOfType.length} accounts`
          }
        </div>
      </div>
      <div 
        className="account-type-balance"
        style={{ color: typeInfo.color }}
      >
        {animatedTotal}
      </div>
    </div>
  );
}

// Export both versions for backward compatibility
export { AccountBalanceCard } from './AccountBalanceCard';

