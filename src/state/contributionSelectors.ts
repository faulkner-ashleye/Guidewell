import { Transaction } from '../lib/supabase';
import { Contribution } from './activitySelectors';
import * as ActivityUtils from './activitySelectors';

// Account-specific activity item (extends ActivityItem with running balance)
export interface AccountActivityItem {
  id: string;
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
  source: 'linked' | 'manual';
  category?: string; // Simplified single transaction category
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
    const category = ActivityUtils.simplifyCategory(transaction.category || []);

    // For 401K and Roth IRA contributions, use the account name instead of generic transaction name
    let description;
    if (transaction.name && (transaction.name.toLowerCase().includes('401k') || transaction.name.toLowerCase().includes('roth ira'))) {
      description = ActivityUtils.toTitleCase(transaction.name);
    } else {
      // Check if this is a goal-related transaction that should use title case
      const goalKeywords = ['emergency fund', 'college fund', 'house', 'wedding', 'vacation', '529', 'deposit'];
      const transactionName = (transaction.name || '').toLowerCase();
      const isGoalRelated = goalKeywords.some(keyword => transactionName.includes(keyword));

      if (isGoalRelated) {
        description = ActivityUtils.toTitleCase(transaction.name || transaction.merchant_name || 'Transaction');
      } else {
        description = ActivityUtils.toSentenceCase(transaction.name || transaction.merchant_name || 'Transaction');
      }
    }

    // Remove redundant terms that match the category
    description = ActivityUtils.removeRedundantCategoryTerms(description, category);

    activityItems.push({
      id: `transaction-${transaction.id}`,
      date: transaction.date,
      description: description,
      amount: transaction.amount,
      accountId: transaction.account_id,
      accountName: accountName,
      source: 'linked',
      category: category
    });
  });

  // Add contributions (manual entries)
  const accountContributions = getContributionsByAccount(contributions, accountId);
  accountContributions.forEach(contribution => {
    // For manual contributions, we'll use a default category of "Transfer" since they're typically savings/investment related
    const category = 'Transfer';
    const description = ActivityUtils.toSentenceCase(contribution.description);

    activityItems.push({
      id: `contribution-${contribution.id}`,
      date: contribution.date,
      description: description,
      amount: contribution.amount,
      accountId: contribution.accountId,
      accountName: accountName,
      source: 'manual',
      category: category
    });
  });

  // Sort by date (newest first)
  return activityItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}
