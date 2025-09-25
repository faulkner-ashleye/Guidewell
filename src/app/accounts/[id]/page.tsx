import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../../../state/AppStateContext';
import { mergeAccountActivity } from '../../../state/contributionSelectors';
import { computeRunningBalances, formatRunningBalance, calculateAccountBalance } from '../../../state/balanceMath';
import { formatCurrency } from '../../../state/selectors';
import { formatDate } from '../../../utils/format';
import AppHeader from '../../components/AppHeader';
import LogContributionModal from '../../components/LogContributionModal';
import { COLORS } from '../../../ui/colors';
import { getTransactionIcon } from '../../../utils/transactionIcons';
import { Icon, IconNames } from '../../../components/Icon';
import { getAccountActivityCategoryName, getAccountActivityCategoryIcon } from '../../../utils/transactionCategories';
import './page.css';


export default function AccountDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const accountId = params.id as string;

  const {
    accounts = [],
    transactions = [],
    contributions = [],
    setContributions
  } = useAppState();

  const [logOpen, setLogOpen] = useState(false);

  // Find the account
  const account = accounts.find(acc => acc.id === accountId);

  // Get account-specific transactions and contributions
  const accountTransactions = transactions.filter(t => t.account_id === accountId);
  const accountContributions = contributions.filter(c => c.accountId === accountId);

  // Calculate dynamic account balance based on transactions
  const dynamicBalance = account
    ? calculateAccountBalance(accountTransactions, accountContributions, account.type, account.balance)
    : 0;

  // Get account-specific activity
  const accountActivity = account
    ? mergeAccountActivity(transactions, contributions, accountId, account.name)
    : [];

  // Compute running balances using dynamic balance
  const activityWithBalances = account
    ? computeRunningBalances(accountActivity, dynamicBalance, account.type)
    : [];

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle contribution logging
  const handleLogContribution = (contribution: any) => {
    const newContribution = {
      id: `contrib-${Date.now()}`,
      accountId: accountId,
      amount: contribution.amount,
      date: contribution.date,
      description: contribution.description,
      goalId: contribution.goalId,
      createdAt: new Date().toISOString()
    };

    setContributions(prev => [...prev, newContribution]);
    setLogOpen(false);
  };

  // Handle contribution deletion (manual entries only)
  const handleDeleteContribution = (contributionId: string) => {
    setContributions(prev => prev.filter(contrib => contrib.id !== contributionId));
  };

  // Handle contribution edit (manual entries only)
  const handleEditContribution = (contributionId: string, updatedData: any) => {
    setContributions(prev => prev.map(contrib =>
      contrib.id === contributionId
        ? { ...contrib, ...updatedData }
        : contrib
    ));
  };

  return (
    <main>
      {!account ? (
        <>
          <AppHeader
            title="Account Not Found"
          />
          <div className="error-container">
            <p>Account not found. Please check the URL and try again.</p>
            <button
              onClick={handleBack}
              className="error-button"
            >
              Go Back
            </button>
          </div>
        </>
      ) : (
        <>
          <AppHeader
            title="Account Details"
            leftAction={
              <button
                onClick={handleBack}
                className="back-button"
                aria-label="Go back"
              >
                <Icon name={IconNames.arrow_back} size="lg" />
              </button>
            }
          />

          <div className="account-detail-page">
        {/* Top Summary Card */}
        <div className="account-summary-card">
          <div className="account-summary-header">
            <div className="account-summary-info">
              <h1>
                {account.name}
              </h1>
              <div className={`account-balance ${dynamicBalance < 0 ? 'negative' : ''}`}>
                {formatCurrency(dynamicBalance)}
              </div>
              {account.type === 'credit_card' && account.creditLimit && (
                <div className="credit-limit-info">
                  <span className="credit-limit-label">Credit Limit:</span>
                  <span className="credit-limit-value">{formatCurrency(account.creditLimit)}</span>
                  <span className="credit-utilization">
                    ({Math.round((Math.abs(dynamicBalance) / account.creditLimit) * 100)}% utilized)
                  </span>
                </div>
              )}
              <div className="account-meta">
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                {account.linked && ' • Digitally Linked'}
              </div>
            </div>

            {/* Sparkline placeholder */}
            <div className="account-sparkline">
              📈 Sparkline
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {!account.linked && (
          <div className="quick-actions">
            <button
              onClick={() => setLogOpen(true)}
              className="log-contribution-button"
            >
              Log Contribution
            </button>
          </div>
        )}

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>
            Recent Activity
          </h2>

          {activityWithBalances.length > 0 ? (
            <div className="activity-feed">
              {activityWithBalances.map((item) => {
                // Get the category name and icon for this transaction
                const categoryName = getAccountActivityCategoryName(item);
                const categoryIcon = getAccountActivityCategoryIcon(item);

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
                      {(() => {
                        // Determine if this is a payment for debt accounts (positive activity)
                        const isPayment = item.description.includes('PAYMENT') ||
                                         item.description.includes('CARD PAYMENT') ||
                                         item.description.includes('LOAN PAYMENT') ||
                                         item.description.includes('STUDENT LOAN');

                        // Check for investment contributions and savings transfers
                        const isInvestmentContribution = item.description.includes('401K') ||
                          item.description.includes('ROTH IRA') ||
                          item.description.includes('INVESTMENT') ||
                          item.description.includes('CONTRIBUTION') ||
                          item.description.includes('COLLEGE FUND') ||
                          item.description.includes('529');
                        const isSavingsTransfer = item.description.includes('TRANSFER') ||
                          item.description.includes('SAVINGS') ||
                          item.description.includes('EMERGENCY FUND');

                        // For debt accounts (credit_card, loan), payments are positive activity
                        const isDebtPayment = (account.type === 'credit_card' || account.type === 'loan') &&
                                            isPayment && item.amount < 0;

                        // For checking/savings accounts, payments to debt are positive activity
                        const isDebtPaymentFromChecking = (account.type === 'checking' || account.type === 'savings') &&
                                                         isPayment && item.amount < 0;

                        const isPositiveActivity = item.amount >= 0 || isDebtPayment || isDebtPaymentFromChecking ||
                                                  isInvestmentContribution || isSavingsTransfer;

                        // Handle display amount and prefix based on activity type
                        let displayAmount = item.amount;
                        let prefix = '';

                        if (isInvestmentContribution || isSavingsTransfer) {
                          // Show as positive amount for investment contributions and savings transfers
                          displayAmount = Math.abs(item.amount);
                          prefix = '+';
                        } else if (item.amount >= 0) {
                          prefix = '+';
                        }

                        const amountClass = isPositiveActivity ? 'amount-positive' : 'amount-negative';

                        return (
                          <div className={`amount-value ${amountClass}`}>
                            {prefix}{formatCurrency(displayAmount)}
                          </div>
                        );
                      })()}
                      {item.runningBalance !== undefined && (
                        <div className="running-balance">
                          {formatRunningBalance(item.runningBalance)}
                        </div>
                      )}
                    </div>

                  </div>
                    {/* Edit/Delete buttons for manual entries only */}
                    {item.source === 'manual' && (
                      <div className="activity-actions">
                        <button
                          onClick={() => handleEditContribution(item.id.replace('contribution-', ''), {})}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteContribution(item.id.replace('contribution-', ''))}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-activity">
              No activity yet. {account.linked ? 'Transactions will appear here when they sync.' : 'Log a contribution to get started.'}
            </div>
          )}
        </div>

          </div>

          {/* Log Contribution Modal */}
          <LogContributionModal
            open={logOpen}
            onClose={() => setLogOpen(false)}
            onSave={handleLogContribution}
            accounts={[account]} // Pre-select this account
            goals={[]} // Could be populated with goals linked to this account
          />
        </>
      )}
    </main>
  );
}
