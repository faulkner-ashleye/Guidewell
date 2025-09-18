import { Account, Goal } from '../data/types';

// Financial calculation result interfaces
export interface DebtPayoffResult {
  monthsToPayoff: number;
  totalPaid: number;
  totalInterest: number;
  monthlyPayment: number;
  payoffDate: string;
  interestSavings?: number; // Compared to minimum payments
}

export interface InvestmentResult {
  finalValue: number;
  totalContributed: number;
  growth: number;
  monthlyReturn: number;
  annualReturn: number;
  projectedValueByYear: { year: number; value: number }[];
}

export interface EmergencyFundResult {
  targetAmount: number;
  remainingAmount: number;
  monthsToComplete: number;
  isComplete: boolean;
  recommendedMonthlyContribution: number;
}

export interface OpportunityAnalysis {
  type: 'savings_rate' | 'balance_transfer' | 'debt_consolidation' | 'investment_allocation';
  accountId: string;
  currentValue: number;
  potentialValue: number;
  potentialSavings: number;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

export class FinancialCalculations {
  /**
   * Calculate debt payoff using amortization formula
   * Handles both fixed payment and minimum payment scenarios
   */
  static calculateDebtPayoff(
    balance: number,
    apr: number,
    monthlyPayment: number,
    minimumPayment?: number
  ): DebtPayoffResult {
    if (balance <= 0 || monthlyPayment <= 0) {
      throw new Error('Balance and monthly payment must be positive');
    }

    const monthlyRate = apr / 100 / 12;
    
    // Calculate months to payoff with given payment
    const monthsToPayoff = Math.ceil(
      -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate)
    );
    
    const totalPaid = monthlyPayment * monthsToPayoff;
    const totalInterest = totalPaid - balance;
    
    // Calculate payoff date
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff);
    
    // Calculate interest savings vs minimum payment
    let interestSavings: number | undefined;
    if (minimumPayment && minimumPayment < monthlyPayment) {
      const minPayoffResult = this.calculateDebtPayoff(balance, apr, minimumPayment);
      interestSavings = minPayoffResult.totalInterest - totalInterest;
    }
    
