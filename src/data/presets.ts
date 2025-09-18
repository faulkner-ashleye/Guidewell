import { StrategyPreset } from './types';

export const strategyPresets: StrategyPreset[] = [
  {
    id: 'debt_snowball',
    name: 'Debt Snowball',
    description: 'Pay off smallest debts first to build momentum',
    type: 'debt_payoff',
    defaultTimeline: 24,
    defaultAllocation: { debt: 80, savings: 10, investment: 10 },
    riskLevel: 'low'
  },
  {
    id: 'emergency_first',
    name: 'Emergency Fund First',
    description: 'Build 3-6 months of expenses before investing',
    type: 'emergency_fund',
    defaultTimeline: 12,
    defaultAllocation: { debt: 20, savings: 70, investment: 10 },
    riskLevel: 'low'
  },
  {
    id: 'balanced_growth',
    name: 'Balanced Growth',
    description: 'Balance debt payoff with long-term investing',
    type: 'investment',
    defaultTimeline: 36,
    defaultAllocation: { debt: 40, savings: 20, investment: 40 },
    riskLevel: 'medium'
  },
  {
    id: 'aggressive_invest',
    name: 'Aggressive Investing',
    description: 'Minimize debt payments, maximize investment growth',
    type: 'investment',
    defaultTimeline: 60,
    defaultAllocation: { debt: 20, savings: 10, investment: 70 },
    riskLevel: 'high'
  }
];

