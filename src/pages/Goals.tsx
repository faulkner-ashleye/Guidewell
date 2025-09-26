import React, { useState } from 'react';
import { Card } from '../components/Card';
import { ProgressChart } from '../components/Charts';
import { Modal } from '../components/Modal';
import { Input, Select } from '../components/Inputs';
import { Chip } from '../components/Chips';
import { formatCurrency } from '../utils/format';
import { useAppState } from '../state/AppStateContext';
import { sampleScenarios, SampleScenarioUtils } from '../data/sampleScenarios';
import './Goals.css';

interface Goal {
  id: string;
  name: string;
  type: 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom';
  target: number;
  currentAmount: number; // Calculated from linked accounts
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
}

export function Goals() {
  const { goals: appGoals, accounts, userProfile } = useAppState();
  
  // Convert app state goals to Goals page format
  const convertAppGoalsToDisplayGoals = (): Goal[] => {
    if (appGoals && appGoals.length > 0) {
      return appGoals.map(appGoal => {
        // Calculate current amount from linked accounts
        let currentAmount = 0;
        if (appGoal.accountId) {
          const account = accounts.find(a => a.id === appGoal.accountId);
          currentAmount = account ? account.balance : 0;
        } else if (appGoal.accountIds && appGoal.accountIds.length > 0) {
          currentAmount = appGoal.accountIds.reduce((sum, accountId) => {
            const account = accounts.find(a => a.id === accountId);
            return sum + (account ? account.balance : 0);
          }, 0);
        }
        
        // Convert app goal type to display goal type
        let displayType: Goal['type'] = 'custom';
        if (appGoal.type === 'debt') displayType = 'debt_payoff';
        else if (appGoal.type === 'savings') displayType = 'emergency_fund';
        else if (appGoal.type === 'investing') displayType = 'investment';
        
        return {
          id: appGoal.id,
          name: appGoal.name,
          type: displayType,
          target: appGoal.target,
          currentAmount: currentAmount,
          targetDate: appGoal.targetDate || '2024-12-31',
          priority: appGoal.priority || 'medium'
        };
      });
    }
    
    // If user has real accounts (not sample data), don't auto-create goals
    // Let them create their own goals based on their actual financial situation
    if (accounts.length > 0 && userProfile?.hasSampleData === false) {
      return []; // Return empty array - user should create their own goals
    }
    
    // Only load sample goals if user is explicitly using sample data
    if (userProfile?.hasSampleData === true) {
      const scenarioId = 'recentGrad';
      const scenario = SampleScenarioUtils.getScenario(scenarioId);
      
      if (scenario && scenario.goals) {
        return scenario.goals.map(goal => ({
          id: goal.id,
          name: goal.name,
          type: goal.type as Goal['type'],
          target: goal.target,
          currentAmount: 0, // Will be calculated from linked accounts
          targetDate: goal.targetDate || '2024-12-31',
          priority: goal.priority || 'medium'
        }));
      }
    }
    
    // Fallback to default goals only if no accounts are connected AND no explicit sample data flag
    if (accounts.length === 0 && userProfile?.hasSampleData !== false) {
      return [
        {
          id: '1',
          name: 'Pay off Credit Card Debt',
          type: 'debt_payoff',
          target: 15000,
          currentAmount: 8500,
          targetDate: '2024-12-31',
          priority: 'high'
        },
        {
          id: '2',
          name: 'Emergency Fund',
          type: 'emergency_fund',
          target: 10000,
          currentAmount: 2500,
          targetDate: '2024-06-30',
          priority: 'high'
        },
        {
          id: '3',
          name: 'Retirement Savings',
          type: 'retirement',
          target: 100000,
          currentAmount: 15000,
          targetDate: '2030-12-31',
          priority: 'medium'
        }
      ];
    }
    
    // If user has real accounts but no goals set up, return empty array
    return [];
  };

  const [goals] = useState<Goal[]>(convertAppGoalsToDisplayGoals());

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'debt_payoff': return '💳';
      case 'emergency_fund': return '🛡️';
      case 'retirement': return '🏖️';
      case 'investment': return '📈';
      default: return '🎯';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingAmount = (current: number, target: number) => {
    return Math.max(target - current, 0);
  };

  return (
    <>
      <div className="goals">
      <div className="goals-header">
        <h1 className="goals-title">Financial Goals</h1>
        <p className="goals-subtitle">
          Track your progress toward achieving your financial objectives
        </p>
      </div>


      <div className="goals-summary">
        <Card className="summary-card">
          <h3>Goals Overview</h3>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-number">{goals.length}</span>
              <span className="stat-label">Active Goals</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">{goals.filter(g => g.priority === 'high').length}</span>
              <span className="stat-label">High Priority</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.currentAmount, 0))}
              </span>
              <span className="stat-label">Total Saved</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="goals-list">
        <div className="goals-header-section">
          <h3>Your Goals</h3>
          <button 
            className="add-goal-button"
            onClick={() => {
              if ((window as any).globalSheets) {
                (window as any).globalSheets.openGoalModal('add');
              }
            }}
          >
            + Add Goal
          </button>
        </div>

        {goals.map((goal) => (
          <Card key={goal.id} className="goal-card">
            <div className="goal-header">
              <div className="goal-icon">{getGoalIcon(goal.type)}</div>
              <div className="goal-info">
                <h4 className="goal-name">{goal.name}</h4>
                <div className="goal-meta">
                  <Chip 
                    label={goal.priority} 
                    variant={getPriorityColor(goal.priority)}
                  />
                  <span className="goal-date">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="goal-progress">
              <ProgressChart
                value={goal.currentAmount}
                max={goal.target}
                label={`${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.target)}`}
              />
            </div>

            <div className="goal-details">
              <div className="goal-detail">
                <span className="detail-label">Progress</span>
                <span className="detail-value">{calculateProgress(goal.currentAmount, goal.target).toFixed(1)}%</span>
              </div>
              <div className="goal-detail">
                <span className="detail-label">Remaining</span>
                <span className="detail-value">{formatCurrency(getRemainingAmount(goal.currentAmount, goal.target))}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
    </>
  );
}
