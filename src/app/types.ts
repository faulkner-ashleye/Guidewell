export type GoalType = 'savings' | 'debt' | 'investing' | 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  accountId?: string;          // primary linked account (optional, for backward compatibility)
  accountIds?: string[];       // multiple linked accounts (optional)
  target: number;              // target amount (for debt, target is 0; we still store >0 for payoff progress calc if you prefer)
  targetDate?: string;         // ISO yyyy-mm-dd
  monthlyContribution?: number;
  priority?: 'low' | 'medium' | 'high';
  note?: string;               // motivation
  createdAt: string;           // ISO
}

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
  type: AccountType;
  name: string;
  balance: number;
  apr?: number;
  minPayment?: number;
  goalTarget?: number;
  monthlyDirectDeposit?: number;
  linked?: boolean; // Whether account is digitally linked (vs manual)
  creditLimit?: number; // For credit cards
  institutionId?: string; // Plaid institution ID
  institutionName?: string; // Institution name from Plaid
}

