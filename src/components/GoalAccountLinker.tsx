import React, { useState } from 'react';
import { Account } from '../state/AppStateContext';
import { COLORS } from '../ui/colors';
import { Button, ButtonVariants, ButtonColors, ButtonSizes } from './Button';
import { Icon, IconNames } from './Icon';
import './Button.css';

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
      <div className="mt-2 text-xs text-center py-2">
        <span style={{ color: COLORS.textMuted }}>
          No savings accounts available for goals
        </span>
      </div>
    );
  }
  
  return (
    <div className="relative mt-2">
      <div className="flex items-center justify-between">
        {currentAccount ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-medium" style={{ color: COLORS.text }}>
              {currentAccount.name}
            </span>
            <button 
              className="bg-transparent border-none cursor-pointer text-[11px] underline p-0"
              onClick={onUnlinkAccount}
              style={{ color: COLORS.textMuted }}
            >
              Unlink
            </button>
          </div>
        ) : (
          <Button 
            variant={ButtonVariants.text}
            color={ButtonColors.secondary}
            size={ButtonSizes.small}
            onClick={() => setIsOpen(true)}
          >
            Set Goal
            <Icon name={IconNames.add} size="sm" />
          </Button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 border border-gray-200 rounded-lg p-3 mt-1 shadow-lg" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: COLORS.text }}>
              Choose account for goal
            </span>
            <button 
              className="bg-transparent border-none cursor-pointer text-lg p-0 w-5 h-5 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
              style={{ color: COLORS.textMuted }}
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {eligibleAccounts.map(account => (
              <button
                key={account.id}
                className={`px-3 py-2 rounded-md cursor-pointer transition-all duration-200 border text-left hover:-translate-y-0.5 hover:shadow-md ${account.id === currentLinkedAccountId ? 'opacity-80' : ''}`}
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
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium">{account.name}</span>
                  <span className="text-[11px]" style={{ color: COLORS.textMuted }}>
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





