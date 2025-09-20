import { useMemo, useState, useEffect } from 'react';
import { useAppState } from '../state/AppStateContext';
import { getRecentActivity } from '../state/activitySelectors';
import {
  sumByType,
  getHighestAPR,
} from '../state/selectors';

interface Insight {
  id: string;
  priority: 'high' | 'medium' | 'low';
}

const INSIGHTS_DISMISSED_KEY = 'guidewell_insights_dismissed';

export function useInsightsCount(): number {
  const {
    accounts = [],
    userProfile,
    goals = [],
    transactions = [],
    contributions = []
  } = useAppState();

  const [isDismissed, setIsDismissed] = useState(false);

  // Check if insights have been dismissed and listen for changes
  useEffect(() => {
    const checkDismissed = () => {
      const dismissed = localStorage.getItem(INSIGHTS_DISMISSED_KEY);
      setIsDismissed(!!dismissed);
    };

    // Check initially
    checkDismissed();

    // Listen for storage changes (when dismissed from another tab/window)
    window.addEventListener('storage', checkDismissed);
    
    // Listen for custom dismissal events (when dismissed in same tab)
    window.addEventListener('insightsDismissed', checkDismissed);
    window.addEventListener('insightsDismissalReset', checkDismissed);

    return () => {
      window.removeEventListener('storage', checkDismissed);
      window.removeEventListener('insightsDismissed', checkDismissed);
      window.removeEventListener('insightsDismissalReset', checkDismissed);
    };
  }, []);

  const insightsCount = useMemo(() => {
    if (accounts.length === 0) return 0;

    // Calculate financial metrics
    const savingsTotal = sumByType(accounts, ['checking', 'savings']);
    const debtTotal = sumByType(accounts, ['credit_card', 'loan']);
    const highestAPR = getHighestAPR(accounts);
    
    // Get recent activity for spending analysis
    const recentActivity = getRecentActivity(transactions, contributions, accounts, 20);

    const insights: Insight[] = [];

    // High-interest debt insights
    const highInterestDebt = accounts.find(acc => 
      acc.type === 'credit_card' && acc.apr && acc.apr > 20
    );
    
    if (highInterestDebt && savingsTotal > 1000 && highInterestDebt.apr) {
      insights.push({
        id: 'high-interest-debt',
        priority: 'high'
      });
    }

    // Emergency fund insights
    const monthlyExpenses = 3000; // Default estimate
    const emergencyFundRatio = savingsTotal / monthlyExpenses;
    
    if (emergencyFundRatio < 3 && savingsTotal > 0) {
      insights.push({
        id: 'emergency-fund',
        priority: emergencyFundRatio < 1 ? 'high' : 'medium'
      });
    }

    // Investment opportunity insights
    const hasDebt = debtTotal > 0;
    const hasInvestments = accounts.some(acc => acc.type === 'investment');
    const recentInvestments = recentActivity.filter(item => 
      item.description.includes('401K') || item.description.includes('INVESTMENT')
    ).length;

    if (hasDebt && debtTotal > 5000 && !hasInvestments) {
      insights.push({
        id: 'debt-before-investing',
        priority: 'medium'
      });
    }

    if (recentInvestments === 0 && savingsTotal > 5000 && !hasDebt) {
      insights.push({
        id: 'start-investing',
        priority: 'medium'
      });
    }

    // Spending pattern insights
    const recentSpending = recentActivity
      .filter(item => item.amount < 0 && !item.description.includes('TRANSFER'))
      .slice(0, 10);
    
    if (recentSpending.length > 0) {
      const avgSpending = Math.abs(recentSpending.reduce((sum, item) => sum + item.amount, 0) / recentSpending.length);
      if (avgSpending > 100) {
        insights.push({
          id: 'spending-optimization',
          priority: 'low'
        });
      }
    }

    // Goal progress insights
    const goal = getPrimaryGoal(accounts, userProfile || undefined);
    if (goal && goal.percent < 25) {
      insights.push({
        id: 'goal-acceleration',
        priority: 'medium'
      });
    }

    // Return count of high and medium priority insights (these are most actionable)
    // Low priority insights don't count toward the badge to avoid overwhelming users
    return insights.filter(insight => 
      insight.priority === 'high' || insight.priority === 'medium'
    ).length;

  }, [accounts, userProfile, goals, transactions, contributions]);

  // Return 0 if dismissed, otherwise return the calculated count
  return isDismissed ? 0 : insightsCount;
}

// Function to dismiss insights (call this when user visits opportunities page)
export function dismissInsights(): void {
  localStorage.setItem(INSIGHTS_DISMISSED_KEY, 'true');
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('insightsDismissed'));
}

// Function to reset dismissal state (useful for testing or new insights)
export function resetInsightsDismissal(): void {
  localStorage.removeItem(INSIGHTS_DISMISSED_KEY);
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('insightsDismissalReset'));
}

// Helper function to get primary goal (duplicated from selectors to avoid circular dependency)
function getPrimaryGoal(accts: any[], userProfile?: { primaryGoalAccountId?: string }) {
  if (!userProfile?.primaryGoalAccountId) return null;
  
  const linkedAccount = accts.find(acc => acc.id === userProfile.primaryGoalAccountId);
  if (!linkedAccount) return null;

  // Simple goal calculation based on account balance
  const target = linkedAccount.targetBalance || (linkedAccount.balance * 2); // Default target
  const current = linkedAccount.balance;
  const percent = Math.min(100, Math.round((current / target) * 100));

  return {
    current,
    target,
    percent,
    accountName: linkedAccount.name
  };
}
