import React from 'react';
import { Account } from '../state/AppStateContext';
import { groupAccountsByType, formatMoney, getAccountTypeLabel } from '../state/planSelectors';
import { COLORS } from '../ui/colors';
import { Icon, IconNames } from './Icon';
import './AccountList.css';

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  console.log('AccountList rendering with accounts:', accounts);
  const groupedAccounts = groupAccountsByType(accounts);
  const accountTypes: Account['type'][] = ['checking', 'savings', 'credit_card', 'loan', 'investment', 'debt'];
  
  const getBankLogo = (accountName: string): string | null => {
    const name = accountName.toLowerCase();
    console.log('Checking bank logo for:', accountName, 'lowercase:', name);
    if (name.includes('chase')) {
      console.log('Found Chase logo');
      return '/images/chase_logo.jpeg';
    }
    if (name.includes('sofi')) {
      console.log('Found SoFi logo');
      return '/images/sofi_logo.jpeg';
    }
    if (name.includes('associated')) {
      console.log('Found Associated Bank logo');
      return '/images/associatedBank_logomark.svg';
    }
    console.log('No bank logo found');
    return null;
  };

  const getAccountIcon = (type: Account['type']): string => {
    const icons: Record<Account['type'], string> = {
      'checking': IconNames.account_balance_wallet,
      'savings': IconNames.savings,
      'credit_card': IconNames.credit_card,
      'loan': IconNames.account_balance,
      'investment': IconNames.trending_up,
      'debt': IconNames.account_balance
    };
    return icons[type] || IconNames.account_balance_wallet;
  };
  
  if (accounts.length === 0) {
    return (
      <div className="accounts-empty-state">
        <div className="empty-message">
          No accounts yet — connect one to begin.
        </div>
      </div>
    );
  }

  return (
    <div className="accounts-container">
      {accountTypes.map(type => {
        const typeAccounts = groupedAccounts[type] || [];
        if (typeAccounts.length === 0) return null;
        
        return (
          <div key={type} className="account-type-section">
            <h3 className="account-type-title">
              {getAccountTypeLabel(type)}
            </h3>
            <div className="account-cards-container">
              {typeAccounts.map(account => {
                const bankLogo = getBankLogo(account.name);
                return (
                  <div key={account.id} className="account-card">
                    <div className="account-card-content">
                      {/* Bank Logo */}
                      <div className="account-icon">
                        {bankLogo ? (
                          <img 
                            src={bankLogo} 
                            alt={`${account.name} logo`}
                            className="bank-logo"
                          />
                        ) : (
                          <Icon name={getAccountIcon(account.type)} size="sm" />
                        )}
                      </div>

                      {/* Account Info */}
                      <div className="account-info">
                        <div className="account-name">
                          {account.name}
                        </div>
                        <div className="account-type">
                          {getAccountTypeLabel(account.type)}
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="account-balance">
                        <div className="balance-amount">
                          {formatMoney(account.balance)}
                        </div>
                        <div className="balance-meta">
                          {account.apr && (
                            <span className="apr-info">
                              {account.apr}% APR
                            </span>
                          )}
                          {account.minPayment && (
                            <span className="min-payment-info">
                              Min: {formatMoney(account.minPayment)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
