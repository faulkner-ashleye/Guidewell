import { Transaction } from '../lib/supabase';

// Manual contribution interface (for user-entered contributions)
export interface Contribution {
  id: string;
  accountId: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  description: string;
  goalId?: string; // Optional goal this contribution is for
  createdAt: string; // ISO timestamp
}

// Normalized activity item for the feed
export interface ActivityItem {
  id: string;
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
  source: 'linked' | 'manual';
}

/**
 * Merges transactions and contributions into a unified activity feed
 * @param transactions Array of linked account transactions
 * @param contributions Array of manual contributions
 * @param accounts Array of accounts for name lookup
 * @returns Sorted array of activity items (newest first)
 */
export function mergeActivity(
  transactions: Transaction[] = [],
  contributions: Contribution[] = [],
  accounts: any[] = []
): ActivityItem[] {
  const activityItems: ActivityItem[] = [];

  // Add transactions (linked accounts)
  transactions.forEach(transaction => {
    const account = accounts.find(acc => acc.id === transaction.account_id);
    activityItems.push({
      id: `transaction-${transaction.id}`,
      date: transaction.date,
      description: transaction.name || transaction.merchant_name || 'Transaction',
      amount: transaction.amount,
      accountId: transaction.account_id,
      accountName: account?.name || 'Unknown Account',
      source: 'linked'
    });
  });

  // Add contributions (manual entries)
  contributions.forEach(contribution => {
    const account = accounts.find(acc => acc.id === contribution.accountId);
    activityItems.push({
      id: `contribution-${contribution.id}`,
      date: contribution.date,
      description: contribution.description,
      amount: contribution.amount,
      accountId: contribution.accountId,
      accountName: account?.name || 'Unknown Account',
      source: 'manual'
    });
  });

  // Sort by date (newest first)
  return activityItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Gets the most recent activity items (up to limit)
 * @param transactions Array of linked account transactions
 * @param contributions Array of manual contributions
 * @param accounts Array of accounts for name lookup
 * @param limit Maximum number of items to return (default: 10)
 * @returns Limited array of recent activity items
 */
export function getRecentActivity(
  transactions: Transaction[] = [],
  contributions: Contribution[] = [],
  accounts: any[] = [],
  limit: number = 10
): ActivityItem[] {
  const allActivity = mergeActivity(transactions, contributions, accounts);
  return allActivity.slice(0, limit);
}
