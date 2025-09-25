export type AccountType = 
  // Depository accounts
  | 'checking' | 'savings' | 'money_market' | 'cd' | 'cash_management' | 'prepaid' | 'hsa' | 'gic'
  // Credit accounts  
  | 'credit_card' | 'line_of_credit' | 'overdraft'
  // Investment accounts
  | '401a' | '401k' | '403b' | '457b' | '529' | 'brokerage' | 'esa' | 'ira' | 'isa' | 'lira' | 'rif' | 'rsp' | 'pension' | 'profit_sharing' | 'roth_ira' | 'roth_401k' | 'sep_ira' | 'simple_ira' | 'sipp' | 'stock_plan' | 'tsp' | 'tfsa' | 'custodial' | 'variable_annuity'
  // Loan accounts
  | 'auto' | 'commercial' | 'construction' | 'consumer' | 'home_equity' | 'mortgage' | 'student'
  // Legacy/fallback types
  | 'loan' | 'investment' | 'debt';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  interestRate?: number;
  monthlyContribution?: number;
  creditLimit?: number; // For credit cards
}

export interface Goal {
  id: string;
  name: string;
  type: 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom';
  accountId?: string;          // primary linked account (optional, for backward compatibility)
  accountIds?: string[];       // multiple linked accounts (optional)
  target: number;              // target amount (for debt, target is 0; we still store >0 for payoff progress calc if you prefer)
  targetDate?: string;         // ISO yyyy-mm-dd
  monthlyContribution?: number;
  priority?: 'low' | 'medium' | 'high';
  note?: string;               // motivation
  createdAt: string;           // ISO
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  income: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  financialGoals: string[];
  accounts: Account[];
}

export interface StrategyConfig {
  id: string;
  name: string;
  type: 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom';
  timeline: number; // months
  monthlyContribution: number;
  allocation: {
    debt: number;
    savings: number;
    investing: number;
  };
  targetAmount?: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface StrategyResult {
  totalContribution: number;
  projectedValue: number;
  growth: number;
  monthlyBreakdown: {
    month: number;
    debt: number;
    savings: number;
    investing: number;
    total: number;
    cumulativeDebt: number;
    cumulativeSavings: number;
    cumulativeInvestment: number;
    cumulativeTotal: number;
  }[];
  allocationBreakdown?: {
    debt: { amount: number; percentage: number };
    savings: { amount: number; percentage: number };
    investing: { amount: number; percentage: number };
  };
  riskMetrics?: {
    annualReturn: number;
    volatility: 'low' | 'medium' | 'high';
    expectedGrowth: number;
  };
}

export interface StrategyPreset {
  id: string;
  name: string;
  description: string;
  type: StrategyConfig['type'];
  defaultTimeline: number;
  defaultAllocation: StrategyConfig['allocation'];
  riskLevel: StrategyConfig['riskLevel'];
}

