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
        <div className="empty-message" style={{ color: COLORS.textMuted }}>
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
            <h3 className="account-type-title" style={{ color: COLORS.text }}>
              {getAccountTypeLabel(type)}
            </h3>
            <div className="account-cards">
              {typeAccounts.map(account => (
                <div key={account.id} className="account-card" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
                  <div className="account-card-content">
                    <div className="account-icon">
                      {getAccountIcon(account.type)}
                    </div>
                    <div className="account-info">
                      <div className="account-name" style={{ color: COLORS.text }}>
                        {account.name}
                      </div>
                      {(account.apr || account.minPayment) && (
                        <div className="account-details" style={{ color: COLORS.textMuted }}>
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
                    <div className="account-balance" style={{ color: COLORS.text }}>
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
