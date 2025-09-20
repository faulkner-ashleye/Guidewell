import React, { useState } from 'react';
import { useAppState } from '../../state/AppStateContext';
import { getRecentActivity } from '../../state/activitySelectors';
import {
  sumByType,
  getPrimaryGoal,
  getHighestAPR,
  formatCurrency
} from '../../state/selectors';
import { buildNetWorthSeries } from '../../state/financeSelectors';
import { SummaryCard } from '../../components/SummaryCard';
import { ProgressBar } from '../../components/ProgressBar';
import { NetWorthStackedArea } from '../../components/NetWorthStackedArea';
import { GoalAccountLinker } from '../../components/GoalAccountLinker';
import HomeHeader from '../../app/components/HomeHeader';
import { useInsightsCount } from '../../hooks/useInsightsCount';
import PlaidLinkButton from '../../components/PlaidLinkButton';
import Sheet from '../../app/components/Sheet';
import { sampleScenarios } from '../../data/sampleScenarios';
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
  const checkingTotal = sumByType(accounts, ['checking']);
  const creditCardTotal = sumByType(accounts, ['credit_card']);
  const studentLoanTotal = sumByType(accounts, ['loan']);
  const savingsAccountTotal = sumByType(accounts, ['savings']);
  const investmentTotal = sumByType(accounts, ['investment']);

  const goal = getPrimaryGoal(accounts, userProfile || undefined);
  const highestAPR = getHighestAPR(accounts);

  // Get unique account types that exist in user's data
  const existingAccountTypes = Array.from(new Set(accounts.map(acc => acc.type)));
  
  // Generate dynamic summary cards based on existing account types
  const generateSummaryCards = () => {
    const cards = [];
    
    // Always show checking if it exists
    if (existingAccountTypes.includes('checking')) {
      cards.push(
        <SummaryCard
          key="checking"
          title="Checking"
          value={formatCurrency(checkingTotal)}
          subline={accounts.filter(a => a.type === 'checking').length > 1 ?
            `${accounts.filter(a => a.type === 'checking').length} accounts` :
            accounts.find(a => a.type === 'checking')?.name
          }
        />
      );
    }
    
    // Always show Primary Goal
    cards.push(
      <SummaryCard
        key="primary-goal"
        title="Primary Goal"
        value={goal ? `${goal.percent}%` : 'No goal yet'}
        subline={goal ? `${formatCurrency(goal.current)} of ${formatCurrency(goal.target)}` : 'Set a target in Goals'}
      >
        {goal && <ProgressBar percent={goal.percent} />}
        {hasData && (
          <GoalAccountLinker
            accounts={accounts}
            currentLinkedAccountId={userProfile?.primaryGoalAccountId}
            onLinkAccount={(accountId) => {
              if (userProfile) {
                setUserProfile({
                  ...userProfile,
                  primaryGoalAccountId: accountId
                });
              }
            }}
            onUnlinkAccount={() => {
              if (userProfile) {
                setUserProfile({
                  ...userProfile,
                  primaryGoalAccountId: undefined
                });
              }
            }}
          />
        )}
      </SummaryCard>
    );
    
    // Show savings if it exists
    if (existingAccountTypes.includes('savings')) {
      cards.push(
        <SummaryCard
          key="savings"
          title="Savings"
          value={formatCurrency(savingsAccountTotal)}
          subline={accounts.filter(a => a.type === 'savings').length > 1 ?
            `${accounts.filter(a => a.type === 'savings').length} accounts` :
            accounts.find(a => a.type === 'savings')?.name
          }
        />
      );
    }
    
    // Show credit cards if they exist
    if (existingAccountTypes.includes('credit_card')) {
      cards.push(
        <SummaryCard
          key="credit-card"
          title="Credit Card"
          value={formatCurrency(creditCardTotal)}
          subline={creditCardTotal > 0 ? (highestAPR ? `${highestAPR}% APR` : 'No APR data') : 'No credit cards'}
        />
      );
    }
    
    // Show loans if they exist
    if (existingAccountTypes.includes('loan')) {
      cards.push(
        <SummaryCard
          key="loans"
          title="Loans"
          value={formatCurrency(studentLoanTotal)}
          subline={accounts.filter(a => a.type === 'loan').length > 0 ?
            `${accounts.filter(a => a.type === 'loan').length} loans` :
            'No loans'
          }
        />
      );
    }
    
    // Show investments if they exist
    if (existingAccountTypes.includes('investment')) {
      cards.push(
        <SummaryCard
          key="investments"
          title="Investments"
          value={formatCurrency(investmentTotal)}
          subline={accounts.filter(a => a.type === 'investment').length > 1 ?
            `${accounts.filter(a => a.type === 'investment').length} accounts` :
            accounts.find(a => a.type === 'investment')?.name
          }
        />
      );
    }
    
    return cards;
  };

  // Determine display name - use persona name when in sample data mode
  const getDisplayName = () => {
    if (userProfile?.hasSampleData) {
      // When in sample data mode, use a generic greeting to avoid confusion
      return 'there';
    }
    return userProfile?.firstName || 'there';
  };
  
  // Build net worth series for stacked area chart
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

      {/* Sample Data Message */}
      {userProfile?.hasSampleData && (
        <div className="sample-data-banner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <strong>Sample Data Mode</strong>
          </div>
          <p className="typography-body2">
            We've loaded sample financial data so you can explore Guidewell's features.
            Add your own accounts to see your real financial picture.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setConnectOpen(true)}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                flex: '1',
                minWidth: '120px'
              }}
            >
              Add My Accounts
            </button>
            <button
              onClick={() => setSampleScenarioOpen(true)}
              style={{
                background: 'var(--color-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                flex: '1',
                minWidth: '120px'
              }}
            >
              Try Different Scenario
            </button>
          </div>
        </div>
      )}

      {!hasData ? (
        // Empty state
        <div className="empty-state">
          <SummaryCard
            title="No accounts yet"
            value="Connect accounts in Settings"
            onClick={() => window.location.href = '/settings'}
          />
        </div>
      ) : (
        <>
          {/* Hero Stacked Area Chart */}
          {hasChartData && (
            <div className="hero-chart">
              <NetWorthStackedArea data={netWorthSeries} />
            </div>
          )}

          {/* Dynamic Summary Cards */}
          <div className="summary-grid">
            {generateSummaryCards()}
          </div>

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
                    item.description.includes('ROTH IRA') || 
                    item.description.includes('INVESTMENT');
                  const isSavingsTransfer = item.description.includes('TRANSFER') || 
                    item.description.includes('SAVINGS') ||
                    item.description.includes('EMERGENCY FUND') ||
                    item.description.includes('DOWN PAYMENT') ||
                    item.description.includes('HOUSE SAVINGS') ||
                    item.description.includes('EQUIPMENT SAVINGS') ||
                    item.description.includes('VACATION SAVINGS') ||
                    item.description.includes('WEDDING SAVINGS') ||
                    item.description.includes('COLLEGE FUND') ||
                    item.description.includes('REAL ESTATE INVESTMENT FUND');
                  
                  // For credit card accounts, payments (negative amounts) are positive activity (reducing debt)
                  const isCreditCardPayment = accountType === 'credit_card' && 
                    item.description.includes('PAYMENT') && 
                    item.amount < 0;
                  
                  // For loan accounts, payments (negative amounts) are positive activity (reducing debt)
                  const isLoanPayment = accountType === 'loan' && 
                    item.description.includes('PAYMENT') && 
                    item.amount < 0;
                  
                  // For checking/savings accounts, payments to credit cards or loans are positive activity (reducing debt)
                  const isDebtPaymentFromChecking = (accountType === 'checking' || accountType === 'savings') && 
                    (item.description.includes('CREDIT CARD PAYMENT') || 
                     item.description.includes('CARD PAYMENT') ||
                     item.description.includes('LOAN PAYMENT') ||
                     item.description.includes('STUDENT LOAN')) && 
                    item.amount < 0;
                  
                  const isIncome = item.amount > 0 && (
                    item.description.includes('PAYROLL DEPOSIT') || 
                    item.description.includes('PAYMENT') ||
                    item.description.includes('FREELANCE PROJECT') ||
                    item.description.includes('UPWORK PAYMENT') ||
                    item.description.includes('CLIENT')
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
                    activityClass = 'activity-info';
                    // Show as positive amount for investment contributions and savings transfers
                    displayAmount = Math.abs(item.amount);
                    prefix = '';
                  } else if (item.amount >= 0) {
                    activityClass = 'activity-positive';
                    prefix = '+';
                  } else {
                    activityClass = 'activity-negative';
                    prefix = '';
                  }
                  
                  return (
                    <div key={item.id} className="activity-item">
                      <div className="activity-main">
                        <div className="activity-description">{item.description}</div>
                        <div className={`activity-amount ${activityClass}`}>
                          {prefix}{formatCurrency(displayAmount)}
                        </div>
                      </div>
                      <div className="activity-meta">
                        <span className="activity-date">{item.date}</span>
                        <span className="activity-account">{item.accountName}</span>
                        <span
                          className={`activity-source ${item.source === 'linked' ? 'source-linked' : 'source-manual'} px-xs py-xs rounded-sm text-xs font-medium`}
                        >
                          {item.source === 'linked' ? 'Linked' : 'Manual'}
                        </span>
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
              
              return insights[0]; // Return the first (most relevant) insight
            };
            
            const insight = generateInsight();
            
            return (
              <div className="insights">
                <div className="insight-text">
                  {insight}
                </div>
              </div>
            );
          })()}
        </>
      )}


      {/* Connect account sheet (Plaid or other methods) */}
      <Sheet open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect account">
        <div className="grid-auto">
          <PlaidLinkButton onSuccess={(linked: any) => {
            clearSampleData();
            setAccounts(linked);
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
