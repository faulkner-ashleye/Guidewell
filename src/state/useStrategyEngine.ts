import { useCallback } from 'react';
import { StrategyConfig, StrategyResult } from '../data/types';
import { FinancialCalculations } from '../utils/financialCalculations';

export function useStrategyEngine() {
  const calculateStrategyResult = useCallback((config: StrategyConfig): StrategyResult => {
    const totalMonths = config.timeline;
    const monthlyContribution = config.monthlyContribution;
    const totalContribution = monthlyContribution * totalMonths;
    
    // Real financial calculations based on allocation
    const debtAllocation = monthlyContribution * (config.allocation.debt / 100);
    const savingsAllocation = monthlyContribution * (config.allocation.savings / 100);
    const investmentAllocation = monthlyContribution * (config.allocation.investing / 100);
    
    // Calculate investment growth using real compound interest
    const years = totalMonths / 12;
    const annualReturn = config.riskLevel === 'high' ? 8.5 : config.riskLevel === 'medium' ? 6.0 : 3.5;
    
    const investmentResult = FinancialCalculations.calculateInvestmentGrowth(
      0, // Starting with 0
      investmentAllocation,
      annualReturn,
      years
    );
    
    // Calculate savings growth (conservative rate)
    const savingsResult = FinancialCalculations.calculateInvestmentGrowth(
      0,
      savingsAllocation,
      4.5, // High-yield savings rate
      years
    );
    
    // Total projected value includes all allocations
    const projectedValue = investmentResult.finalValue + savingsResult.finalValue + (debtAllocation * totalMonths);
    const growth = projectedValue - totalContribution;
    
    // Generate realistic monthly breakdown
    const monthlyBreakdown = Array.from({ length: totalMonths }, (_, index) => {
      const month = index + 1;
      const yearIndex = Math.floor((month - 1) / 12);
      
      return {
        month,
        debt: debtAllocation,
        savings: savingsAllocation,
        investing: investmentAllocation,
        total: monthlyContribution,
        // Add cumulative values for better visualization
        cumulativeDebt: debtAllocation * month,
        cumulativeSavings: savingsAllocation * month,
        cumulativeInvestment: investmentAllocation * month,
        cumulativeTotal: monthlyContribution * month
      };
    });
    
    return {
      totalContribution,
      projectedValue,
      growth,
      monthlyBreakdown,
      // Add detailed breakdown for AI analysis
      allocationBreakdown: {
        debt: { amount: debtAllocation * totalMonths, percentage: config.allocation.debt },
        savings: { amount: savingsResult.finalValue, percentage: config.allocation.savings },
        investing: { amount: investmentResult.finalValue, percentage: config.allocation.investing }
      },
      riskMetrics: {
        annualReturn,
        volatility: config.riskLevel === 'high' ? 'high' : config.riskLevel === 'medium' ? 'medium' : 'low',
        expectedGrowth: growth
      }
    };
  }, []);

  const generateNarrative = useCallback((config: StrategyConfig, result: StrategyResult): string => {
    const { name, timeline, monthlyContribution, allocation } = config;
    const { projectedValue, growth } = result;
    
    return `This scenario shows how ${name} could work over ${timeline} months. 
    With a monthly contribution of $${monthlyContribution.toLocaleString()}, you might allocate 
    ${allocation.debt}% to debt payoff, ${allocation.savings}% to savings, and ${allocation.investing}% to investments. 
    This could potentially grow your money to approximately $${projectedValue.toLocaleString()}, 
    representing a growth of $${growth.toLocaleString()}. Remember, these are educational scenarios 
    and actual results may vary significantly.`;
  }, []);

  return {
    calculateStrategyResult,
    generateNarrative
  };
}

