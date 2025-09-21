import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../../../state/AppStateContext';
import { mergeAccountActivity } from '../../../state/contributionSelectors';
import { computeRunningBalances, formatRunningBalance } from '../../../state/balanceMath';
import { formatCurrency } from '../../../state/selectors';
import AppHeader from '../../components/AppHeader';
import LogContributionModal from '../../components/LogContributionModal';
import { COLORS } from '../../../ui/colors';
import { getTransactionIcon } from '../../../utils/transactionIcons';
import { Icon } from '../../../components/Icon';

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

  // Get account-specific activity
  const accountActivity = account 
    ? mergeAccountActivity(transactions, contributions, accountId, account.name)
    : [];

  // Compute running balances
  const activityWithBalances = account
    ? computeRunningBalances(accountActivity, account.balance, account.type)
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

  if (!account) {
    return (
      <main>
        <AppHeader 
          title="Account Not Found" 
          subtitle="The requested account could not be found"
        />
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>Account not found. Please check the URL and try again.</p>
          <button 
            onClick={handleBack}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
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
        title="Account Details"
        subtitle={account.name}
        leftAction={
          <button 
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px'
            }}
            aria-label="Go back"
          >
            ←
          </button>
        }
      />

      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Top Summary Card */}
        <div style={{
          background: '#1C1C1C',
          border: '1px solid #3C3C3C',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                {account.name}
              </h1>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: account.balance >= 0 ? '#10b981' : '#ef4444'
              }}>
                {formatCurrency(account.balance)}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#B6B6B6',
                marginTop: '4px'
              }}>
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                {account.linked && ' • Digitally Linked'}
              </div>
            </div>
            
            {/* Sparkline placeholder */}
            <div style={{
              width: '120px',
              height: '40px',
              background: 'linear-gradient(45deg, #3C3C3C, #4C4C4C)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B6B6B6',
              fontSize: '12px'
            }}>
              📈 Sparkline
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {!account.linked && (
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setLogOpen(true)}
              style={{
                backgroundColor: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Log Contribution
            </button>
          </div>
        )}

        {/* Recent Activity */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            margin: '0 0 16px 0',
            color: '#FFFFFF'
          }}>
            Recent Activity
          </h2>
          
          {activityWithBalances.length > 0 ? (
            <div style={{
              background: '#1C1C1C',
              border: '1px solid #3C3C3C',
              borderRadius: '12px',
              padding: '20px'
            }}>
              {activityWithBalances.map((item) => {
                // Get the icon for this transaction
                const iconName = getTransactionIcon(item.description);
                
                return (
                  <div key={item.id} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #3C3C3C',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      {/* Transaction Icon */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#2C2C2C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px',
                        flexShrink: 0
                      }}>
                        <Icon 
                          name={iconName} 
                          size="sm" 
                          color="white"
                          style={{ fontSize: '18px' }}
                        />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#FFFFFF',
                          fontWeight: '500',
                          marginBottom: '4px'
                        }}>
                          {item.description}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#B6B6B6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span>{item.date}</span>
                          <span 
                            style={{
                              backgroundColor: item.source === 'linked' ? '#e0f2fe' : '#f0fdf4',
                              color: item.source === 'linked' ? '#0369a1' : '#166534',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '500',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {item.source}
                          </span>
                        </div>
                      </div>
                    </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    {(() => {
                      // Determine if this is a payment for debt accounts (positive activity)
                      const isPayment = item.description.includes('PAYMENT') || 
                                       item.description.includes('CARD PAYMENT') ||
                                       item.description.includes('LOAN PAYMENT') ||
                                       item.description.includes('STUDENT LOAN');
                      
                      // For debt accounts (credit_card, loan), payments are positive activity
                      const isDebtPayment = (account.type === 'credit_card' || account.type === 'loan') && 
                                          isPayment && item.amount < 0;
                      
                      // For checking/savings accounts, payments to debt are positive activity
                      const isDebtPaymentFromChecking = (account.type === 'checking' || account.type === 'savings') && 
                                                       isPayment && item.amount < 0;
                      
                      const isPositiveActivity = item.amount >= 0 || isDebtPayment || isDebtPaymentFromChecking;
                      const displayAmount = item.amount; // Always show original amount
                      const prefix = item.amount >= 0 ? '+' : ''; // Only add + for truly positive amounts
                      const color = isPositiveActivity ? '#10b981' : '#ef4444';
                      
                      return (
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: color,
                          marginBottom: '2px'
                        }}>
                          {prefix}{formatCurrency(displayAmount)}
                        </div>
                      );
                    })()}
                    {item.runningBalance !== undefined && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#B6B6B6'
                      }}>
                        {formatRunningBalance(item.runningBalance)}
                      </div>
                    )}
                  </div>
                  
                  {/* Edit/Delete buttons for manual entries only */}
                  {item.source === 'manual' && (
                    <div style={{ marginLeft: '12px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditContribution(item.id.replace('contribution-', ''), {})}
                        style={{
                          background: 'transparent',
                          border: '1px solid #3C3C3C',
                          color: '#B6B6B6',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContribution(item.id.replace('contribution-', ''))}
                        style={{
                          background: 'transparent',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
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
            <div style={{
              background: '#1C1C1C',
              border: '1px solid #3C3C3C',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#B6B6B6',
              fontStyle: 'italic'
            }}>
              No activity yet. {account.linked ? 'Transactions will appear here when they sync.' : 'Log a contribution to get started.'}
            </div>
          )}
        </div>

        {/* Footer Compliance Line */}
        <div style={{
          background: '#1C1C1C',
          border: '1px solid #3C3C3C',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          color: '#B6B6B6',
          fontSize: '14px'
        }}>
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
    </main>
  );
}
