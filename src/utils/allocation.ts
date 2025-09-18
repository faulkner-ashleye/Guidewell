import { StrategyConfig } from '../data/types';

export function validateAllocation(allocation: StrategyConfig['allocation']): boolean {
  const total = allocation.debt + allocation.savings + allocation.investment;
  return Math.abs(total - 100) < 0.01; // Allow for small floating point errors
}

export function normalizeAllocation(allocation: StrategyConfig['allocation']): StrategyConfig['allocation'] {
  const total = allocation.debt + allocation.savings + allocation.investment;
  if (total === 0) return { debt: 33.33, savings: 33.33, investment: 33.34 };
  
  return {
    debt: (allocation.debt / total) * 100,
    savings: (allocation.savings / total) * 100,
    investment: (allocation.investment / total) * 100
  };
}

export function getRecommendedAllocation(riskTolerance: 'conservative' | 'moderate' | 'aggressive'): StrategyConfig['allocation'] {
  switch (riskTolerance) {
    case 'conservative':
      return { debt: 50, savings: 30, investment: 20 };
    case 'moderate':
      return { debt: 40, savings: 20, investment: 40 };
    case 'aggressive':
      return { debt: 30, savings: 10, investment: 60 };
    default:
      return { debt: 40, savings: 20, investment: 40 };
  }
}

