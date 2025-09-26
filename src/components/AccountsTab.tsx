import React, { useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { AccountList } from './AccountList';
import PlaidLinkButton from './PlaidLinkButton';
import Sheet from './Sheet';
import { ConnectChoose } from '../pages/Onboarding/steps/ConnectChoose';
import { COLORS } from '../ui/colors';

export function AccountsTab() {
  const { accounts = [], userProfile, setAccounts, clearSampleData } = useAppState();
  const [showAddAccountSheet, setShowAddAccountSheet] = useState(false);
  
  const hasAccounts = accounts.length > 0;

  return (
    <div className="accounts-tab">
      <div className="accounts-header">
        <h2>Connected Accounts</h2>
        <p style={{ color: COLORS.textMuted }}>
          Manage your linked accounts and connect new ones.
        </p>
      </div>

      <AccountList accounts={accounts} />
      
      <div className="account-actions">
        <PlaidLinkButton
          instanceId="accounts-tab"
          key={`plaid-link-accounts-${userProfile ? 'logged-in' : 'logged-out'}`}
          userId="demo-user-123"
          onSuccess={(data) => {
            console.log('Accounts linked:', data);
            
            // Clear sample data first
            clearSampleData();
            
            // Handle both accounts and transactions if provided
            if (Array.isArray(data)) {
              // Legacy format: just accounts array
              console.log('Legacy format - accounts:', data);
              setAccounts(data);
            } else if (data.accounts) {
              // New format: object with accounts and transactions
              console.log('New format - accounts:', data.accounts);
              setAccounts(data.accounts);
              if (data.transactions) {
                console.log('New format - transactions:', data.transactions);
                // Note: transactions would need to be handled by setTransactions if available
              }
            } else {
              // Fallback: treat as accounts array
              console.log('Fallback format:', data);
              setAccounts(Array.isArray(data) ? data : []);
            }
          }}
        />
        
        <button 
          className="add-account-btn"
          onClick={() => setShowAddAccountSheet(true)}
          style={{ 
            backgroundColor: 'transparent',
            color: COLORS.textMuted,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            padding: '12px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          Add accounts another way
        </button>
      </div>

      {/* Coach Note for Accounts */}
      {hasAccounts && (
        <div className="coach-note" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <p style={{ color: COLORS.text, margin: 0 }}>
            Great! You have {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected. 
            Now add goals to create your financial plan.
          </p>
        </div>
      )}

      {/* Add Account Sheet */}
      <Sheet 
        open={showAddAccountSheet} 
        onClose={() => setShowAddAccountSheet(false)} 
        title="Upload documents or enter manually"
      >
        <ConnectChoose 
          onClose={() => setShowAddAccountSheet(false)} 
          onComplete={() => { 
            setShowAddAccountSheet(false); 
          }} 
        />
      </Sheet>
    </div>
  );
}








