import { Transaction } from '../lib/supabase';
import { Contribution } from './activitySelectors';

// Account-specific activity item (extends ActivityItem with running balance)
export interface AccountActivityItem {
  id: string;
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
  source: 'linked' | 'manual';
  runningBalance?: number; // Running balance after this entry
}

/**
 * Gets contributions for a specific account
 * @param contributions Array of manual contributions
 * @param accountId Account ID to filter by
 * @returns Filtered contributions for the account
 */
export function getContributionsByAccount(
  contributions: Contribution[] = [],
  accountId: string
): Contribution[] {
  return contributions.filter(contrib => contrib.accountId === accountId);
}

/**
 * Gets contributions for a specific goal
 * @param contributions Array of manual contributions
 * @param goalId Goal ID to filter by
 * @returns Filtered contributions for the goal
 */
export function getContributionsByGoal(
  contributions: Contribution[] = [],
  goalId: string
): Contribution[] {
  return contributions.filter(contrib => contrib.goalId === goalId);
}

/**
 * Gets transactions for a specific account
 * @param transactions Array of linked account transactions
 * @param accountId Account ID to filter by
 * @returns Filtered transactions for the account
 */
export function getTransactionsByAccount(
  transactions: Transaction[] = [],
  accountId: string
): Transaction[] {
  return transactions.filter(tx => tx.account_id === accountId);
}

/**
 * Merges transactions and contributions for a specific account into unified activity
 * @param transactions Array of linked account transactions
 * @param contributions Array of manual contributions
 * @param accountId Account ID to filter by
 * @param accountName Account name for display
 * @returns Sorted array of account-specific activity items (newest first)
 */
export function mergeAccountActivity(
  transactions: Transaction[] = [],
  contributions: Contribution[] = [],
  accountId: string,
  accountName: string
): AccountActivityItem[] {
  const activityItems: AccountActivityItem[] = [];

  // Add transactions (linked accounts)
  const accountTransactions = getTransactionsByAccount(transactions, accountId);
  accountTransactions.forEach(transaction => {
    activityItems.push({
      id: `transaction-${transaction.id}`,
      date: transaction.date,
      description: transaction.name || transaction.merchant_name || 'Transaction',
      amount: transaction.amount,
      accountId: transaction.account_id,
      accountName: accountName,
      source: 'linked'
    });
  });

  // Add contributions (manual entries)
  const accountContributions = getContributionsByAccount(contributions, accountId);
  accountContributions.forEach(contribution => {
    activityItems.push({
      id: `contribution-${contribution.id}`,
      date: contribution.date,
      description: contribution.description,
      amount: contribution.amount,
      accountId: contribution.accountId,
      accountName: accountName,
      source: 'manual'
    });
  });

  // Sort by date (newest first)
  return activityItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
