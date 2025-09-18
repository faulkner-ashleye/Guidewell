import React from 'react';
import { Account } from '../state/AppStateContext';
import { groupAccountsByType, formatMoney, getAccountTypeLabel } from '../state/planSelectors';
import { COLORS } from '../ui/colors';
import './AccountList.css';

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const groupedAccounts = groupAccountsByType(accounts);
  const accountTypes: Account['type'][] = ['checking', 'savings', 'credit_card', 'loan', 'investment'];
  
  const getAccountIcon = (type: Account['type']): string => {
    const icons: Record<Account['type'], string> = {
      'checking': '💳',
      'savings': '💰',
      'credit_card': '💳',
      'loan': '🏦',
      'investment': '📈'
    };
    return icons[type] || '💳';
  };
  
  if (accounts.length === 0) {
    return (
      <div className="account-list-empty">
        <div className="empty-message text-gray-500">
          No accounts yet — connect one to begin.
        </div>
      </div>
    );
  }

  return (
    <div className="account-list">
      {accountTypes.map(type => {
        const typeAccounts = groupedAccounts[type] || [];
        if (typeAccounts.length === 0) return null;
        
        return (
          <div key={type} className="account-type-section">
            <h3 className="account-type-title text-gray-900">
              {getAccountTypeLabel(type)}
            </h3>
            <div className="account-cards">
              {typeAccounts.map(account => (
                <div key={account.id} className="account-card bg-white border-gray-200">
                  <div className="account-card-content">
                    <div className="account-icon">
                      {getAccountIcon(account.type)}
                    </div>
                    <div className="account-info">
                      <div className="account-name text-gray-900">
                        {account.name}
                      </div>
                      {(account.apr || account.minPayment) && (
                        <div className="account-details text-gray-500">
                          {account.apr && (
                            <span className="account-apr">
                              {account.apr}% APR
                            </span>
                          )}
                          {account.apr && account.minPayment && ' • '}
                          {account.minPayment && (
                            <span className="account-payment">
                              Min: {formatMoney(account.minPayment)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="account-balance text-gray-900">
                      {formatMoney(account.balance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
