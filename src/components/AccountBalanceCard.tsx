import React from 'react';
import { Account } from '../data/types';
import { formatCurrency } from '../state/selectors';
import './AccountBalanceCard.css';

interface AccountBalanceCardProps {
  accounts: Account[];
}

export function AccountBalanceCard({ accounts }: AccountBalanceCardProps) {
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
    <div className="account-balance-card">
      <div className="card-header">
        <h3>Current Balances</h3>
      </div>
      
      <div className="account-types">
        {Object.entries(typeTotals).map(([type, total]) => {
          const typeInfo = getTypeInfo(type);
          const accountsOfType = groupedAccounts[type];
          
          return (
            <div key={type} className="account-type-row">
              <div className="account-type-info">
                <div className="type-label">{typeInfo.label}</div>
                <div className="account-count">
                  {accountsOfType.length === 1 
                    ? accountsOfType[0].name 
                    : `${accountsOfType.length} accounts`
                  }
                </div>
              </div>
              <div className="account-type-balance">
                {formatCurrency(total)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
