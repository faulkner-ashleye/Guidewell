import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../state/AppStateContext';
import { getRecentActivity } from '../../state/activitySelectors';
import {
  sumByType,
  getPrimaryGoal,
  getHighestAPR,
  formatCurrency
} from '../../state/selectors';
import { Icon, IconNames } from '../../components/Icon';
import AppHeader from '../../app/components/AppHeader';
import { Button, ButtonVariants } from '../../components/Button';
import { dismissInsights } from '../../hooks/useInsightsCount';
import './Opportunities.css';

interface Insight {
  id: string;
  category: 'debt' | 'savings' | 'investing' | 'spending' | 'general';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact?: string;
  icon: string;
}

export function Opportunities() {
  const navigate = useNavigate();
  const {
    accounts = [],
    userProfile,
    goals = [],
    transactions = [],
    contributions = []
  } = useAppState();

  // Calculate financial metrics
  const savingsTotal = sumByType(accounts, ['checking', 'savings']);
  const debtTotal = sumByType(accounts, ['credit_card', 'loan']);
  const checkingTotal = sumByType(accounts, ['checking']);
  const creditCardTotal = sumByType(accounts, ['credit_card']);
  const studentLoanTotal = sumByType(accounts, ['loan']);
  const savingsAccountTotal = sumByType(accounts, ['savings']);
  const investmentTotal = sumByType(accounts, ['investment']);
  const goal = getPrimaryGoal(accounts, userProfile || undefined);
  const highestAPR = getHighestAPR(accounts);

  // Get recent activity for spending analysis
  const recentActivity = getRecentActivity(transactions, contributions, accounts, 20);

  // Generate comprehensive insights
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // High-interest debt insights
    const highInterestDebt = accounts.find(acc => 
      acc.type === 'credit_card' && acc.apr && acc.apr > 20
    );
    
    if (highInterestDebt && savingsTotal > 1000 && highInterestDebt.apr) {
      const suggestedPayment = Math.min(1000, savingsTotal * 0.2);
      insights.push({
        id: 'high-interest-debt',
        category: 'debt',
        title: 'High-Interest Credit Card Debt',
        description: `Your ${highInterestDebt.apr}% APR credit card is costing you significantly. Consider using $${suggestedPayment.toFixed(0)} from savings to pay it down faster.`,
        priority: 'high',
        estimatedImpact: `Could save ~$${Math.round(highInterestDebt.apr * suggestedPayment / 1200)} per month in interest`,
        icon: IconNames.warning
      });
    }

    // Emergency fund insights
    const monthlyExpenses = 3000; // Default estimate
    const emergencyFundRatio = savingsTotal / monthlyExpenses;
    
    if (emergencyFundRatio < 3 && savingsTotal > 0) {
      const targetEmergencyFund = monthlyExpenses * 3;
      const shortfall = targetEmergencyFund - savingsTotal;
      insights.push({
        id: 'emergency-fund',
        category: 'savings',
        title: 'Emergency Fund Gap',
        description: `You're $${shortfall.toLocaleString()} away from a 3-month emergency fund. This could help protect you from unexpected expenses.`,
        priority: emergencyFundRatio < 1 ? 'high' : 'medium',
        estimatedImpact: 'Provides financial security during unexpected events',
        icon: IconNames.security
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
        category: 'investing',
        title: 'Focus on Debt First',
        description: 'Your debt is likely costing more than potential investment returns. Consider prioritizing debt payoff before starting investments.',
        priority: 'medium',
        estimatedImpact: 'Reduces interest costs and improves financial foundation',
        icon: IconNames.trending_down
      });
    }

    if (recentInvestments === 0 && savingsTotal > 5000 && !hasDebt) {
      insights.push({
        id: 'start-investing',
        category: 'investing',
        title: 'Investment Opportunity',
        description: 'You have extra cash flow and no high-interest debt. Consider starting retirement contributions to build long-term wealth.',
        priority: 'medium',
        estimatedImpact: 'Could grow significantly over time with compound interest',
        icon: IconNames.trending_up
      });
    }

    // Spending pattern insights
    const recentSpending = recentActivity
      .filter(item => item.amount < 0 && !item.description.includes('TRANSFER'))
      .slice(0, 10);
    
    if (recentSpending.length > 0) {
      const avgSpending = Math.abs(recentSpending.reduce((sum, item) => sum + item.amount, 0) / recentSpending.length);
      if (avgSpending > 100) {
        const potentialSavings = avgSpending * 0.1; // 10% reduction
        insights.push({
          id: 'spending-optimization',
          category: 'spending',
          title: 'Spending Optimization',
          description: `Your recent spending averages $${avgSpending.toFixed(0)} per transaction. Small reductions could free up cash for goals.`,
        priority: 'low',
        estimatedImpact: `Could save ~$${potentialSavings.toFixed(0)} per transaction`,
          icon: IconNames.account_balance_wallet
        });
      }
    }

    // Goal progress insights
    if (goal && goal.percent < 25) {
      insights.push({
        id: 'goal-acceleration',
        category: 'savings',
        title: 'Accelerate Goal Progress',
        description: `Your primary goal is only ${goal.percent}% complete. Consider increasing contributions to reach your target faster.`,
        priority: 'medium',
        estimatedImpact: 'Could help you reach your goal sooner',
        icon: IconNames.flag
      });
    }

    // Default insight if no specific insights generated
    if (insights.length === 0) {
      insights.push({
        id: 'keep-tracking',
        category: 'general',
        title: 'Keep Tracking Your Finances',
        description: 'Regular monitoring helps you stay on top of your goals and identify new opportunities.',
        priority: 'low',
        icon: IconNames.analytics
      });
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const insights = generateInsights();

  // Dismiss insights badge when user visits the opportunities page
  useEffect(() => {
    dismissInsights();
  }, []);

  const getCategoryColor = (category: Insight['category']) => {
    switch (category) {
      case 'debt': return 'var(--color-error-main)';
      case 'savings': return 'var(--color-primary-main)';
      case 'investing': return 'var(--color-secondary-main)';
      case 'spending': return 'var(--color-warning-main)';
      default: return 'var(--color-text-secondary)';
    }
  };


  return (
    <div className="opportunities-page">
      <AppHeader
        title="Opportunities"
        subtitle={`${insights.length} insights for your financial growth`}
        leftAction={
          <Button
            variant={ButtonVariants.text}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <Icon name={IconNames.arrow_back} size="sm" />
          </Button>
        }
      />

      <div className="opportunities-content">
        <div className="opportunities-intro">
          <p className="opportunities-description">
            Personalized insights based on your financial data to help you make informed decisions.
            <br />
          </p>
        </div>

        <div className="insights-list">
          {insights.map((insight) => (
            <div key={insight.id} className="insight-card">
              <div className="insight-header">
                <div className="insight-icon">
                  <Icon 
                    name={insight.icon} 
                    size="lg"
                    style={{ color: getCategoryColor(insight.category) }}
                  />
                </div>
                <div className="insight-title-section">
                  <h3 className="insight-title">{insight.title}</h3>
                </div>
              </div>
              
              <div className="insight-content">
                <p className="insight-description">{insight.description}</p>
                
                {insight.estimatedImpact && (
                  <div className="insight-impact">
                    <Icon name={IconNames.info} size="sm" />
                    <span>{insight.estimatedImpact}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
