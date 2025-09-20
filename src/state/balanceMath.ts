import { AccountActivityItem } from './contributionSelectors';

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
  // Start with current balance and work backwards through the activity
  let runningBalance = currentBalance;
  
  return activityItems.map(item => {
    // Calculate balance before this transaction (working backwards)
    // For all account types, we subtract the transaction amount to get the previous balance
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
