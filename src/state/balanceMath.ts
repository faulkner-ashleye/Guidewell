import { AccountActivityItem } from './contributionSelectors';
import { Transaction } from '../lib/supabase';
import { Contribution } from './activitySelectors';

/**
 * Computes running balances for activity items
 * @param activityItems Array of activity items (should be sorted newest first)
 * @param currentBalance Current account balance
 * @param accountType Type of account (affects how transactions impact balance)
 * @returns Activity items with runningBalance property added
 */
export function computeRunningBalances(
  activityItems: AccountActivityItem[],
  currentBalance: number,
  accountType?: string
): AccountActivityItem[] {
  // Since we're working with newest-first data, we need to reverse it to calculate properly
  // Then reverse back to maintain the newest-first order
  const reversedItems = [...activityItems].reverse();
  
  // Start with the oldest balance (current balance minus all transactions)
  const oldestBalance = currentBalance - activityItems.reduce((sum, item) => sum + item.amount, 0);
  let runningBalance = oldestBalance;
  
  const itemsWithBalances = reversedItems.map(item => {
    // Add the transaction amount to get the balance after this transaction
    runningBalance = runningBalance + item.amount;
    
    return {
      ...item,
      runningBalance: runningBalance
    };
  });
  
  // Reverse back to newest-first order
  return itemsWithBalances.reverse();
}

/**
 * Calculates the current account balance based on transactions and contributions
 * @param transactions Array of transactions for the account
 * @param contributions Array of contributions for the account
 * @param accountType Type of account (affects how transactions impact balance)
 * @param startingBalance Starting balance (optional, defaults to 0)
 * @returns Current account balance
 */
export function calculateAccountBalance(
  transactions: Transaction[] = [],
  contributions: Contribution[] = [],
  accountType?: string,
  startingBalance: number = 0
): number {
  // Calculate balance from transactions
  const transactionBalance = transactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);

  // Calculate balance from contributions
  const contributionBalance = contributions.reduce((sum, contribution) => {
    return sum + contribution.amount;
  }, 0);

  // Total balance is starting balance + all transaction amounts + all contribution amounts
  return startingBalance + transactionBalance + contributionBalance;
}

/**
 * Formats a running balance for display
 * @param balance Balance amount
 * @returns Formatted currency string
 */
export function formatRunningBalance(balance: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance);
}
