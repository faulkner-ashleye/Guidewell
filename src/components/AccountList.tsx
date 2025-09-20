import React from 'react';
import { Account } from '../state/AppStateContext';
import { groupAccountsByType, formatMoney, getAccountTypeLabel } from '../state/planSelectors';
import { COLORS } from '../ui/colors';
import { Icon, IconNames } from './Icon';

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const groupedAccounts = groupAccountsByType(accounts);
  const accountTypes: Account['type'][] = ['checking', 'savings', 'credit_card', 'loan', 'investment', 'debt'];
  
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
      <div className="text-center py-10 px-5">
        <div className="text-base italic text-gray-500">
          No accounts yet — connect one to begin.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {accountTypes.map(type => {
        const typeAccounts = groupedAccounts[type] || [];
        if (typeAccounts.length === 0) return null;
        
        return (
          <div key={type} className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold m-0 text-gray-900">
              {getAccountTypeLabel(type)}
            </h3>
            <div className="flex flex-col gap-2">
              {typeAccounts.map(account => (
                <div key={account.id} className="px-4 py-3 sm:px-3 sm:py-2.5 rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-lg sm:text-base w-6 sm:w-5 text-center flex-shrink-0">
                      <Icon name={getAccountIcon(account.type)} size="sm" className="icon-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-xs font-medium mb-0.5 text-gray-900 text-truncate">
                        {account.name}
                      </div>
                      {(account.apr || account.minPayment) && (
                        <div className="text-xs sm:text-[10px] flex gap-1 mt-0.5 text-gray-500">
                          {account.apr && (
                            <span className="font-medium">
                              {account.apr}% APR
                            </span>
                          )}
                          {account.apr && account.minPayment && ' • '}
                          {account.minPayment && (
                            <span className="font-medium">
                              Min: {formatMoney(account.minPayment)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-sm sm:text-xs font-semibold text-gray-900 text-right text-nowrap">
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
