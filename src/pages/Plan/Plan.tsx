import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../state/AppStateContext';
import { COLORS } from '../../ui/colors';
import { SummaryCard } from '../../components/SummaryCard';
import { AccountRow } from '../../components/AccountRow';
import { NetWorthChartWithTimeline } from '../../components/NetWorthChartWithTimeline';
import { GoalList } from '../../components/GoalList';
import { ProgressBar } from '../../components/ProgressBar';
import {
  sumBalances,
  groupAccountsByType,
  formatMoney,
  buildNetWorthSeries,
  accountHealth
} from '../../state/financeSelectors';
import { getGoalsFromAccounts } from '../../state/planSelectors';
import PlaidLinkButton from '../../components/PlaidLinkButton';
import Sheet from '../../components/Sheet';
import { ConnectChoose } from '../Onboarding/steps/ConnectChoose';
import AddGoalModal from '../../app/plan/components/AddGoalModal';
import { Goal } from '../../app/types';
import { Account } from '../../state/AppStateContext';
import { Contribution } from '../../state/activitySelectors';
import { Transaction } from '../../lib/supabase';
import AppHeader from '../../app/components/AppHeader';
import { Button, ButtonVariants, ButtonColors } from '../../components/Button';
import { Icon, IconNames } from '../../components/Icon';
import '../../components/Button.css';
import './Plan.css';

