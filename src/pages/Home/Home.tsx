import React, { useState, useMemo } from 'react';
import { useAppState } from '../../state/AppStateContext';
import { getRecentActivity } from '../../state/activitySelectors';
import {
  sumByType,
  formatCurrency
} from '../../state/selectors';
import { buildNetWorthSeries } from '../../state/financeSelectors';
import { NetWorthChartWithTimeline } from '../../components/NetWorthChartWithTimeline';
import { AccountBalanceCard } from '../../components/AccountBalanceCard';
import { SpendingCard } from '../../components/SpendingCard';
import HomeHeader from '../../app/components/HomeHeader';
import { useInsightsCount } from '../../hooks/useInsightsCount';
import PlaidLinkButton from '../../components/PlaidLinkButton';
import Sheet from '../../app/components/Sheet';
import { sampleScenarios } from '../../data/sampleScenarios';
import { getTransactionIcon } from '../../utils/transactionIcons';
import { formatDate } from '../../utils/format';
import { Icon } from '../../components/Icon';
import { getActivityItemCategoryName, getActivityItemCategoryIcon } from '../../utils/transactionCategories';
import { ContentRecommendationCard } from '../../components/ContentRecommendationCard';
import { ContentRecommendationEngine } from '../../data/contentLibrary';
import { EnhancedUserProfile } from '../../data/enhancedUserProfile';
import { UserProfileUtils } from '../../data/enhancedUserProfile';
import { ContentItem } from '../../data/contentLibrary';
import { Goal as AppGoal } from '../../app/types';
// Removed COLORS import - using design system utilities instead
import './Home.css';

