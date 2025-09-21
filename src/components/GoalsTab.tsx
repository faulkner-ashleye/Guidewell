import React from 'react';
import { useAppState } from '../state/AppStateContext';
import { GoalList } from './GoalList';
import { COLORS } from '../ui/colors';

export function GoalsTab() {
  const { accounts = [] } = useAppState();
  
  const hasAccounts = accounts.length > 0;
  const hasGoals = accounts.some(account => 
    account.type === 'savings' && 
    account.goalTarget && 
    account.goalTarget > 0
  );

  return (
    <div className="goals-tab">
      <div className="goals-header">
        <h2>Goals & Targets</h2>
        <p style={{ color: COLORS.textMuted }}>
          Set and track your financial goals to guide your strategy.
        </p>
      </div>

      <GoalList accounts={accounts} />
      
      <button 
        className="add-goal-btn"
        style={{
          backgroundColor: COLORS.savings,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          marginTop: '16px',
          transition: 'all 0.2s ease'
        }}
      >
        Add a Goal
      </button>

      {/* Coach Note for Goals */}
      {hasAccounts && !hasGoals && (
        <div className="coach-note" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <p style={{ color: COLORS.text, margin: 0 }}>
            Add a goal so I can tailor scenarios to you. Goals help create personalized financial strategies.
          </p>
        </div>
      )}

      {hasAccounts && hasGoals && (
        <div className="coach-note" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <p style={{ color: COLORS.text, margin: 0 }}>
            Nice—your plan is shaping up. Explore strategies to see educational trade-offs.
          </p>
        </div>
      )}

      {!hasAccounts && (
        <div className="coach-note" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <p style={{ color: COLORS.text, margin: 0 }}>
            Connect accounts first to set meaningful goals based on your actual financial situation.
          </p>
        </div>
      )}
    </div>
  );
}








