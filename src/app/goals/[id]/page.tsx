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
import { Modal } from '../../../components/Modal';
import GoalModal from '../../../components/GoalModal';
import { Goal } from '../../../app/types';
import { COLORS } from '../../../ui/colors';
import './GoalDetailPage.css';
import '../../../pages/Settings/Settings.css';

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
  const progress = goal ? computeGoalProgress(goal, accounts, contributions, transactions) : null;

  // Get linked account
  const linkedAccount = goal ? getGoalLinkedAccount(goal, accounts) : null;

  // Get contributions for this goal, filtered by goal type
  const goalContributions = goal ? getContributionsByGoal(contributions, goalId).filter(contrib => {
    // For debt goals, filter based on account type
    if (goal.type === 'debt' || goal.type === 'debt_payoff') {
      // For credit cards: positive amounts are payments, negative amounts are charges
      // For loans: negative amounts are payments, positive amounts are advances
      const linkedAccount = accounts.find(acc => acc.id === goal.accountId);
      if (linkedAccount?.type === 'credit_card') {
        return contrib.amount > 0; // Only show payments for credit cards
      } else {
        return contrib.amount < 0; // Only show payments for loans
      }
    }

    // For savings/investment goals, only show positive contributions
    if (goal.type === 'emergency_fund' || goal.type === 'savings' || goal.type === 'investment') {
      // Show all positive contributions for savings goals (they're all deposits)
      return contrib.amount > 0;
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
  console.log('All transactions:', transactions.length);
  console.log('Transactions for this goal account:', transactions.filter(tx => tx.account_id === goal?.accountId));

  // Get account activity for linked goals, filtered by goal type and limited to recent activity
  const accountActivity = linkedAccount ? mergeAccountActivity(
    transactions,
    contributions,
    linkedAccount.id,
    linkedAccount.name
  ).filter(item => {
    // For debt goals, filter based on account type
    if (goal?.type === 'debt' || goal?.type === 'debt_payoff') {
      // For credit cards: positive amounts are payments, negative amounts are charges
      // For loans: negative amounts are payments, positive amounts are advances
      if (linkedAccount?.type === 'credit_card') {
        return item.amount > 0; // Only show payments for credit cards
      } else {
        return item.amount < 0; // Only show payments for loans
      }
    }

    // For savings/investment goals, only show positive contributions
    if (goal?.type === 'emergency_fund' || goal?.type === 'savings' || goal?.type === 'investment') {
      // Show all positive transactions for savings goals (they're all deposits)
      return item.amount > 0;
    }

    // For other goal types, show all activity
    return true;
  }).slice(0, 5) : []; // Show 5 most recent transactions

  // Debug logging for account activity
  if (linkedAccount) {
    console.log('Linked account:', linkedAccount.name);
    console.log('All account activity:', mergeAccountActivity(transactions, contributions, linkedAccount.id, linkedAccount.name));
    console.log('Filtered account activity:', accountActivity);
    console.log('Total filtered account activity:', accountActivity.reduce((sum, a) => sum + a.amount, 0));
    console.log('Account balance:', linkedAccount.balance);
    console.log('Progress current:', progress?.current);

    // Log each filtered transaction individually
    accountActivity.forEach((item, index) => {
      console.log(`Transaction ${index + 1}:`, {
        description: item.description,
        amount: item.amount,
        date: item.date,
        category: item.category,
        source: item.source
      });
    });
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
    if (goal && progress) {
      setEditedGoal({
        ...goal,
        target: progress.target // Use computed target instead of raw goal.target
      });
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

  return (
    <main>
      {!goal || !progress ? (
        <>
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
        </>
      ) : (
        <>
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
      />

      <div className="goal-detail-page">
        {/* Goal Header */}
        <div className="goal-header">
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
          onEditGoal={handleEditGoal}
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
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="no-activity shadow-sm">
              {linkedAccount ? (
                `No recent activity yet. This goal is linked to your ${linkedAccount.name} account (current balance: ${formatCurrency(linkedAccount.balance)}). Recent transactions will appear here.`
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
      <GoalModal
        open={editOpen}
        onClose={handleCancelEdit}
        onUpdate={handleSaveGoal}
        accounts={accounts}
        existingGoal={editedGoal || undefined}
        mode="edit"
        useSheet={false}
      />
        </>
      )}
    </main>
  );
}
