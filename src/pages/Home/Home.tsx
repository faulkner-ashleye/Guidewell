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
import QuickActionsButton from '../../app/components/QuickActionsButton';
import QuickActionsSheet from '../../app/components/QuickActionsSheet';
import AddGoalModal from '../../app/plan/components/AddGoalModal';
import LogContributionModal from '../../app/components/LogContributionModal';
import PlaidLinkButton from '../../components/PlaidLinkButton';
import Sheet from '../../app/components/Sheet';
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
    clearSampleData
  } = useAppState();

  // Quick Actions state
  const [qaOpen, setQaOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  // Get recent activity feed
  const recentActivity = getRecentActivity(transactions, contributions, accounts, 10);

  // Calculate totals using selectors
  const savingsTotal = sumByType(accounts, ['checking', 'savings']);
  const debtTotal = sumByType(accounts, ['credit_card', 'loan']);
  const checkingTotal = sumByType(accounts, ['checking']);
  const creditCardTotal = sumByType(accounts, ['credit_card']);
  const studentLoanTotal = sumByType(accounts, ['loan']);

  const goal = getPrimaryGoal(accounts, userProfile || undefined);
  const highestAPR = getHighestAPR(accounts);
  
  // Build net worth series for stacked area chart
  const netWorthSeries = buildNetWorthSeries(accounts, [], 56);

  const hasData = accounts.length > 0;
  const hasChartData = savingsTotal + debtTotal > 0;

  return (
    <div className="home">
      <HomeHeader
        greeting={`Hi ${userProfile?.firstName || 'there'} 👋`}
        subtitle="Your financial snapshot today"
        rightAction={<QuickActionsButton onClick={() => setQaOpen(true)} />}
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
              cursor: 'pointer'
            }}
          >
            Add My Accounts
          </button>
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

          {/* 2x2 Summary Cards */}
          <div className="summary-grid">
            <SummaryCard
              title="Checking"
              value={formatCurrency(checkingTotal)}
              subline={accounts.filter(a => a.type === 'checking').length > 1 ?
                `${accounts.filter(a => a.type === 'checking').length} accounts` :
                accounts.find(a => a.type === 'checking')?.name
              }
            />

            <SummaryCard
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

            <SummaryCard
              title="Credit Card"
              value={formatCurrency(creditCardTotal)}
              subline={highestAPR ? `${highestAPR}% APR` : 'No credit cards'}
            />

            <SummaryCard
              title="Student Loans"
              value={formatCurrency(studentLoanTotal)}
              subline={accounts.filter(a => a.type === 'loan').length > 0 ?
                `${accounts.filter(a => a.type === 'loan').length} loans` :
                'No loans'
              }
            />
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="activity-feed">
                {recentActivity.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-main">
                      <div className="activity-description">{item.description}</div>
                      <div
                        className={`activity-amount ${item.amount >= 0 ? 'activity-positive' : 'activity-negative'}`}
                      >
                        {item.amount >= 0 ? '+' : ''}{formatCurrency(item.amount)}
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
                ))}
              </div>
            ) : (
              <div className="no-activity">Connect accounts to see recent transactions.</div>
            )}
          </div>

          {/* Insights/Nudge */}
          {savingsTotal > 0 && debtTotal > 0 && (
            <div className="insights">
              <div className="insight-text">
                💡 Tip: Shifting +$50/mo from shopping could reduce payoff time. Educational scenario only.
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        open={qaOpen}
        onClose={() => setQaOpen(false)}
        onAddGoal={() => setGoalOpen(true)}
        onConnectAccount={() => setConnectOpen(true)}
        onLogContribution={() => setLogOpen(true)}
      />

      {/* Add Goal modal */}
      <AddGoalModal
        open={goalOpen}
        onClose={() => setGoalOpen(false)}
        onCreate={(g: any) => {/* setGoals(prev=>[...prev, g]) handled inside modal caller */}}
        accounts={accounts}
      />

      {/* Log Contribution modal */}
      <LogContributionModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSave={(c: any) => { /* apply to state in your handler */ }}
        accounts={accounts}
        goals={goals}
      />

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
    </div>
  );
}
