import { Goal, Account } from '../app/types';
import { Contribution } from './activitySelectors';
import { getContributionsByGoal } from './contributionSelectors';

export interface GoalProgress {
  current: number;
  target: number;
  percentage: number;
  remaining: number;
  isComplete: boolean;
}

/**
 * Computes goal progress based on linked account balance or accumulated contributions
 * @param goal The goal to compute progress for
 * @param accounts Array of accounts (for linked account balance)
 * @param contributions Array of contributions (for manual goal tracking)
 * @returns Goal progress information
 */
export function computeGoalProgress(
  goal: Goal,
  accounts: Account[] = [],
  contributions: Contribution[] = [],
  transactions: any[] = []
): GoalProgress {
  let current = 0;
  let target = goal.target;

  if (goal.type === 'debt' || goal.type === 'debt_payoff') {
    // For debt goals, calculate progress from account balance (debt reduction)
    if (goal.accountId) {
      // Single account linked
      const linkedAccount = accounts.find(acc => acc.id === goal.accountId);
      if (linkedAccount) {
        // For debt goals, progress is based on how much debt has been reduced
        let originalDebt = goal.target;
        if (goal.target === 0) {
          // If target is 0, we need to calculate the original debt amount
          // For credit cards: positive amounts are payments, negative amounts are purchases
          // For loans: negative amounts are payments
          const isCreditCard = linkedAccount.type === 'credit_card';
          const accountTransactions = transactions.filter(tx => {
            if (tx.account_id !== goal.accountId) return false;
            return isCreditCard ? tx.amount > 0 : tx.amount < 0;
          });
          const paymentsMade = accountTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
          
          // For debt goals with target: 0, the account balance is the CURRENT debt
          // Original debt = current debt + payments made
          originalDebt = linkedAccount.balance + paymentsMade;
          const currentBalance = linkedAccount.balance; // Current debt balance
          
          // Debug logging
          console.log(`Debt Goal Debug - ${goal.name}:`, {
            goalId: goal.id,
            accountId: goal.accountId,
            accountType: linkedAccount.type,
            isCreditCard,
            allTransactions: transactions.length,
            accountTransactions: accountTransactions.length,
            paymentsMade,
            originalDebt,
            currentBalance,
            transactions: accountTransactions.map(tx => ({ id: tx.id, amount: tx.amount, date: tx.date }))
          });
          
          // For debt goals: current = progress made (payments), remaining = current balance
          current = paymentsMade;
          target = originalDebt; // Set target to original debt amount for percentage calculation
          // We'll set remaining later in the function
        } else {
          current = Math.max(0, originalDebt - linkedAccount.balance);
        }
      }
    } else if (goal.accountIds && goal.accountIds.length > 0) {
      // Multiple accounts linked
      const linkedAccounts = accounts.filter(acc => goal.accountIds!.includes(acc.id));
      const totalOriginalDebt = linkedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
      let originalDebt = goal.target;
      if (goal.target === 0) {
        // Account balances represent current debt amounts
        // Original debt = current debt + payments made
        const accountTransactions = transactions.filter(tx => 
          tx.account_id && goal.accountIds!.includes(tx.account_id) && tx.amount < 0
        );
        const paymentsMade = accountTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        originalDebt = totalOriginalDebt + paymentsMade; // Original debt = current + payments
        current = paymentsMade; // Progress is payments made
        target = originalDebt; // Set target to original debt amount for percentage calculation
      } else {
        current = Math.max(0, originalDebt - totalOriginalDebt);
      }
    } else {
      // No account linked - use contributions
      const goalContributions = contributions.filter(contrib => 
        contrib.accountId && 
        (goal.accountIds?.includes(contrib.accountId) || goal.accountId === contrib.accountId) &&
        contrib.amount < 0 // Negative amounts are payments
      );
      current = goalContributions.reduce((sum, contrib) => sum + Math.abs(contrib.amount), 0);
    }
  } else if (goal.accountIds && goal.accountIds.length > 0) {
    // For savings/investing goals linked to multiple accounts - calculate from all accounts
    const linkedAccounts = accounts.filter(acc => goal.accountIds!.includes(acc.id));
    if (linkedAccounts.length > 0) {
      // Calculate current amount from positive transactions across all linked accounts
      const accountTransactions = transactions.filter(tx => 
        tx.account_id && goal.accountIds!.includes(tx.account_id) && tx.amount > 0
      );
      const totalDeposits = accountTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      // Sum up all account balances
      const totalAccountBalance = linkedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
      
      // Use the higher of total account balance or calculated deposits
      current = Math.max(totalAccountBalance, totalDeposits);
      
      // Debug logging for multiple account savings goals
      console.log(`Multiple Account Savings Goal Debug - ${goal.name}:`, {
        goalId: goal.id,
        accountIds: goal.accountIds,
        linkedAccounts: linkedAccounts.map(acc => ({ id: acc.id, name: acc.name, balance: acc.balance })),
        totalAccountBalance,
        totalDeposits,
        current,
        goalTarget: goal.target,
        allTransactions: transactions.length,
        accountTransactions: accountTransactions.length,
        transactions: accountTransactions.map(tx => ({ id: tx.id, account_id: tx.account_id, amount: tx.amount, date: tx.date }))
      });
    }
  } else if (goal.accountId) {
    // For savings/investing goals linked to a single account - calculate from transactions
    const linkedAccount = accounts.find(acc => acc.id === goal.accountId);
    if (linkedAccount) {
      // Calculate current amount from positive transactions (deposits/transfers)
      const accountTransactions = transactions.filter(tx => 
        tx.account_id === goal.accountId && tx.amount > 0
      );
      const totalDeposits = accountTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      // Use the higher of account balance or calculated deposits
      current = Math.max(linkedAccount.balance, totalDeposits);
      
      // Debug logging for savings goals
      console.log(`Savings Goal Debug - ${goal.name}:`, {
        goalId: goal.id,
        accountId: goal.accountId,
        accountBalance: linkedAccount.balance,
        totalDeposits,
        current,
        goalTarget: goal.target,
        allTransactions: transactions.length,
        accountTransactions: accountTransactions.length,
        transactions: accountTransactions.map(tx => ({ id: tx.id, amount: tx.amount, date: tx.date }))
      });
    }
  } else {
    // Goal is not linked to an account - use accumulated contributions
    const goalContributions = getContributionsByGoal(contributions, goal.id);
    current = goalContributions.reduce((sum, contrib) => sum + contrib.amount, 0);
  }

  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  // For debt goals, remaining should be the current debt balance
  let remaining;
  if ((goal.type === 'debt' || goal.type === 'debt_payoff') && goal.accountId) {
    const linkedAccount = accounts.find(acc => acc.id === goal.accountId);
    if (linkedAccount) {
      // For debt goals with target: 0, remaining is the current account balance
      // For debt goals with target > 0, remaining is target - current
      if (goal.target === 0) {
        remaining = linkedAccount.balance; // Current debt balance
      } else {
        remaining = Math.max(0, goal.target - current);
      }
    } else {
      remaining = 0;
    }
  } else if ((goal.type === 'debt' || goal.type === 'debt_payoff') && goal.accountIds && goal.accountIds.length > 0) {
    const linkedAccounts = accounts.filter(acc => goal.accountIds!.includes(acc.id));
    if (goal.target === 0) {
      // For multiple debt accounts with target: 0, remaining is sum of current balances
      remaining = linkedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    } else {
      // For multiple debt accounts with target > 0, remaining is target - current
      remaining = Math.max(0, goal.target - current);
    }
  } else if ((goal.type === 'emergency_fund' || goal.type === 'savings' || goal.type === 'investment' || goal.type === 'retirement') && goal.accountIds && goal.accountIds.length > 0) {
    // For multiple account savings/investment goals, remaining is target - current
    remaining = Math.max(target - current, 0);
  } else {
    // For single account or unlinked savings/investment goals, remaining is target - current
    remaining = Math.max(target - current, 0);
  }
  
  const isComplete = current >= target;

  return {
    current,
    target,
    percentage,
    remaining,
    isComplete
  };
}

/**
 * Gets the linked account for a goal
 * @param goal The goal to get the linked account for
 * @param accounts Array of accounts
 * @returns The linked account or undefined
 */
export function getGoalLinkedAccount(
  goal: Goal,
  accounts: Account[] = []
): Account | undefined {
  if (!goal.accountId) return undefined;
  return accounts.find(acc => acc.id === goal.accountId);
}

/**
 * Formats a percentage for display
 * @param percentage Percentage value (0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

/**
 * Formats a currency amount for display
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