    return {
      monthsToPayoff,
      totalPaid,
      totalInterest,
      monthlyPayment,
      payoffDate: payoffDate.toISOString().split('T')[0],
      interestSavings
    };
  }

  /**
   * Calculate investment growth using compound interest formula
   * Accounts for monthly contributions and varying returns
   */
  static calculateInvestmentGrowth(
    initialAmount: number,
    monthlyContribution: number,
    annualReturn: number,
    years: number,
    contributionIncrease?: number // Annual increase in contributions
  ): InvestmentResult {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    
    let finalValue = initialAmount * Math.pow(1 + monthlyRate, totalMonths);
    let totalContributed = initialAmount;
    
    const projectedValueByYear: { year: number; value: number }[] = [];
    
    for (let month = 1; month <= totalMonths; month++) {
      // Calculate contribution for this month (with annual increases)
      const yearIndex = Math.floor((month - 1) / 12);
      const currentContribution = contributionIncrease 
        ? monthlyContribution * Math.pow(1 + contributionIncrease / 100, yearIndex)
        : monthlyContribution;
      
      // Add contribution and apply growth
      finalValue += currentContribution * Math.pow(1 + monthlyRate, totalMonths - month);
      totalContributed += currentContribution;
      
      // Record yearly projections
      if (month % 12 === 0) {
        projectedValueByYear.push({
          year: yearIndex + 1,
          value: finalValue
        });
      }
    }
    
    const growth = finalValue - totalContributed;
    
    return {
      finalValue,
      totalContributed,
      growth,
      monthlyReturn: monthlyRate,
      annualReturn,
      projectedValueByYear
    };
  }

  /**
   * Calculate emergency fund requirements and timeline
   */
  static calculateEmergencyFund(
    monthlyExpenses: number,
    targetMonths: number,
    currentSavings: number,
    monthlyContribution?: number
  ): EmergencyFundResult {
    const targetAmount = monthlyExpenses * targetMonths;
    const remainingAmount = Math.max(0, targetAmount - currentSavings);
    const isComplete = remainingAmount === 0;
    
    let monthsToComplete = 0;
    let recommendedMonthlyContribution = 0;
    
    if (!isComplete && monthlyContribution) {
      monthsToComplete = Math.ceil(remainingAmount / monthlyContribution);
      recommendedMonthlyContribution = monthlyContribution;
    } else if (!isComplete) {
      // Recommend 10% of monthly expenses as minimum contribution
      recommendedMonthlyContribution = monthlyExpenses * 0.1;
      monthsToComplete = Math.ceil(remainingAmount / recommendedMonthlyContribution);
    }
    
    return {
      targetAmount,
      remainingAmount,
      monthsToComplete,
      isComplete,
      recommendedMonthlyContribution
    };
  }

  /**
   * Calculate optimal debt payoff strategy (snowball vs avalanche)
   */
  static calculateOptimalDebtStrategy(debts: Account[]): {
    snowball: { totalInterest: number; payoffOrder: Account[] };
    avalanche: { totalInterest: number; payoffOrder: Account[] };
    recommendation: 'snowball' | 'avalanche';
    savings: number;
  } {
    const debtAccounts = debts.filter(account => 
      account.type === 'loan' || account.type === 'credit_card'
    );
    
    if (debtAccounts.length === 0) {
      throw new Error('No debt accounts found');
    }

    // Sort by balance (snowball) and by APR (avalanche)
    const snowballOrder = [...debtAccounts].sort((a, b) => a.balance - b.balance);
    const avalancheOrder = [...debtAccounts].sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0));
    
    // Calculate total interest for each strategy
    const snowballInterest = this.calculateStrategyInterest(snowballOrder);
    const avalancheInterest = this.calculateStrategyInterest(avalancheOrder);
    
    const savings = snowballInterest - avalancheInterest;
    const recommendation = savings > 0 ? 'avalanche' : 'snowball';
    
    return {
      snowball: { totalInterest: snowballInterest, payoffOrder: snowballOrder },
      avalanche: { totalInterest: avalancheInterest, payoffOrder: avalancheOrder },
      recommendation,
      savings: Math.abs(savings)
    };
  }

  /**
   * Calculate total interest paid for a debt payoff strategy
   */
  private static calculateStrategyInterest(debtOrder: Account[]): number {
    let totalInterest = 0;
    let availablePayment = 0; // Assume $500/month extra payment
    
    debtOrder.forEach(debt => {
      const minimumPayment = debt.monthlyContribution || (debt.balance * 0.02); // 2% minimum
      const payoffResult = this.calculateDebtPayoff(
        debt.balance,
        debt.interestRate || 0,
        minimumPayment + availablePayment
      );
      totalInterest += payoffResult.totalInterest;
      availablePayment += minimumPayment; // Add minimum payment to next debt
    });
    
    return totalInterest;
  }

  /**
   * Calculate net worth and financial health metrics
   */
  static calculateFinancialHealth(accounts: Account[]): {
    netWorth: number;
    totalAssets: number;
    totalDebt: number;
    debtToIncomeRatio?: number;
    emergencyFundMonths?: number;
    healthScore: number; // 0-100
  } {
    const assets = accounts.filter(a => 
      ['checking', 'savings', 'investment'].includes(a.type)
    );
    const debts = accounts.filter(a => 
      ['loan', 'credit_card'].includes(a.type)
    );
    
    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalDebt = debts.reduce((sum, a) => sum + a.balance, 0);
    const netWorth = totalAssets - totalDebt;
    
    // Calculate health score (simplified)
    let healthScore = 50; // Base score
    
    if (netWorth > 0) healthScore += 20;
    if (totalDebt === 0) healthScore += 20;
    if (assets.length > debts.length) healthScore += 10;
    
    return {
      netWorth,
      totalAssets,
      totalDebt,
      healthScore: Math.min(100, Math.max(0, healthScore))
    };
  }

  /**
   * Calculate goal progress and recommendations
   */
  static calculateGoalProgress(goal: Goal, accounts: Account[]): {
    progressPercentage: number;
    monthsRemaining: number;
    recommendedMonthlyContribution: number;
    isOnTrack: boolean;
    accelerationNeeded: number; // Additional monthly contribution needed
  } {
    const progressPercentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    
    const targetDate = new Date(goal.targetDate);
    const currentDate = new Date();
    const monthsRemaining = Math.max(0, 
      (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
      (targetDate.getMonth() - currentDate.getMonth())
    );
    
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const recommendedMonthlyContribution = monthsRemaining > 0 
      ? remainingAmount / monthsRemaining 
      : 0;
    
    // Check if on track (assuming current contribution rate)
    const currentMonthlyContribution = accounts
      .filter(a => a.type === goal.type)
      .reduce((sum, a) => sum + (a.monthlyContribution || 0), 0);
    
    const isOnTrack = currentMonthlyContribution >= recommendedMonthlyContribution;
    const accelerationNeeded = Math.max(0, recommendedMonthlyContribution - currentMonthlyContribution);
    
    return {
      progressPercentage,
      monthsRemaining,
      recommendedMonthlyContribution,
      isOnTrack,
      accelerationNeeded
    };
  }
}

// Utility functions for common calculations
export const FinancialUtils = {
  /**
   * Format currency with proper locale
   */
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  /**
   * Format percentage
   */
  formatPercentage: (rate: number, decimals: number = 1): string => {
    return `${rate.toFixed(decimals)}%`;
  },

  /**
   * Calculate monthly payment from annual rate
   */
  monthlyRateFromAnnual: (annualRate: number): number => {
    return annualRate / 100 / 12;
  },

  /**
   * Calculate annual rate from monthly rate
   */
  annualRateFromMonthly: (monthlyRate: number): number => {
    return monthlyRate * 12 * 100;
  },

  /**
   * Calculate compound annual growth rate (CAGR)
   */
  calculateCAGR: (beginningValue: number, endingValue: number, years: number): number => {
    return Math.pow(endingValue / beginningValue, 1 / years) - 1;
  }
};
