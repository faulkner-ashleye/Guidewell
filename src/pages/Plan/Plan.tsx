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
    <main style={{ 
      background: COLORS.bg, 
      color: COLORS.text, 
      padding: 16, 
      display: 'grid', 
      gap: 16,
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      <AppHeader
        title="Plan"
        subtitle="Accounts & Goals"
        rightAction={<QuickActionsButton onClick={() => setQaOpen(true)} />}
      />

      {/* Overview: Net worth cards + stacked area */}
      <section style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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
      <section style={{ 
        background: COLORS.card, 
        border: `1px solid ${COLORS.border}`, 
        borderRadius: 12 
      }}>
        {/* Tab Headers */}
        <div style={{ 
          display: 'flex', 
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.bg
        }}>
          <button
            onClick={() => setActiveTab('accounts')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'accounts' ? COLORS.card : 'transparent',
              color: activeTab === 'accounts' ? COLORS.text : COLORS.textMuted,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'accounts' ? '600' : '500',
              borderBottom: activeTab === 'accounts' ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              borderRadius: '12px 12px 0 0'
            }}
          >
            Accounts
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'goals' ? COLORS.card : 'transparent',
              color: activeTab === 'goals' ? COLORS.text : COLORS.textMuted,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'goals' ? '600' : '500',
              borderBottom: activeTab === 'goals' ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              borderRadius: '12px 12px 0 0'
            }}
          >
            Goals
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: 16 }}>
          {activeTab === 'accounts' ? (
            <>
              {accounts.length === 0 ? (
                <div style={{ 
                  padding: 24, 
                  textAlign: 'center', 
                  color: COLORS.textMuted
                }}>
                  No accounts yet — connect one to begin.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(['checking','savings','investment','credit_card','loan'] as const).map((type) => {
                    const list = groups[type] || [];
                    if (list.length === 0) return null;
                    const title = type === 'credit_card' ? 'Credit Cards' : 
                                 type.charAt(0).toUpperCase() + type.slice(1) + (type.endsWith('s') ? '' : 's');
                    return (
                      <div key={type}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{ 
                            margin: 0, 
                            fontSize: 16, 
                            color: COLORS.text,
                            textTransform: 'capitalize'
                          }}>
                            {title} ({list.length})
                          </h3>
                          <span style={{ 
                            color: COLORS.textMuted, 
                            fontWeight: 600, 
                            fontSize: 14 
                          }}>
                            {formatMoney(sumBalances(list, [type as any]))}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {list.map((a) => (
                            <div key={a.id} style={{
                              background: COLORS.bg,
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 8,
                              padding: 12
                            }}>
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
              
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <PlaidLinkButton 
                  key="plaid-link-plan"
                  userId="demo-user-123"
                  onSuccess={(linked) => { 
                    clearSampleData();
                    setAccounts(linked); 
                  }} 
                />
                <button 
                  onClick={() => setOpen(true)}
                  style={{
                    backgroundColor: 'transparent',
                    color: COLORS.textMuted,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  Add accounts another way
                </button>
              </div>
            </>
          ) : (
            <>
              {goals.length === 0 ? (
                <div style={{ 
                  padding: 24, 
                  textAlign: 'center', 
                  color: COLORS.textMuted
                }}>
                  No goals yet — add one to get started.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                        style={{
                          background: COLORS.bg,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          padding: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.bg;
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: COLORS.text, fontWeight: 500 }}>{goal.name}</span>
                          <span style={{ color: COLORS.text, fontWeight: 600 }}>{progress}%</span>
                        </div>
                        <div style={{ color: COLORS.textMuted, fontSize: 12 }}>
                          {formatMoney(current)} of {formatMoney(goal.target)}
                          {goal.type === 'debt' && ' (payoff goal)'}
                        </div>
                        {linkedAccountNames.length > 0 && (
                          <div style={{ color: COLORS.textMuted, fontSize: 11 }}>
                            Linked: {linkedAccountNames.join(', ')}
                          </div>
                        )}
                        <ProgressBar percent={progress} color={
                          goal.type === 'debt' ? COLORS.debt :
                          goal.type === 'investing' ? COLORS.investing :
                          COLORS.savings
                        } />
                        {goal.note && (
                          <div style={{ color: COLORS.textMuted, fontSize: 11, fontStyle: 'italic' }}>
                            "{goal.note}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <button 
                  onClick={handleAddGoal}
                  style={{
                    backgroundColor: COLORS.savings,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  + Add a Goal
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Nudges (simple, conditional, compliant) */}
      {(assets > 0 && debts > 0) && (
        <section style={{ 
          background: COLORS.card, 
          border: `1px solid ${COLORS.border}`, 
          borderRadius: 12, 
          padding: 12 
        }}>
          <strong>Heads-up:</strong>{' '}
          <span style={{ color: COLORS.textMuted }}>
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
      <footer style={{ color: COLORS.textMuted, fontSize: 12 }}>
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
        <div style={{ display:'grid', gap:12 }}>
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