export function Home() {
  const {
    accounts = [],
    userProfile,
    setUserProfile,
    goals = [],
    transactions = [],
    contributions = [],
    setAccounts,
    clearSampleData,
    loadSampleScenario
  } = useAppState();

  // Get insights count for badge
  const insightsCount = useInsightsCount();

  // Sample scenario state
  const [sampleScenarioOpen, setSampleScenarioOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  // Get recent activity feed
  const recentActivity = getRecentActivity(transactions, contributions, accounts, 10);

  // Calculate totals using selectors
  const savingsTotal = sumByType(accounts, ['checking', 'savings']);
  const debtTotal = sumByType(accounts, ['credit_card', 'loan']);

  // Convert AppGoal to data Goal type for enhanced user profile
  const convertedGoals = useMemo(() => {
    return goals.map((goal: AppGoal) => ({
      id: goal.id,
      name: goal.name,
      type: goal.type === 'savings' ? 'emergency_fund' : 
            goal.type === 'debt' ? 'debt_payoff' : 
            goal.type as 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom',
      accountId: goal.accountId,
      accountIds: goal.accountIds,
      target: goal.target,
      targetDate: goal.targetDate,
      monthlyContribution: goal.monthlyContribution,
      priority: goal.priority,
      note: goal.note,
      createdAt: goal.createdAt
    }));
  }, [goals]);

  // Create enhanced user profile for content recommendations
  const enhancedUserProfile = useMemo((): EnhancedUserProfile => {
    return UserProfileUtils.createEnhancedProfile(userProfile, accounts, convertedGoals);
  }, [userProfile, accounts, convertedGoals]);

  // Get AI-powered content recommendations
  const contentRecommendations = useMemo((): Array<{ recommendation: any; content: ContentItem }> => {
    if (!enhancedUserProfile) return [];
    
    // For now, return empty array - we'll implement AI content recommendations later
    // This prevents the static template content from showing
    return [];
  }, [enhancedUserProfile, accounts, savingsTotal]);

  // Handle content read
  const handleContentRead = (content: ContentItem) => {
    console.log('Content read:', content.title);
    // In a real app, this would track reading progress, open content, etc.
  };


  // Determine display name - prioritize user's actual name
  const getDisplayName = () => {
    // Always try to show the user's name if available
    if (userProfile?.firstName) {
      return userProfile.firstName;
    }
    if (userProfile?.name) {
      // If no firstName but we have full name, extract first name
      return userProfile.name.split(' ')[0];
    }
    // Fallback to generic greeting
    return 'there';
  };

  // Build net worth series for line chart
  const netWorthSeries = buildNetWorthSeries(accounts, [], 56);

  const hasData = accounts.length > 0;
  const hasChartData = savingsTotal + debtTotal > 0;

  return (
    <div className="home">
      <HomeHeader
        greeting={`Hi ${getDisplayName()} 👋`}
        subtitle="Your financial snapshot today"
        insightsCount={insightsCount}
      />


      {!hasData ? (
        // Empty state
        <div className="empty-state">
          <div className="empty-state-card">
            <h3>No accounts yet</h3>
            <p>Connect accounts in Settings to get started</p>
            <button 
              className="connect-button"
              onClick={() => window.location.href = '/settings'}
            >
              Go to Settings
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Line Chart */}
          {hasChartData && (
            <div className="hero-chart">
              <NetWorthChartWithTimeline data={netWorthSeries} title="Net Worth Overview" />
            </div>
          )}

          {/* Dashboard Cards */}
          <div className="dashboard-grid">
            <AccountBalanceCard accounts={accounts} />
            <SpendingCard transactions={transactions} />
          </div>

          {/* Content Recommendations */}
          {contentRecommendations.length > 0 && (
            <div className="content-recommendations">
              <h2>Recommended for You</h2>
              <div className="content-grid">
                {contentRecommendations.map((item) => (
                  <ContentRecommendationCard
                    key={item.recommendation.contentId}
                    recommendation={item.recommendation}
                    content={item.content}
                    onRead={handleContentRead}
                    onBookmark={(contentId) => console.log('Bookmark:', contentId)}
                    onDismiss={(contentId) => console.log('Dismiss:', contentId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="activity-feed">
                {recentActivity.map((item) => {
                  // Get the account type for this transaction
                  const account = accounts.find(acc => acc.id === item.accountId);
                  const accountType = account?.type;

                  // Determine activity type and styling based on transaction description and account type
                  const isInvestmentContribution = item.description.includes('401K') ||
                    item.description.toLowerCase().includes('roth ira') ||
                    item.description.toLowerCase().includes('investment') ||
                    item.description.toLowerCase().includes('college fund') ||
                    item.description.includes('529');
                  const isSavingsTransfer = item.description.toLowerCase().includes('transfer') ||
                    item.description.toLowerCase().includes('savings') ||
                    item.description.toLowerCase().includes('emergency fund') ||
                    item.description.toLowerCase().includes('down payment') ||
                    item.description.toLowerCase().includes('house savings') ||
                    item.description.toLowerCase().includes('equipment savings') ||
                    item.description.toLowerCase().includes('vacation savings') ||
                    item.description.toLowerCase().includes('wedding savings') ||
                    item.description.toLowerCase().includes('college fund') ||
                    item.description.toLowerCase().includes('real estate investment fund');

                  // For credit card accounts, payments (negative amounts) are positive activity (reducing debt)
                  const isCreditCardPayment = accountType === 'credit_card' &&
                    item.description.toLowerCase().includes('payment') &&
                    item.amount < 0;

                  // For loan accounts, payments (negative amounts) are positive activity (reducing debt)
                  const isLoanPayment = accountType === 'loan' &&
                    item.description.toLowerCase().includes('payment') &&
                    item.amount < 0;

                  // For checking/savings accounts, payments to credit cards or loans are positive activity (reducing debt)
                  const isDebtPaymentFromChecking = (accountType === 'checking' || accountType === 'savings') &&
                    (item.description.toLowerCase().includes('credit card payment') ||
                     item.description.toLowerCase().includes('card payment') ||
                     item.description.toLowerCase().includes('loan payment') ||
                     item.description.toLowerCase().includes('student loan') ||
                     item.description.toLowerCase().includes('auto loan') ||
                     item.description.toLowerCase().includes('personal loan') ||
                     item.description.toLowerCase().includes('federal student loan') ||
                     item.description.toLowerCase().includes('private student loan') ||
                     item.description.toLowerCase().includes('business credit card payment')) &&
                    item.amount < 0;

                  const isIncome = item.amount > 0 && (
                    item.description.toLowerCase().includes('payroll deposit') ||
                    item.description.toLowerCase().includes('freelance project') ||
                    item.description.toLowerCase().includes('upwork payment') ||
                    item.description.toLowerCase().includes('client')
                  );

                  let activityClass = '';
                  let displayAmount = item.amount;
                  let prefix = '';

                  if (isIncome) {
                    activityClass = 'activity-positive';
                    prefix = '+';
                  } else if (isCreditCardPayment || isLoanPayment || isDebtPaymentFromChecking) {
                    // Show debt payments as positive activity (green color) but keep negative amount
                    activityClass = 'activity-positive';
                    displayAmount = item.amount; // Keep original negative amount
                    prefix = ''; // No prefix, let the amount show its natural sign
                  } else if (isInvestmentContribution || isSavingsTransfer) {
                    activityClass = 'activity-positive';
                    // Show as positive amount for investment contributions and savings transfers
                    displayAmount = Math.abs(item.amount);
                    prefix = '+';
                  } else if (item.amount >= 0) {
                    activityClass = 'activity-positive';
                    prefix = '+';
                  } else {
                    activityClass = 'activity-negative';
                    prefix = '';
                  }

                  // Get the category name and icon for this transaction
                  const categoryName = getActivityItemCategoryName(item);
                  const categoryIcon = getActivityItemCategoryIcon(item);

                  return (
                    <div key={item.id} className="activity-item">
                      <div className="activity-meta">
                        <span className="activity-date">{formatDate(item.date)}</span>
                      </div>
                      <div className="activity-main shadow-sm">
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          {/* Transaction Icon */}
                          <div className="activity-icon">
                            <Icon
                              name={categoryIcon}
                              size="sm"
                              style={{ fontSize: '18px' }}
                            />
                          </div>
                          <div className="activity">
                              <div className="activity-description">{item.description}</div>
                              <span className="activity-category">
                                {categoryName}
                              </span>
                        </div>
                        </div>
                        <div className={`activity-amount ${activityClass}`}>
                          {prefix}{formatCurrency(displayAmount)}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-activity">Connect accounts to see recent transactions.</div>
            )}
          </div>

          {/* Dynamic Insights */}
          {(() => {
            // Generate dynamic insights based on user's financial data
            const generateInsight = () => {
              const insights = [];

              // Check for high-interest debt
              const highInterestDebt = accounts.find(acc =>
                acc.type === 'credit_card' && acc.apr && acc.apr > 20
              );

              // Check for low emergency fund - estimate based on savings patterns
              const monthlyExpenses = 3000; // Default estimate for emergency fund calculation
              const emergencyFundRatio = savingsTotal / monthlyExpenses;

              // Check for missed investment opportunities
              const hasDebt = debtTotal > 0;
              const hasInvestments = accounts.some(acc => acc.type === 'investment');

              // Check for recent activity patterns
              const recentSpending = recentActivity
                .filter(item => item.amount < 0 && !item.description.includes('TRANSFER'))
                .slice(0, 5);

              const recentInvestments = recentActivity
                .filter(item => item.description.includes('401K') || item.description.includes('INVESTMENT'))
                .length;

              // Generate insights based on financial situation
              if (highInterestDebt && savingsTotal > 1000) {
                insights.push(`💳 Consider using $${Math.min(1000, savingsTotal * 0.2).toFixed(0)} from savings to pay down your ${highInterestDebt.apr}% APR credit card.`);
              }

              if (emergencyFundRatio < 3 && savingsTotal > 0) {
                const targetEmergencyFund = monthlyExpenses * 3;
                const shortfall = targetEmergencyFund - savingsTotal;
                if (shortfall > 0) {
                  insights.push(`🛡️ Build your emergency fund: you're $${shortfall.toLocaleString()} away from 3 months of expenses.`);
                }
              }

              if (hasDebt && debtTotal > 5000 && !hasInvestments) {
                insights.push(`🎯 Focus on debt payoff before investing. Your debt is costing more than potential investment returns.`);
              }

              if (recentInvestments === 0 && savingsTotal > 5000 && !hasDebt) {
                insights.push(`📈 Consider starting retirement contributions - you have extra cash flow to invest.`);
              }

              if (recentSpending.length > 0) {
                const avgSpending = Math.abs(recentSpending.reduce((sum, item) => sum + item.amount, 0) / recentSpending.length);
                if (avgSpending > 100) {
                  insights.push(`💰 Your recent spending averages $${avgSpending.toFixed(0)} per transaction. Small reductions could free up cash for goals.`);
                }
              }

              // Default insight if no specific insights generated
              if (insights.length === 0) {
                insights.push(`📊 Keep tracking your finances! Regular monitoring helps you stay on top of your goals.`);
              }

            };
          })()}
        </>
      )}


      {/* Connect account sheet (Plaid or other methods) */}
      <Sheet open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect account">
        <div className="grid-auto">
          <PlaidLinkButton 
            instanceId="home-page"
            key={`plaid-link-home-${userProfile ? 'logged-in' : 'logged-out'}`}
            onSuccess={(data: any) => {
            clearSampleData();
            
            // Handle both accounts and transactions if provided
            if (Array.isArray(data)) {
              // Legacy format: just accounts array
              setAccounts(data);
            } else if (data.accounts) {
              // New format: object with accounts and transactions
              setAccounts(data.accounts);
            } else {
              // Fallback: treat as accounts array
              setAccounts(Array.isArray(data) ? data : []);
            }
          }} />
          {/* Or provide "Add accounts another way" here */}
        </div>
      </Sheet>

      {/* Sample Scenario Selector */}
      <Sheet open={sampleScenarioOpen} onClose={() => setSampleScenarioOpen(false)} title="Choose a Sample Scenario">
        <div style={{ padding: '16px' }}>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Explore different financial situations with realistic data and recent activity.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(sampleScenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => {
                  loadSampleScenario(key);
                  setSampleScenarioOpen(false);
                }}
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '16px' }}>
                  {scenario.name}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  {scenario.description}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                  Age: {scenario.userProfile.age} • Income: ${scenario.userProfile.income?.toLocaleString()} •
                  Risk: {scenario.userProfile.riskTolerance}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </div>
  );
}