export function Plan() {
  const navigate = useNavigate();
  const { accounts = [], goals = [], transactions = [], contributions = [], setAccounts, setGoals, userProfile, setUserProfile, clearSampleData } = useAppState();

  const assets = sumBalances(accounts, ['checking', 'savings', 'investment']);
  const debts  = sumBalances(accounts, ['credit_card', 'loan']);
  const net    = assets - debts;
  const series = buildNetWorthSeries(accounts, [], 56);
  const groups = groupAccountsByType(accounts);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'accounts' | 'goals'>('accounts');
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [preselectedAccountId, setPreselectedAccountId] = useState<string | undefined>(undefined);

  // Connect account state
  const [connectOpen, setConnectOpen] = useState(false);

  // Handle viewing a goal
  const handleViewGoal = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };

  // Handle creating a new goal from the Goals tab
  const handleAddGoal = () => {
    setPreselectedAccountId(undefined); // No preselected account
    setGoalModalOpen(true);
  };

  // Handle creating a goal for a specific account
  const handleCreateGoalForAccount = (accountId: string) => {
    setPreselectedAccountId(accountId);
    setGoalModalOpen(true);
  };

  // Handle creating a goal from the modal
  const handleCreateGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  // Handle navigation to account details
  const handleNavigateToAccount = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  // Handle navigation to goal details
  const handleNavigateToGoal = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };

  // Calculate debt goal progress from actual payment activity
  const calculateDebtGoalProgress = (goal: Goal): number => {
    if (goal.type !== 'debt') return 0;

    let totalPayments = 0;

    // Check contributions (manual payments)
    const goalContributions = contributions.filter(contrib =>
      contrib.accountId &&
      (goal.accountIds?.includes(contrib.accountId) || goal.accountId === contrib.accountId) &&
      contrib.amount < 0 // Negative amounts are payments
    );
    totalPayments += goalContributions.reduce((sum, contrib) => sum + Math.abs(contrib.amount), 0);

    // Check transactions (linked account payments)
    const goalTransactions = transactions.filter(txn =>
      goal.accountIds?.includes(txn.account_id) || goal.accountId === txn.account_id
    );
    // For debt accounts, positive amounts in transactions are typically payments
    totalPayments += goalTransactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

    return totalPayments;
  };

  return (
    <main className="plan-page">
      <AppHeader
        title="Plan"
      />


      {/* Overview: Net worth cards + line chart */}
      <section className="plan-overview">
      <NetWorthChartWithTimeline data={series} title="Net Worth Trend" />
        <div className="plan-summary-grid">
          <SummaryCard title="Assets" value={formatMoney(assets)} />
          <SummaryCard title="Debts"  value={formatMoney(debts)} />
          <SummaryCard
            title="Net Worth"
            value={formatMoney(net)}
            subline={assets + debts > 0 ? `${Math.round((assets/(assets+debts))*100)}% assets` : ''}
          />
        </div>

      </section>

      {/* Tabbed Interface for Accounts and Goals */}
      <section className="plan-tabbed-section">
        {/* Tab Headers */}
        <div className="plan-tab-headers">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`plan-tab-button ${activeTab === 'accounts' ? 'active' : ''}`}
          >
            Accounts
          </button>
          <div className="plan-tab-goals-header">
            <button
              onClick={() => setActiveTab('goals')}
              className={`plan-tab-button ${activeTab === 'goals' ? 'active' : ''}`}
            >
              Goals
            </button>
            {activeTab === 'goals' && (
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={handleAddGoal}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="plan-tab-content">
          {activeTab === 'accounts' ? (
            <>
              {accounts.length === 0 ? (
                <div className="plan-empty-state">
                  No accounts yet — connect one to begin.
                </div>
              ) : (
                <div className="plan-accounts-list">
                  {(['checking','savings','investment','credit_card','loan'] as const).map((type) => {
                    const list = groups[type] || [];
                    if (list.length === 0) return null;
                    const title = type === 'credit_card' ? 'Credit Cards' :
                                 type.charAt(0).toUpperCase() + type.slice(1) + (type.endsWith('s') ? '' : 's');
                    return (
                      <div key={type}>
                        <div className="plan-account-type-header">
                          <h3 className="plan-account-type-title">
                            {title} ({list.length})
                          </h3>
                          <span className="plan-account-type-balance">
                            {formatMoney(sumBalances(list, [type as any]))}
                          </span>
                        </div>
                        <div className="plan-account-list">
                          {list.map((a) => (
                            <div key={a.id} className="plan-account-item">
                              <AccountRow
                                name={a.name}
                                value={formatMoney(a.balance)}
                                meta={
                                  a.type === 'credit_card' && a.apr ? `APR ${a.apr}%` :
                                  a.type === 'loan' && a.minPayment ? `Min payment ${formatMoney(a.minPayment)}` :
                                  undefined
                                }
                                health={accountHealth(a)}
                                accountId={a.id}
                                accountType={a.type}
                                hasGoal={goals.some(g => g.accountId === a.id || (g.accountIds && g.accountIds.includes(a.id)))}
                                goalName={goals.find(g => g.accountId === a.id || (g.accountIds && g.accountIds.includes(a.id)))?.name}
                                goalId={goals.find(g => g.accountId === a.id || (g.accountIds && g.accountIds.includes(a.id)))?.id}
                                onCreateGoal={handleCreateGoalForAccount}
                                onViewGoal={handleViewGoal}
                                onNavigateToAccount={handleNavigateToAccount}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="plan-actions-section">
                <PlaidLinkButton
                  key="plaid-link-plan"
                  userId="demo-user-123"
                  onSuccess={(linked) => {
                    clearSampleData();
                    setAccounts(linked);
                  }}
                />
                <Button
                  variant={ButtonVariants.outline}
                  color={ButtonColors.secondary}
                  onClick={() => setOpen(true)}
                >
                  Add accounts another way
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="goals-tab-header">
                <h2>Savings Goals</h2>
                <p style={{ color: COLORS.textMuted }}>
                  These are the items you are saving towards.
                </p>
              </div>
              <div className="plan-actions-section">
                <Button
                  variant={ButtonVariants.contained}
                  color={ButtonColors.secondary}
                  onClick={handleAddGoal}
                >
                  <Icon name={IconNames.add} size="md" />
                  Add a Goal
                </Button>

              </div>
              <GoalList accounts={accounts} goals={goals} />

            </>
          )}
        </div>
      </section>



      {/* Add another way sheet */}
      <Sheet open={open} onClose={() => setOpen(false)} title="Add accounts another way">
        <ConnectChoose
          onClose={() => setOpen(false)}
          onComplete={() => {
            setOpen(false);
          }}
        />
      </Sheet>



      {/* Add Goal Modal */}
      <AddGoalModal
        open={goalModalOpen}
        onClose={() => {
          setGoalModalOpen(false);
          setPreselectedAccountId(undefined);
        }}
        onCreate={handleCreateGoal}
        accounts={accounts}
        preselectedAccountId={preselectedAccountId}
      />


      {/* Connect account sheet (Plaid or other methods) */}
      <Sheet open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect account">
        <div className="plan-connect-sheet">
          <PlaidLinkButton onSuccess={(linked: any) => {
            clearSampleData();
            setAccounts(linked);
          }} />
          {/* Or provide "Add accounts another way" here */}
        </div>
      </Sheet>
    </main>
  );
}
