import React from 'react';
import { useAppState } from '../state/AppStateContext';
import { GoalList } from './GoalList';
import { COLORS } from '../ui/colors';

export function GoalsTab() {
  const { accounts = [], goals = [] } = useAppState();
  
  const hasAccounts = accounts.length > 0;
  const hasGoals = accounts.some(account => 
    account.type === 'savings' && 
    account.goalTarget && 
    account.goalTarget > 0
  );

  return (
    <div className="goals-tab">
      <div className="goals-header">
        <div className="flex items-center justify-between mb-2">
          <h2>Savings Goals</h2>
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: COLORS.primary,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
          </button>
        </div>
        <p style={{ color: COLORS.textMuted }}>
          These are the items you are saving towards.
        </p>
      </div>

      <GoalList accounts={accounts} goals={goals} />

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








