import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Disclaimer } from '../components/Disclaimer';
import { ProgressChart } from '../components/Charts';
import { Modal } from '../components/Modal';
import { Input, Select } from '../components/Inputs';
import { Chip } from '../components/Chips';
import { formatCurrency } from '../utils/format';
import './Goals.css';

interface Goal {
  id: string;
  name: string;
  type: 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom';
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
}

export function Goals() {
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Pay off Credit Card Debt',
      type: 'debt_payoff',
      targetAmount: 15000,
      currentAmount: 8500,
      targetDate: '2024-12-31',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Emergency Fund',
      type: 'emergency_fund',
      targetAmount: 10000,
      currentAmount: 2500,
      targetDate: '2024-06-30',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Retirement Savings',
      type: 'retirement',
      targetAmount: 100000,
      currentAmount: 15000,
      targetDate: '2030-12-31',
      priority: 'medium'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '',
    type: 'custom',
    targetAmount: 0,
    currentAmount: 0,
    priority: 'medium'
  });

  const goalTypes = [
    { value: 'debt_payoff', label: 'Debt Payoff' },
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'investment', label: 'Investment' },
    { value: 'custom', label: 'Custom Goal' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

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
    <div className="goals">
      <div className="goals-header">
        <h1 className="goals-title">Financial Goals</h1>
        <p className="goals-subtitle">
          Track your progress toward achieving your financial objectives
        </p>
      </div>

      <Disclaimer />

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
            onClick={() => setShowAddModal(true)}
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
                max={goal.targetAmount}
                label={`${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)}`}
              />
            </div>

            <div className="goal-details">
              <div className="goal-detail">
                <span className="detail-label">Progress</span>
                <span className="detail-value">{calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(1)}%</span>
              </div>
              <div className="goal-detail">
                <span className="detail-label">Remaining</span>
                <span className="detail-value">{formatCurrency(getRemainingAmount(goal.currentAmount, goal.targetAmount))}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Goal"
      >
        <div className="add-goal-form">
          <Input
            label="Goal Name"
            value={newGoal.name || ''}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            placeholder="e.g., Pay off student loans"
          />

          <Select
            label="Goal Type"
            value={newGoal.type || 'custom'}
            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })}
            options={goalTypes}
          />

          <Input
            label="Target Amount"
            type="number"
            value={newGoal.targetAmount || 0}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseInt(e.target.value) || 0 })}
          />

          <Input
            label="Current Amount"
            type="number"
            value={newGoal.currentAmount || 0}
            onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseInt(e.target.value) || 0 })}
          />

          <Select
            label="Priority"
            value={newGoal.priority || 'medium'}
            onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
            options={priorityOptions}
          />

          <div className="modal-actions">
            <button 
              className="modal-button secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button 
              className="modal-button primary"
              onClick={() => {
                // In a real app, this would save the goal
                setShowAddModal(false);
                setNewGoal({ name: '', type: 'custom', targetAmount: 0, currentAmount: 0, priority: 'medium' });
              }}
            >
              Add Goal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
