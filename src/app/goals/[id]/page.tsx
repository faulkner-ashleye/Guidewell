import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../../../state/AppStateContext';
import { getContributionsByGoal } from '../../../state/contributionSelectors';
import { 
  computeGoalProgress, 
  getGoalLinkedAccount, 
  formatPercentage, 
  formatCurrency 
} from '../../../state/goalSelectors';
import AppHeader from '../../components/AppHeader';
import LogContributionModal from '../../components/LogContributionModal';
import { Goal } from '../../../app/types';
import { COLORS } from '../../../ui/colors';

export default function GoalDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const goalId = params.id as string;
  
  const { 
    goals = [], 
    accounts = [], 
    contributions = [], 
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

  // Get contributions for this goal
  const goalContributions = goal ? getContributionsByGoal(contributions, goalId) : [];

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

  if (!goal || !progress) {
    return (
      <main>
        <AppHeader 
          title="Goal Not Found" 
          subtitle="The requested goal could not be found"
        />
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>Goal not found. Please check the URL and try again.</p>
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
        title="Goal"
        subtitle={goal.name}
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
        rightAction={
          <button
            onClick={handleEditGoal}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '500'
            }}
            aria-label="Edit goal"
          >
            Edit
          </button>
        }
      />

      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Snapshot Card */}
        <div style={{
          background: '#1C1C1C',
          border: '1px solid #3C3C3C',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '24px', 
              fontWeight: '600',
              color: '#FFFFFF'
            }}>
              {goal.name}
            </h1>
            {linkedAccount && (
              <div style={{ 
                fontSize: '14px', 
                color: '#B6B6B6',
                marginBottom: '8px'
              }}>
                Linked to: {linkedAccount.name}
              </div>
            )}
            {goal.targetDate && (
              <div style={{ 
                fontSize: '14px', 
                color: '#B6B6B6'
              }}>
                Target Date: {goal.targetDate}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: progress.isComplete ? '#10b981' : '#FFFFFF'
              }}>
                {formatCurrency(progress.current)}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#B6B6B6',
                marginTop: '4px'
              }}>
                of {formatCurrency(progress.target)}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                color: progress.isComplete ? '#10b981' : COLORS.primary
              }}>
                {formatPercentage(progress.percentage)}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#B6B6B6',
                marginTop: '4px'
              }}>
                Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            marginTop: '16px',
            height: '8px',
            background: '#3C3C3C',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(progress.percentage, 100)}%`,
              background: progress.isComplete ? '#10b981' : COLORS.primary,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {progress.remaining > 0 && (
            <div style={{ 
              fontSize: '12px', 
              color: '#B6B6B6',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              {formatCurrency(progress.remaining)} remaining
            </div>
          )}
        </div>

        {/* Log Contribution CTA */}
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
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Log Contribution
          </button>
          
          {linkedAccount?.linked && (
            <div style={{
              fontSize: '12px',
              color: '#B6B6B6',
              textAlign: 'center',
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              Linked accounts usually update automatically; manual entries are recorded as personal notes.
            </div>
          )}
        </div>

        {/* Contributions toward this goal */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            margin: '0 0 16px 0',
            color: '#FFFFFF'
          }}>
            Contributions toward this goal
          </h2>
          
          {goalContributions.length > 0 ? (
            <div style={{
              background: '#1C1C1C',
              border: '1px solid #3C3C3C',
              borderRadius: '12px',
              padding: '20px'
            }}>
              {goalContributions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((contrib) => {
                  const contribAccount = accounts.find(acc => acc.id === contrib.accountId);
                  return (
                    <div key={contrib.id} style={{
                      padding: '12px 0',
                      borderBottom: '1px solid #3C3C3C',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#FFFFFF',
                          fontWeight: '500',
                          marginBottom: '4px'
                        }}>
                          {contrib.description}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#B6B6B6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span>{contrib.date}</span>
                          <span>{contribAccount?.name || 'Unknown Account'}</span>
                          <span 
                            style={{
                              backgroundColor: '#f0fdf4',
                              color: '#166534',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '500',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            Manual
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: contrib.amount >= 0 ? '#10b981' : '#ef4444'
                        }}>
                          {contrib.amount >= 0 ? '+' : ''}{formatCurrency(contrib.amount)}
                        </div>
                      </div>
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
              No contributions logged yet. {linkedAccount ? 'Linked account balance is used for progress tracking.' : 'Log a contribution to get started.'}
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
