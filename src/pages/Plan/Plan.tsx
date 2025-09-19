import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../state/AppStateContext';
import { COLORS } from '../../ui/colors';
import { SummaryCard } from '../../components/SummaryCard';
import { AccountRow } from '../../components/AccountRow';
import { NetWorthStackedArea } from '../../components/NetWorthStackedArea';
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
import QuickActionsButton from '../../app/components/QuickActionsButton';
import QuickActionsSheet from '../../app/components/QuickActionsSheet';
import LogContributionModal from '../../app/components/LogContributionModal';
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

  // Quick Actions state
  const [qaOpen, setQaOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
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
        subtitle="Accounts & Goals"
        rightAction={<QuickActionsButton onClick={() => setQaOpen(true)} />}
      />

      {/* Sample Data Message */}
      {userProfile?.hasSampleData && (
        <div className="plan-sample-banner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <strong>Sample Data Mode</strong>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            You're viewing sample accounts and goals. Add your own accounts to see your real financial plan.
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

      {/* Overview: Net worth cards + stacked area */}
      <section className="plan-overview">
        <div className="plan-summary-grid">
          <SummaryCard title="Assets" value={formatMoney(assets)} />
          <SummaryCard title="Debts"  value={formatMoney(debts)} />
          <SummaryCard 
            title="Net Worth" 
            value={formatMoney(net)} 
            subline={assets + debts > 0 ? `${Math.round((assets/(assets+debts))*100)}% assets` : ''} 
          />
        </div>
        <NetWorthStackedArea data={series} />
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
          <button
            onClick={() => setActiveTab('goals')}
            className={`plan-tab-button ${activeTab === 'goals' ? 'active' : ''}`}
          >
            Goals
          </button>
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
              {goals.length === 0 ? (
                <div className="plan-empty-state">
                  No goals yet — add one to get started.
                </div>
              ) : (
                <div className="plan-goals-list">
                  {goals.map(goal => {
                    // Calculate progress based on linked account(s) or target
                    let current = 0;
                    let linkedAccountNames: string[] = [];
                    
                    if (goal.accountIds && goal.accountIds.length > 0) {
                      // Multiple accounts linked
                      const linkedAccounts = goal.accountIds.map(id => accounts.find(a => a.id === id)).filter((account): account is Account => account !== undefined);
                      
                      if (goal.type === 'debt') {
                        // For debt goals, current represents actual payments made toward the goal
                        current = calculateDebtGoalProgress(goal);
                      } else {
                        // For savings/investing goals, current represents accumulated amount
                        current = linkedAccounts.reduce((sum, account) => sum + account.balance, 0);
                      }
                      linkedAccountNames = linkedAccounts.map(account => account.name);
                    } else if (goal.accountId) {
                      // Single account linked
                      const linkedAccount = accounts.find(a => a.id === goal.accountId);
                      
                      if (goal.type === 'debt') {
                        // For debt goals, current represents actual payments made toward the goal
                        current = calculateDebtGoalProgress(goal);
                      } else {
                        // For savings/investing goals, current represents account balance
                        current = linkedAccount ? linkedAccount.balance : 0;
                      }
                      linkedAccountNames = linkedAccount ? [linkedAccount.name] : [];
                    }
                    
                    const progress = goal.target > 0 ? Math.min(100, Math.round((current / goal.target) * 100)) : 0;
                    
                    return (
                      <div 
                        key={goal.id} 
                        onClick={() => handleNavigateToGoal(goal.id)}
                        className="plan-goal-item"
                      >
                        <div className="plan-goal-header">
                          <span className="plan-goal-name">{goal.name}</span>
                          <span className="plan-goal-progress">{progress}%</span>
                        </div>
                        <div className="plan-goal-details">
                          {formatMoney(current)} of {formatMoney(goal.target)}
                          {goal.type === 'debt' && ' (payoff goal)'}
                        </div>
                        {linkedAccountNames.length > 0 && (
                          <div className="plan-goal-linked">
                            Linked: {linkedAccountNames.join(', ')}
                          </div>
                        )}
                        <ProgressBar percent={progress} color={
                          goal.type === 'debt' ? COLORS.debt :
                          goal.type === 'investing' ? COLORS.investing :
                          COLORS.savings
                        } />
                        {goal.note && (
                          <div className="plan-goal-note">
                            "{goal.note}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="plan-actions-section">
                <Button 
                  variant={ButtonVariants.contained}
                  color={ButtonColors.secondary}
                  onClick={handleAddGoal}
                >
                  <Icon name={IconNames.add} size="sm" />
                  Add a Goal
                </Button>
                
              </div>
            </>
          )}
        </div>
      </section>

      {/* Nudges (simple, conditional, compliant) */}
      {(assets > 0 && debts > 0) && (
        <section className="plan-nudge-section">
          <strong>Heads-up:</strong>{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            If more cash flows to high-APR debt, your interest costs could decrease. Educational scenarios only — not financial advice.
          </span>
        </section>
      )}

      {/* Add another way sheet */}
      <Sheet open={open} onClose={() => setOpen(false)} title="Add accounts another way">
        <ConnectChoose 
          onClose={() => setOpen(false)} 
          onComplete={() => { 
            setOpen(false); 
          }} 
        />
      </Sheet>

      {/* Compliance footer */}
      <footer className="plan-footer">
        Educational scenarios only — not financial, legal, or investment advice. Actual results may vary.
      </footer>

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

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        open={qaOpen}
        onClose={() => setQaOpen(false)}
        onAddGoal={() => setGoalModalOpen(true)}
        onConnectAccount={() => setConnectOpen(true)}
        onLogContribution={() => setLogOpen(true)}
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
