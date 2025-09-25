import { Account } from './AppStateContext';
import { getAccountTypeDisplayName } from '../utils/plaidAccountMapping';

export function groupAccountsByType(accts: Account[]) {
  const groups: Record<string, Account[]> = {};
  for (const a of accts) {
    const key = a.type; // 'checking' | 'savings' | 'credit_card' | 'loan' | 'investment'
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  }
  return groups;
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(n || 0);
}

export function goalProgress(goal: { current: number; target: number }) {
  if (!goal || !goal.target) return 0;
  return Math.max(0, Math.min(100, Math.round((goal.current / goal.target) * 100)));
}

export function getAccountTypeLabel(type: Account['type']): string {
  return getAccountTypeDisplayName(type);
}

export function getGoalsFromAccounts(accounts: Account[]) {
  return accounts.filter(account => 
    account.goalTarget !== undefined && 
    account.goalTarget !== null
  ).map(account => ({
    id: account.id,
    name: account.name,
    current: account.balance,
    target: account.goalTarget!,
    progress: goalProgress({ current: account.balance, target: account.goalTarget! })
  }));
}
