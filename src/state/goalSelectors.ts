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
  contributions: Contribution[] = []
): GoalProgress {
  let current = 0;

  if (goal.type === 'debt') {
    // For debt goals, calculate progress from actual payments made
    let totalPayments = 0;
    
    // Check contributions (manual payments)
    const goalContributions = contributions.filter(contrib => 
      contrib.accountId && 
      (goal.accountIds?.includes(contrib.accountId) || goal.accountId === contrib.accountId) &&
      contrib.amount < 0 // Negative amounts are payments
    );
    totalPayments += goalContributions.reduce((sum, contrib) => sum + Math.abs(contrib.amount), 0);
    
    // For debt goals, current represents amount paid off
    current = totalPayments;
  } else if (goal.accountId) {
    // For savings/investing goals linked to an account - use account balance
    const linkedAccount = accounts.find(acc => acc.id === goal.accountId);
    if (linkedAccount) {
      current = linkedAccount.balance;
    }
  } else {
    // Goal is not linked to an account - use accumulated contributions
    const goalContributions = getContributionsByGoal(contributions, goal.id);
    current = goalContributions.reduce((sum, contrib) => sum + contrib.amount, 0);
  }

  const target = goal.target;
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = Math.max(target - current, 0);
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
