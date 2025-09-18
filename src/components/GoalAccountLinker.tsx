import React, { useState } from 'react';
import { Account } from '../state/AppStateContext';
import { COLORS } from '../ui/colors';
import './GoalAccountLinker.css';

interface GoalAccountLinkerProps {
  accounts: Account[];
  currentLinkedAccountId?: string;
  onLinkAccount: (accountId: string) => void;
  onUnlinkAccount: () => void;
}

export function GoalAccountLinker({ 
  accounts, 
  currentLinkedAccountId, 
  onLinkAccount, 
  onUnlinkAccount 
}: GoalAccountLinkerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter to savings accounts or accounts with goalTarget
  const eligibleAccounts = accounts.filter(account => 
    account.type === 'savings' || 
    (account.goalTarget && account.goalTarget > 0)
  );
  
  const currentAccount = accounts.find(acc => acc.id === currentLinkedAccountId);
  
  if (eligibleAccounts.length === 0) {
    return (
      <div className="goal-linker-empty">
        <span style={{ color: COLORS.textMuted }}>
          No savings accounts available for goals
        </span>
      </div>
    );
  }
  
  return (
    <div className="goal-linker">
      <div className="goal-linker-current">
        {currentAccount ? (
          <div className="linked-account">
            <span className="account-name" style={{ color: COLORS.text }}>
              {currentAccount.name}
            </span>
            <button 
              className="unlink-btn"
              onClick={onUnlinkAccount}
              style={{ color: COLORS.textMuted }}
            >
              Unlink
            </button>
          </div>
        ) : (
          <button 
            className="link-btn"
            onClick={() => setIsOpen(true)}
            style={{ 
              color: COLORS.textMuted,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline'
            }}
          >
            Link to account
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="goal-linker-dropdown" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <div className="dropdown-header">
            <span style={{ color: COLORS.text, fontSize: '14px', fontWeight: '500' }}>
              Choose account for goal
            </span>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
              style={{ color: COLORS.textMuted }}
            >
              ×
            </button>
          </div>
          <div className="dropdown-accounts">
            {eligibleAccounts.map(account => (
              <button
                key={account.id}
                className={`account-option ${account.id === currentLinkedAccountId ? 'selected' : ''}`}
                onClick={() => {
                  onLinkAccount(account.id);
                  setIsOpen(false);
                }}
                style={{ 
                  backgroundColor: account.id === currentLinkedAccountId ? COLORS.savings : 'transparent',
                  color: COLORS.text,
                  border: `1px solid ${COLORS.border}`
                }}
              >
                <div className="account-info">
                  <span className="account-name">{account.name}</span>
                  <span className="account-balance" style={{ color: COLORS.textMuted }}>
                    ${account.balance.toLocaleString()}
                    {account.goalTarget && ` / $${account.goalTarget.toLocaleString()}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





