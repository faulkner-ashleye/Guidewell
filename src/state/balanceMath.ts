import { AccountActivityItem } from './contributionSelectors';

/**
 * Computes running balances for activity items
 * @param activityItems Array of activity items (should be sorted newest first)
 * @param currentBalance Current account balance
 * @returns Activity items with runningBalance property added
 */
export function computeRunningBalances(
  activityItems: AccountActivityItem[],
  currentBalance: number
): AccountActivityItem[] {
  // Start with current balance and work backwards through the activity
  let runningBalance = currentBalance;
  
  return activityItems.map(item => {
    // For each item, subtract the amount to get the balance before this transaction
    // (since we're working backwards from newest to oldest)
    const balanceBefore = runningBalance - item.amount;
    
    // Update running balance for the next iteration
    runningBalance = balanceBefore;
    
    return {
      ...item,
      runningBalance: balanceBefore
    };
  });
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
