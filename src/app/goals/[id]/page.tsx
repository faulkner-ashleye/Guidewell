import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../../../state/AppStateContext';
import { getContributionsByGoal, mergeAccountActivity } from '../../../state/contributionSelectors';
import {
  computeGoalProgress,
  getGoalLinkedAccount,
  formatPercentage,
  formatCurrency
} from '../../../state/goalSelectors';
import { formatDate } from '../../../utils/format';
import { Icon, IconNames, IconName } from '../../../components/Icon';
import { GoalCard } from '../../../components/GoalCard';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import AppHeader from '../../components/AppHeader';
import LogContributionModal from '../../components/LogContributionModal';
import { Goal } from '../../../app/types';
import { COLORS } from '../../../ui/colors';
import './GoalDetailPage.css';

export default function GoalDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const goalId = params.id as string;

  const {
    goals = [],
    accounts = [],
    contributions = [],
    transactions = [],
    setContributions,
    setGoals
  } = useAppState();

  const [logOpen, setLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Goal | null>(null);

  // Find the goal
  const goal = goals.find(g => g.id === goalId);

  // Get goal progress
  const progress = goal ? computeGoalProgress(goal, accounts, contributions) : null;

  // Get linked account
  const linkedAccount = goal ? getGoalLinkedAccount(goal, accounts) : null;

  // Get contributions for this goal, filtered by goal type
  const goalContributions = goal ? getContributionsByGoal(contributions, goalId).filter(contrib => {
    // For debt goals, only show payments (negative amounts that reduce debt)
    if (goal.type === 'debt' || goal.type === 'debt_payoff') {
      // Only show actual debt payments, not all negative contributions
      const isDebtPayment = contrib.description.toLowerCase().includes('payment') ||
                           contrib.description.toLowerCase().includes('loan') ||
                           contrib.description.toLowerCase().includes('credit') ||
                           contrib.description.toLowerCase().includes('student') ||
                           contrib.description.toLowerCase().includes('debt');
      return contrib.amount < 0 && isDebtPayment;
    }
    
    // For savings/investment goals, only show positive contributions
    if (goal.type === 'emergency_fund' || goal.type === 'savings' || goal.type === 'investment') {
      // Only show actual savings contributions, not all positive contributions
      const isSavingsContribution = contrib.description.toLowerCase().includes('deposit') ||
                                   contrib.description.toLowerCase().includes('contribution') ||
                                   contrib.description.toLowerCase().includes('transfer') ||
                                   contrib.description.toLowerCase().includes('savings') ||
                                   contrib.description.toLowerCase().includes('emergency') ||
                                   contrib.description.toLowerCase().includes('fund') ||
                                   contrib.description.toLowerCase().includes('investment');
      return contrib.amount > 0 && isSavingsContribution;
    }
    
    // For other goal types, show all contributions
    return true;
  }) : [];

  // Debug logging
  console.log('Goal:', goal?.name, 'Type:', goal?.type);
  console.log('Progress:', progress);
  console.log('All contributions for this goal:', getContributionsByGoal(contributions, goalId));
  console.log('Filtered contributions:', goalContributions);
  console.log('Total filtered contributions:', goalContributions.reduce((sum, c) => sum + c.amount, 0));

  // Get account activity for linked goals, filtered by goal type
  const accountActivity = linkedAccount ? mergeAccountActivity(
    transactions,
    contributions,
    linkedAccount.id,
    linkedAccount.name
  ).filter(item => {
    // For debt goals, only show payments (negative amounts that reduce debt)
    if (goal?.type === 'debt' || goal?.type === 'debt_payoff') {
      // Only show actual debt payments, not all negative transactions
      const isDebtPayment = item.description.toLowerCase().includes('payment') ||
                           item.description.toLowerCase().includes('loan') ||
                           item.description.toLowerCase().includes('credit') ||
                           item.description.toLowerCase().includes('student');
      return item.amount < 0 && isDebtPayment;
    }
    
    // For savings/investment goals, only show positive contributions
    if (goal?.type === 'emergency_fund' || goal?.type === 'savings' || goal?.type === 'investment') {
      // Only show actual savings contributions, not all positive transactions
      const isSavingsContribution = item.description.toLowerCase().includes('deposit') ||
                                   item.description.toLowerCase().includes('contribution') ||
                                   item.description.toLowerCase().includes('transfer') ||
                                   item.description.toLowerCase().includes('savings') ||
                                   item.description.toLowerCase().includes('emergency') ||
                                   item.description.toLowerCase().includes('fund');
      return item.amount > 0 && isSavingsContribution;
    }
    
    // For other goal types, show all activity
    return true;
  }) : [];

  // Debug logging for account activity
  if (linkedAccount) {
    console.log('Linked account:', linkedAccount.name);
    console.log('All account activity:', mergeAccountActivity(transactions, contributions, linkedAccount.id, linkedAccount.name));
    console.log('Filtered account activity:', accountActivity);
    console.log('Total filtered account activity:', accountActivity.reduce((sum, a) => sum + a.amount, 0));
  }

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle contribution logging
  const handleLogContribution = (contribution: any) => {
    const newContribution = {
      id: `contrib-${Date.now()}`,
      accountId: contribution.accountId || goal?.accountId || '',
      amount: contribution.amount,
      date: contribution.date,
      description: contribution.description,
      goalId: goalId,
      createdAt: new Date().toISOString()
    };

    setContributions(prev => [...prev, newContribution]);
    setLogOpen(false);
  };

  // Handle goal editing
  const handleEditGoal = () => {
    if (goal) {
      setEditedGoal({ ...goal });
      setEditOpen(true);
    }
  };

  const handleSaveGoal = () => {
    if (editedGoal) {
      setGoals(prev => prev.map(g => g.id === goalId ? editedGoal : g));
      setEditOpen(false);
      setEditedGoal(null);
    }
  };

  const handleCancelEdit = () => {
    setEditOpen(false);
    setEditedGoal(null);
  };

  // Get goal icon
  const getGoalIcon = (goalName: string): IconName => {
    const name = goalName.toLowerCase();
    if (name.includes('debt') || name.includes('loan') || name.includes('credit')) return IconNames.credit_card;
    if (name.includes('emergency')) return IconNames.security;
    if (name.includes('investment') || name.includes('retirement')) return IconNames.trending_up;
    if (name.includes('house') || name.includes('home')) return IconNames.home;
    if (name.includes('car') || name.includes('vehicle')) return IconNames.directions_car;
    if (name.includes('wedding')) return IconNames.favorite;
    if (name.includes('education') || name.includes('school')) return IconNames.school;
    return IconNames.savings;
  };

  if (!goal || !progress) {
    return (
      <main>
        <AppHeader
          title="Goal Not Found"
        />
        <div className="goal-not-found">
          <p>Goal not found. Please check the URL and try again.</p>
          <button
            onClick={handleBack}
            className="modal-button modal-button-save"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <AppHeader
        title="Goal"
        leftAction={
          <button
            onClick={handleBack}
            className="header-back-button"
            aria-label="Go back"
          >
            <Icon name={IconNames.arrow_back} size="lg" />
          </button>
        }
        rightAction={
          <button
            onClick={handleEditGoal}
            className="header-edit-button"
            aria-label="Edit goal"
          >
            Edit
          </button>
        }
      />

      <div className="goal-detail-page">
        {/* Goal Header */}
        <div className="goal-header">
          <Icon
            name={getGoalIcon(goal.name)}
            size="xl"
          />
          <h1 className="goal-title">{goal.name}</h1>
        </div>

        {/* Goal Card */}
        <GoalCard
          goal={{
            id: goal.id,
            name: goal.name,
            current: progress.current,
            target: progress.target,
            progress: progress.percentage,
            accountId: goal.accountId,
            accountIds: goal.accountIds,
            targetDate: goal.targetDate,
            type: goal.type
          }}
          accounts={accounts}
          showActionButton={false}
          showLogButton={true}
          showHeader={false}
          isLinkedAccount={!!linkedAccount}
          onLogContribution={() => setLogOpen(true)}
          className="goal-detail-card"
        />

        {/* Linked Account Note */}
        {linkedAccount?.linked && (
          <div className="linked-account-note">
            Linked accounts usually update automatically; manual entries are recorded as personal notes.
          </div>
        )}

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>
             Contributions
          </h3>

          {(linkedAccount ? accountActivity : goalContributions).length > 0 ? (
            <div className="activity-feed">
              {(linkedAccount ? accountActivity : goalContributions)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => {
                  const isAccountActivity = linkedAccount && 'source' in item;
                  const contribAccount = accounts.find(acc => acc.id === item.accountId);

                  // Get category name and icon for account activity
                  const categoryName = isAccountActivity ?
                    (item.category || 'Transfer') : 'Manual';
                  const categoryIcon = isAccountActivity ?
                    (item.category === 'Transfer' ? IconNames.refresh : IconNames.account_balance) :
                    IconNames.edit;

                  return (
                    <div key={item.id} className="activity-item">
                      <div className="activity-meta">
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <div className="activity-main shadow-sm">
                        {/* Transaction Icon */}
                        <div className="activity-icon">
                          <Icon
                            name={categoryIcon}
                            size="sm"
                            style={{ fontSize: '18px' }}
                          />
                        </div>

                        <div className="activity">
                          <div className="activity-description">
                            {item.description}
                          </div>
                          <span className="activity-category">
                            {categoryName}
                          </span>
                        </div>

                        <div className="activity-amount">
                          <div className={`amount-value ${item.amount >= 0 ? 'amount-positive' : 'amount-negative'}`}>
                            {item.amount >= 0 ? '+' : ''}{formatCurrency(item.amount)}
                          </div>
                          {linkedAccount && (
                            <div className="running-balance">
                              {formatCurrency(linkedAccount.balance)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="no-activity shadow-sm">
              {linkedAccount ? (
                `No activity yet. This goal is linked to your ${linkedAccount.name} account. Transactions will appear here when they sync.`
              ) : (
                'No contributions logged yet. Log a contribution to get started.'
              )}
            </div>
          )}
        </div>


      </div>

      {/* Log Contribution Modal */}
      <LogContributionModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSave={handleLogContribution}
        accounts={linkedAccount ? [linkedAccount] : accounts}
        goals={[goal]}
        preselectedGoalId={goalId}
        preselectedAccountId={goal.accountId}
      />

      {/* Edit Goal Modal */}
      {editOpen && editedGoal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleCancelEdit}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1C1C1C',
              border: '1px solid #3C3C3C',
              borderRadius: '12px',
              padding: '24px',
              minWidth: '400px',
              maxWidth: '500px',
              width: '100%'
            }}
          >
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#FFFFFF'
            }}>
              Edit Goal
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Goal Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  marginBottom: '6px'
                }}>
                  Goal Name
                </label>
                <input
                  type="text"
                  value={editedGoal.name}
                  onChange={(e) => setEditedGoal({ ...editedGoal, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#2C2C2C',
                    border: '1px solid #3C3C3C',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Target Amount */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  marginBottom: '6px'
                }}>
                  Target Amount
                </label>
                <input
                  type="number"
                  value={editedGoal.target}
                  onChange={(e) => setEditedGoal({ ...editedGoal, target: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#2C2C2C',
                    border: '1px solid #3C3C3C',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Target Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  marginBottom: '6px'
                }}>
                  Target Date
                </label>
                <input
                  type="date"
                  value={editedGoal.targetDate || ''}
                  onChange={(e) => setEditedGoal({ ...editedGoal, targetDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#2C2C2C',
                    border: '1px solid #3C3C3C',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Priority */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  marginBottom: '6px'
                }}>
                  Priority
                </label>
                <select
                  value={editedGoal.priority}
                  onChange={(e) => setEditedGoal({ ...editedGoal, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#2C2C2C',
                    border: '1px solid #3C3C3C',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Monthly Contribution */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  marginBottom: '6px'
                }}>
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  value={editedGoal.monthlyContribution || ''}
                  onChange={(e) => setEditedGoal({ ...editedGoal, monthlyContribution: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#2C2C2C',
                    border: '1px solid #3C3C3C',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Note */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  marginBottom: '6px'
                }}>
                  Note (Optional)
                </label>
                <textarea
                  value={editedGoal.note || ''}
                  onChange={(e) => setEditedGoal({ ...editedGoal, note: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#2C2C2C',
                    border: '1px solid #3C3C3C',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #3C3C3C',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoal}
                disabled={!editedGoal.name || editedGoal.target <= 0}
                style={{
                  padding: '10px 20px',
                  background: editedGoal.name && editedGoal.target > 0 ? COLORS.primary : '#3C3C3C',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: editedGoal.name && editedGoal.target > 0 ? 'pointer' : 'not-allowed',
                  opacity: editedGoal.name && editedGoal.target > 0 ? 1 : 0.5
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
