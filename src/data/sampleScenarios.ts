import { Account, Goal } from './types';
import { EnhancedUserProfile } from './enhancedUserProfile';
import { Transaction } from '../lib/supabase';

// Comprehensive sample scenarios for AI testing and demonstration
export interface SampleScenario {
  id: string;
  name: string;
  description: string;
  userProfile: EnhancedUserProfile;
  accounts: Account[];
  goals: Goal[];
  transactions: Transaction[];
  expectedOpportunities: string[];
  aiContext: string;
}

export const sampleScenarios: Record<string, SampleScenario> = {
  recentGrad: {
    id: 'recent-grad-001',
    name: 'Recent Graduate',
    description: 'Just graduated college, starting first job, dealing with student loans and credit card debt',
    userProfile: {
      id: 'recent-grad-001',
      firstName: 'Alex',
      age: 24,
      ageRange: '20-25',
      income: 45000,
      monthlyExpenses: 2800,
      riskTolerance: 'conservative',
      financialLiteracy: 'beginner',
      mainGoals: ['pay_down_debt', 'build_emergency'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'simple',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-001',
        name: 'Associated Bank Access Checking',
        type: 'checking',
        balance: 2500,
        monthlyContribution: 0
      },
      {
        id: 'student-loan-001',
        name: 'Federal Student Loan',
        type: 'loan',
        balance: 32000,
        interestRate: 6.8,
        monthlyContribution: 350
      },
      {
        id: 'credit-card-001',
        name: 'Discover Credit Card',
        type: 'credit_card',
        balance: 2800,
        interestRate: 18.9,
        monthlyContribution: 85
      },
      {
        id: 'savings-001',
        name: 'SoFi High-Yield Savings',
        type: 'savings',
        balance: 200,
        interestRate: 4.2,
        monthlyContribution: 200
      }
    ],
    goals: [
      {
        id: 'goal-001',
        name: 'Pay off Credit Card',
        type: 'debt_payoff',
        accountId: 'credit-card-001',
        target: 0, // Pay off completely
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'High-interest debt costing 18.9% APR',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-002',
        name: 'Build Emergency Fund',
        type: 'emergency_fund',
        accountId: 'savings-001',
        target: 8400, // 3 months expenses
        targetDate: '2025-06-30',
        priority: 'high',
        note: 'Build 3-month emergency fund for financial security',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-003',
        name: 'Student Loan Payoff',
        type: 'debt_payoff',
        accountId: 'student-loan-001',
        target: 0, // Pay off completely
        targetDate: '2030-12-31',
        priority: 'medium',
        note: 'Federal student loan at 6.8% APR',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-001',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-001',
        amount: -45.67,
        date: '2025-02-03',
        name: 'STARBUCKS #12345',
        merchant_name: 'Starbucks',
        category: ['Food and Drink', 'Restaurants'],
        created_at: '2025-02-03T10:30:00Z'
      },
      {
        id: 'tx-002',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-002',
        amount: -1200.00,
        date: '2025-01-31',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Complex',
        category: ['Rent'],
        created_at: '2025-01-26T09:00:00Z'
      },
      {
        id: 'tx-003',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-003',
        amount: 2800.00,
        date: '2025-02-01',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Tech Startup Inc',
        category: ['Payroll'],
        created_at: '2025-02-01T08:00:00Z'
      },
      {
        id: 'tx-004',
        account_id: 'credit-card-001',
        plaid_transaction_id: 'plaid-tx-004',
        amount: -89.99,
        date: '2025-01-03',
        name: 'AMAZON',
        merchant_name: 'Amazon',
        category: ['Shops', 'General'],
        created_at: '2025-01-03T19:45:00Z'
      },
      {
        id: 'tx-005',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-005',
        amount: -350.00,
        date: '2025-02-04',
        name: 'FEDERAL STUDENT LOAN',
        merchant_name: 'Federal Student Aid',
        category: ['Payment', 'Student Loan'],
        created_at: '2025-02-04T10:00:00Z'
      },
      {
        id: 'tx-006',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-006',
        amount: -85.00,
        date: '2025-02-05',
        name: 'DISCOVER CARD PAYMENT',
        merchant_name: 'Discover',
        category: ['Payment', 'Credit Card'],
        created_at: '2025-02-05T14:30:00Z'
      },
      {
        id: 'tx-007',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-007',
        amount: -67.50,
        date: '2025-02-06',
        name: 'WHOLE FOODS',
        merchant_name: 'Whole Foods',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-02-06T16:20:00Z'
      },
      {
        id: 'tx-008',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-008',
        amount: -25.00,
        date: '2025-02-02',
        name: 'UBER',
        merchant_name: 'Uber',
        category: ['Transportation', 'Rideshare'],
        created_at: '2025-02-02T22:15:00Z'
      },
      {
        id: 'tx-009',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-009',
        amount: -200.00,
        date: '2025-01-05',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-05T11:00:00Z'
      },
      {
        id: 'tx-009b',
        account_id: 'savings-001',
        plaid_transaction_id: 'plaid-tx-009b',
        amount: 200.00,
        date: '2025-01-05',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-05T11:00:00Z'
      },
      {
        id: 'tx-010',
        account_id: 'checking-001',
        plaid_transaction_id: 'plaid-tx-010',
        amount: -15.49,
        date: '2025-01-04',
        name: 'NETFLIX',
        merchant_name: 'Netflix',
        category: ['Entertainment', 'Streaming'],
        created_at: '2025-01-04T00:01:00Z'
      }
    ],
    expectedOpportunities: [
      'Balance transfer for credit card debt',
      'High-yield savings account for emergency fund',
      'Debt snowball vs avalanche strategy comparison'
    ],
    aiContext: 'Recent graduate with high-interest debt and low emergency fund. Needs encouragement and simple explanations. Focus on debt payoff and emergency fund building.'
  },

  youngProfessional: {
    id: 'young-professional-001',
    name: 'Young Professional',
    description: '3-5 years into career, building wealth, has some investments but could optimize allocation',
    userProfile: {
      id: 'young-professional-001',
      firstName: 'Jordan',
      age: 28,
      ageRange: '26-30',
      income: 75000,
      monthlyExpenses: 4200,
      riskTolerance: 'moderate',
      financialLiteracy: 'intermediate',
      mainGoals: ['start_investing', 'save_big_goal'],
      communicationStyle: 'concise',
      notificationFrequency: 'monthly',
      preferredLanguage: 'mixed',
      aiPersonality: 'analytical',
      detailLevel: 'high',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-002',
        name: 'Associated Bank Choice Checking',
        type: 'checking',
        balance: 8500,
        monthlyContribution: 0
      },
      {
        id: 'savings-002',
        name: 'SoFi High-Yield Savings',
        type: 'savings',
        balance: 12000,
        interestRate: 4.2,
        monthlyContribution: 500
      },
      {
        id: 'auto-loan-002',
        name: 'Auto Loan',
        type: 'loan',
        balance: 18000,
        interestRate: 4.2,
        monthlyContribution: 420
      },
      {
        id: 'investment-002',
        name: 'Charles Schwab Roth 401k',
        type: 'investment',
        balance: 8500,
        monthlyContribution: 600
      }
    ],
    goals: [
      {
        id: 'goal-004',
        name: 'Maximize Charles Schwab Roth 401k',
        type: 'investment',
        accountId: 'investment-002',
        target: 23000, // Annual max
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Max out annual 401k contribution limit',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-005',
        name: 'Save for House',
        type: 'custom',
        accountId: 'savings-002',
        target: 50000,
        targetDate: '2026-12-31',
        priority: 'medium',
        note: 'Building down payment for first home',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-006',
        name: 'Pay off Car',
        type: 'debt_payoff',
        accountId: 'auto-loan-002',
        target: 0, // Pay off completely
        targetDate: '2025-12-31',
        priority: 'low',
        note: 'Auto loan at 4.2% APR',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-011',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-011',
        amount: 4500.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Marketing Agency LLC',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-012',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-012',
        amount: -420.00,
        date: '2025-01-26',
        name: 'AUTO LOAN PAYMENT',
        merchant_name: 'Chase Auto Finance',
        category: ['Payment', 'Auto Loan'],
        created_at: '2025-01-26T10:00:00Z'
      },
      {
        id: 'tx-013',
        account_id: 'savings-002',
        plaid_transaction_id: 'plaid-tx-013',
        amount: -500.00,
        date: '2025-02-01',
        name: 'MONTHLY SAVINGS TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-02-01T12:00:00Z'
      },
      {
        id: 'tx-014',
        account_id: 'investment-002',
        plaid_transaction_id: 'plaid-tx-014',
        amount: 600.00,
        date: '2025-01-03',
        name: '401K CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-01-03T09:00:00Z'
      },
      {
        id: 'tx-015',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-015',
        amount: -1200.00,
        date: '2025-02-04',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Management',
        category: ['Rent'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-016',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-016',
        amount: -125.00,
        date: '2025-02-05',
        name: 'TARGET',
        merchant_name: 'Target',
        category: ['Shops', 'General'],
        created_at: '2025-02-05T14:30:00Z'
      },
      {
        id: 'tx-017',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-017',
        amount: -89.50,
        date: '2025-02-06',
        name: 'COSTCO',
        merchant_name: 'Costco',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-02-06T11:20:00Z'
      },
      {
        id: 'tx-018',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-018',
        amount: -10.99,
        date: '2025-02-02',
        name: 'SPOTIFY',
        merchant_name: 'Spotify',
        category: ['Entertainment', 'Music'],
        created_at: '2025-02-02T00:01:00Z'
      },
      {
        id: 'tx-019',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-019',
        amount: -75.00,
        date: '2025-01-05',
        name: 'GAS STATION',
        merchant_name: 'Shell',
        category: ['Transportation', 'Gas'],
        created_at: '2025-01-05T17:45:00Z'
      },
      {
        id: 'tx-020',
        account_id: 'checking-002',
        plaid_transaction_id: 'plaid-tx-020',
        amount: -200.00,
        date: '2025-01-04',
        name: 'HOUSE DOWN PAYMENT SAVINGS',
        merchant_name: 'Associated Bank Relationship Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T15:00:00Z'
      }
    ],
    expectedOpportunities: [
      'Increase 401k contribution to reach annual limit',
      'Consider investing excess savings',
      'CD ladder for house down payment',
      'Refinance auto loan if rates improve'
    ],
    aiContext: 'Young professional with good income and moderate risk tolerance. Needs analytical approach with detailed explanations. Focus on investment optimization and wealth building.'
  },

  debtStruggler: {
    id: 'debt-struggler-001',
    name: 'Debt Struggler',
    description: 'Multiple high-interest debts, struggling to make progress, needs debt consolidation strategy',
    userProfile: {
      id: 'debt-struggler-001',
      firstName: 'Casey',
      age: 32,
      ageRange: '31-35',
      income: 55000,
      monthlyExpenses: 3800,
      riskTolerance: 'conservative',
      financialLiteracy: 'beginner',
      mainGoals: ['pay_down_debt'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'simple',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-003',
        name: 'Associated Bank Access Checking',
        type: 'checking',
        balance: 1200,
        monthlyContribution: 0
      },
      {
        id: 'credit-card-003a',
        name: 'Chase Credit Card',
        type: 'credit_card',
        balance: 8500,
        interestRate: 22.5,
        monthlyContribution: 200
      },
      {
        id: 'credit-card-003b',
        name: 'Capital One Credit Card',
        type: 'credit_card',
        balance: 4200,
        interestRate: 24.9,
        monthlyContribution: 120
      },
      {
        id: 'personal-loan-003',
        name: 'Personal Loan',
        type: 'loan',
        balance: 15000,
        interestRate: 12.5,
        monthlyContribution: 350
      },
      {
        id: 'savings-003',
        name: 'Associated Bank Savings',
        type: 'savings',
        balance: 50,
        interestRate: 4.2,
        monthlyContribution: 50
      }
    ],
    goals: [
      {
        id: 'goal-007',
        name: 'Pay off Capital One Credit Card',
        type: 'debt_payoff',
        accountId: 'credit-card-003b',
        target: 0, // Pay off completely
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Highest interest debt at 24.9% APR',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-007b',
        name: 'Pay off Chase Credit Card',
        type: 'debt_payoff',
        accountId: 'credit-card-003a',
        target: 0, // Pay off completely
        targetDate: '2026-12-31',
        priority: 'high',
        note: 'High interest debt at 22.5% APR',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-007c',
        name: 'Pay off Personal Loan',
        type: 'debt_payoff',
        accountId: 'personal-loan-003',
        target: 0, // Pay off completely
        targetDate: '2027-12-31',
        priority: 'medium',
        note: 'Personal loan at 12.5% APR',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-008',
        name: 'Build Emergency Fund',
        type: 'emergency_fund',
        accountId: 'savings-003',
        target: 5000,
        targetDate: '2025-12-31',
        priority: 'medium',
        note: 'Build emergency fund for financial stability',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-021',
        account_id: 'checking-003',
        plaid_transaction_id: 'plaid-tx-021',
        amount: 3200.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Retail Store Chain',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-022',
        account_id: 'credit-card-003a',
        plaid_transaction_id: 'plaid-tx-022',
        amount: -200.00,
        date: '2025-01-26',
        name: 'CHASE CARD PAYMENT',
        merchant_name: 'Chase Bank',
        category: ['Payment', 'Credit Card'],
        created_at: '2025-01-26T10:00:00Z'
      },
      {
        id: 'tx-023',
        account_id: 'credit-card-003b',
        plaid_transaction_id: 'plaid-tx-023',
        amount: -120.00,
        date: '2025-02-01',
        name: 'CAPITAL ONE PAYMENT',
        merchant_name: 'Capital One',
        category: ['Payment', 'Credit Card'],
        created_at: '2025-02-01T11:00:00Z'
      },
      {
        id: 'tx-024',
        account_id: 'personal-loan-003',
        plaid_transaction_id: 'plaid-tx-024',
        amount: -350.00,
        date: '2025-01-03',
        name: 'PERSONAL LOAN PAYMENT',
        merchant_name: 'LendingClub',
        category: ['Payment', 'Personal Loan'],
        created_at: '2025-01-03T09:00:00Z'
      },
      {
        id: 'tx-025',
        account_id: 'checking-003',
        plaid_transaction_id: 'plaid-tx-025',
        amount: -1200.00,
        date: '2025-02-04',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Management',
        category: ['Rent'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-026',
        account_id: 'credit-card-003a',
        plaid_transaction_id: 'plaid-tx-026',
        amount: -89.99,
        date: '2025-02-05',
        name: 'WALMART',
        merchant_name: 'Walmart',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-02-05T14:30:00Z'
      },
      {
        id: 'tx-027',
        account_id: 'credit-card-003b',
        plaid_transaction_id: 'plaid-tx-027',
        amount: -45.67,
        date: '2025-02-06',
        name: 'MCDONALD\'S',
        merchant_name: 'McDonald\'s',
        category: ['Food and Drink', 'Restaurants'],
        created_at: '2025-02-06T12:20:00Z'
      },
      {
        id: 'tx-028',
        account_id: 'checking-003',
        plaid_transaction_id: 'plaid-tx-028',
        amount: -85.00,
        date: '2025-02-02',
        name: 'ENERGYCO UTILITIES',
        merchant_name: 'EnergyCo Utilities',
        category: ['Utilities'],
        created_at: '2025-02-02T15:00:00Z'
      },
      {
        id: 'tx-029',
        account_id: 'credit-card-003a',
        plaid_transaction_id: 'plaid-tx-029',
        amount: -125.00,
        date: '2025-01-05',
        name: 'GAS STATION',
        merchant_name: 'BP Gas Station',
        category: ['Transportation', 'Gas'],
        created_at: '2025-01-05T17:45:00Z'
      },
      {
        id: 'tx-030',
        account_id: 'checking-003',
        plaid_transaction_id: 'plaid-tx-030',
        amount: -50.00,
        date: '2025-01-04',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T16:00:00Z'
      },
      {
        id: 'tx-030b',
        account_id: 'savings-003',
        plaid_transaction_id: 'plaid-tx-030b',
        amount: 50.00,
        date: '2025-01-04',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T16:00:00Z'
      }
    ],
    expectedOpportunities: [
      'Debt consolidation loan',
      'Balance transfer cards',
      'Debt avalanche vs snowball strategy',
      'Budget optimization',
      'Side income opportunities'
    ],
    aiContext: 'Struggling with multiple high-interest debts. Needs encouragement, simple strategies, and focus on debt payoff. Avoid overwhelming with too many options.'
  },

  millennialProfessional: {
    id: 'millennial-professional-001',
    name: 'Millennial Professional',
    description: 'Early 30s professional juggling student loans, building emergency fund, and cautiously starting to invest',
    userProfile: {
      id: 'millennial-professional-001',
      firstName: 'Taylor',
      age: 31,
      ageRange: '31-35',
      income: 68000,
      monthlyExpenses: 4200,
      riskTolerance: 'moderate',
      financialLiteracy: 'intermediate',
      mainGoals: ['pay_down_debt', 'build_emergency', 'start_investing'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'simple',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-004',
        name: 'Associated Bank Balanced Checking',
        type: 'checking',
        balance: 3200,
        monthlyContribution: 0
      },
      {
        id: 'savings-004',
        name: 'SoFi High-Yield Savings',
        type: 'savings',
        balance: 8500,
        interestRate: 4.2,
        monthlyContribution: 300
      },
      {
        id: 'student-loan-004',
        name: 'Federal Student Loan',
        type: 'loan',
        balance: 28000,
        interestRate: 5.8,
        monthlyContribution: 320
      },
      {
        id: 'credit-card-004',
        name: 'Chase Sapphire',
        type: 'credit_card',
        balance: 4200,
        interestRate: 19.9,
        monthlyContribution: 150
      },
      {
        id: 'investment-004',
        name: 'Charles Schwab Traditional 401k',
        type: 'investment',
        balance: 12000,
        monthlyContribution: 400
      }
    ],
    goals: [
      {
        id: 'goal-009',
        name: 'SoFi High-Yield Savings',
        type: 'emergency_fund',
        accountId: 'savings-004',
        target: 12600, // 3 months expenses
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Build 3-month emergency fund for financial security',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-010',
        name: 'Pay off Credit Card',
        type: 'debt_payoff',
        accountId: 'credit-card-004',
        target: 0, // Pay off completely
        targetDate: '2025-06-30',
        priority: 'high',
        note: 'High-interest credit card debt at 19.9% APR',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-011',
        name: 'Grow Charles Schwab Traditional 401k',
        type: 'investment',
        accountId: 'investment-004',
        target: 25000, // Increase investment balance
        targetDate: '2025-12-31',
        priority: 'medium',
        note: 'Continue building retirement savings',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-012',
        name: 'Save for House',
        type: 'custom',
        accountId: 'savings-004',
        target: 25000,
        targetDate: '2027-12-31',
        priority: 'medium',
        note: 'Building down payment for first home',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-031',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-031',
        amount: 3800.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Software Company Inc',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-032',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-032',
        amount: -300.00,
        date: '2025-01-26',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-032b',
        account_id: 'savings-004',
        plaid_transaction_id: 'plaid-tx-032b',
        amount: 300.00,
        date: '2025-01-26',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-033',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-033',
        amount: -320.00,
        date: '2025-02-01',
        name: 'FEDERAL STUDENT LOAN',
        merchant_name: 'Federal Student Aid',
        category: ['Payment', 'Student Loan'],
        created_at: '2025-02-01T10:00:00Z'
      },
      {
        id: 'tx-034',
        account_id: 'credit-card-004',
        plaid_transaction_id: 'plaid-tx-034',
        amount: -150.00,
        date: '2025-01-03',
        name: 'CHASE SAPPHIRE PAYMENT',
        merchant_name: 'Chase Bank',
        category: ['Payment', 'Credit Card'],
        created_at: '2025-01-03T09:00:00Z'
      },
      {
        id: 'tx-035',
        account_id: 'investment-004',
        plaid_transaction_id: 'plaid-tx-035',
        amount: 400.00,
        date: '2025-02-04',
        name: '401K CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-036',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-036',
        amount: -1400.00,
        date: '2025-02-05',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Complex',
        category: ['Rent'],
        created_at: '2025-02-05T08:00:00Z'
      },
      {
        id: 'tx-037',
        account_id: 'credit-card-004',
        plaid_transaction_id: 'plaid-tx-037',
        amount: -67.50,
        date: '2025-02-06',
        name: 'TRADER JOE\'S',
        merchant_name: 'Trader Joe\'s',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-02-06T16:20:00Z'
      },
      {
        id: 'tx-038',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-038',
        amount: -35.00,
        date: '2025-02-02',
        name: 'LYFT',
        merchant_name: 'Lyft',
        category: ['Transportation', 'Rideshare'],
        created_at: '2025-02-02T22:15:00Z'
      },
      {
        id: 'tx-039',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-039',
        amount: -14.99,
        date: '2025-01-05',
        name: 'AMAZON',
        merchant_name: 'Amazon',
        category: ['Entertainment', 'Subscription'],
        created_at: '2025-01-05T00:01:00Z'
      },
      {
        id: 'tx-040',
        account_id: 'checking-004',
        plaid_transaction_id: 'plaid-tx-040',
        amount: -200.00,
        date: '2025-01-04',
        name: 'HOUSE SAVINGS TRANSFER',
        merchant_name: 'Associated Bank Relationship Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T15:00:00Z'
      }
    ],
    expectedOpportunities: [
      'Balance transfer for credit card debt',
      'Increase 401k contribution to get employer match',
      'High-yield savings account optimization',
      'Student loan refinancing options',
      'Beginner-friendly investment education'
    ],
    aiContext: 'Early 30s professional juggling multiple financial priorities. Needs encouraging, clear guidance with simple explanations. Focus on debt payoff, emergency fund, and cautious investing start.'
  },

  weddingSaver: {
    id: 'wedding-saver-001',
    name: 'Wedding Saver',
    description: 'Late 20s professional saving for wedding while managing student loans and building emergency fund',
    userProfile: {
      id: 'wedding-saver-001',
      firstName: 'Sam',
      age: 28,
      ageRange: '26-30',
      income: 62000,
      monthlyExpenses: 3800,
      riskTolerance: 'conservative',
      financialLiteracy: 'beginner',
      mainGoals: ['save_big_goal', 'pay_down_debt', 'build_emergency'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'simple',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-005',
        name: 'Associated Bank Choice Checking',
        type: 'checking',
        balance: 2800,
        monthlyContribution: 0
      },
      {
        id: 'savings-005',
        name: 'Associated Bank Relationship Savings',
        type: 'savings',
        balance: 12000,
        interestRate: 4.0,
        monthlyContribution: 800
      },
      {
        id: 'student-loan-005',
        name: 'Private Student Loan',
        type: 'loan',
        balance: 22000,
        interestRate: 7.2,
        monthlyContribution: 280
      },
      {
        id: 'credit-card-005',
        name: 'Capital One Card',
        type: 'credit_card',
        balance: 1800,
        interestRate: 22.4,
        monthlyContribution: 75
      },
      {
        id: 'investment-005',
        name: 'Charles Schwab Roth 401k',
        type: 'investment',
        balance: 8500,
        monthlyContribution: 300
      }
    ],
    goals: [
      {
        id: 'goal-011',
        name: 'Wedding Fund',
        type: 'custom',
        accountId: 'savings-005',
        target: 25000,
        targetDate: '2025-10-31',
        priority: 'high',
        note: 'Saving for dream wedding celebration',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-012',
        name: 'Build Emergency Fund',
        type: 'emergency_fund',
        accountId: 'savings-005',
        target: 11400, // 3 months expenses
        targetDate: '2026-06-30',
        priority: 'medium',
        note: 'Build emergency fund after wedding expenses',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-013',
        name: 'Pay off Credit Card',
        type: 'debt_payoff',
        accountId: 'credit-card-005',
        target: 0, // Pay off completely
        targetDate: '2025-03-31',
        priority: 'high',
        note: 'High-interest credit card debt at 22.4% APR',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-041',
        account_id: 'checking-005',
        plaid_transaction_id: 'plaid-tx-041',
        amount: 3100.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Design Agency',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-042',
        account_id: 'savings-005',
        plaid_transaction_id: 'plaid-tx-042',
        amount: -800.00,
        date: '2025-01-26',
        name: 'WEDDING SAVINGS TRANSFER',
        merchant_name: 'Associated Bank Relationship Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-043',
        account_id: 'student-loan-005',
        plaid_transaction_id: 'plaid-tx-043',
        amount: -280.00,
        date: '2025-02-01',
        name: 'PRIVATE STUDENT LOAN',
        merchant_name: 'Sallie Mae',
        category: ['Payment', 'Student Loan'],
        created_at: '2025-02-01T10:00:00Z'
      },
      {
        id: 'tx-044',
        account_id: 'credit-card-005',
        plaid_transaction_id: 'plaid-tx-044',
        amount: -75.00,
        date: '2025-01-03',
        name: 'CAPITAL ONE PAYMENT',
        merchant_name: 'Capital One',
        category: ['Payment', 'Credit Card'],
        created_at: '2025-01-03T09:00:00Z'
      },
      {
        id: 'tx-045',
        account_id: 'investment-005',
        plaid_transaction_id: 'plaid-tx-045',
        amount: 300.00,
        date: '2025-02-04',
        name: '401K CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-046',
        account_id: 'checking-005',
        plaid_transaction_id: 'plaid-tx-046',
        amount: -1200.00,
        date: '2025-02-05',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Complex',
        category: ['Rent'],
        created_at: '2025-02-05T08:00:00Z'
      },
      {
        id: 'tx-047',
        account_id: 'credit-card-005',
        plaid_transaction_id: 'plaid-tx-047',
        amount: -125.00,
        date: '2025-02-06',
        name: 'DAVID\'S BRIDAL',
        merchant_name: 'David\'s Bridal',
        category: ['Shops', 'Clothing'],
        created_at: '2025-02-06T14:20:00Z'
      },
      {
        id: 'tx-048',
        account_id: 'checking-005',
        plaid_transaction_id: 'plaid-tx-048',
        amount: -45.00,
        date: '2025-02-02',
        name: 'UBER EATS',
        merchant_name: 'Uber Eats',
        category: ['Food and Drink', 'Restaurants'],
        created_at: '2025-02-02T19:15:00Z'
      },
      {
        id: 'tx-049',
        account_id: 'checking-005',
        plaid_transaction_id: 'plaid-tx-049',
        amount: -15.49,
        date: '2025-01-05',
        name: 'NETFLIX',
        merchant_name: 'Netflix',
        category: ['Entertainment', 'Streaming'],
        created_at: '2025-01-05T00:01:00Z'
      },
      {
        id: 'tx-050',
        account_id: 'checking-005',
        plaid_transaction_id: 'plaid-tx-050',
        amount: -200.00,
        date: '2025-01-04',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T16:00:00Z'
      }
    ],
    expectedOpportunities: [
      'High-yield savings account for wedding fund',
      'Balance transfer for credit card debt',
      'Student loan refinancing options',
      'Budget optimization for wedding savings',
      'Emergency fund building strategies'
    ],
    aiContext: 'Late 20s professional saving for major life milestone while managing debt. Needs encouraging, simple guidance focused on wedding savings and debt management.'
  },

  gigWorker: {
    id: 'gig-worker-001',
    name: 'Gig Worker',
    description: 'Freelancer with irregular income, needs flexible financial planning and emergency fund strategies',
    userProfile: {
      id: 'gig-worker-001',
      firstName: 'Riley',
      age: 29,
      ageRange: '26-30',
      income: 45000, // Variable income
      monthlyExpenses: 3200,
      riskTolerance: 'moderate',
      financialLiteracy: 'intermediate',
      mainGoals: ['build_emergency', 'start_investing', 'save_big_goal'],
      communicationStyle: 'concise',
      notificationFrequency: 'weekly',
      preferredLanguage: 'mixed',
      aiPersonality: 'analytical',
      detailLevel: 'high',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-006',
        name: 'Business Checking',
        type: 'checking',
        balance: 4500,
        monthlyContribution: 0
      },
      {
        id: 'savings-006',
        name: 'Associated Bank Savings',
        type: 'savings',
        balance: 8000,
        interestRate: 4.2,
        monthlyContribution: 500
      },
      {
        id: 'investment-006',
        name: 'Roth IRA',
        type: 'investment',
        balance: 12000,
        monthlyContribution: 400
      },
      {
        id: 'credit-card-006',
        name: 'Business Credit Card',
        type: 'credit_card',
        balance: 3200,
        interestRate: 16.9,
        monthlyContribution: 120
      }
    ],
    goals: [
      {
        id: 'goal-014',
        name: 'Associated Bank Savings',
        type: 'emergency_fund',
        accountId: 'savings-006',
        target: 19200, // 6 months expenses
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Build 6-month emergency fund for gig work income volatility',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-015',
        name: 'Maximize Roth IRA',
        type: 'investment',
        accountId: 'investment-006',
        target: 7000, // Annual max
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Max out annual Roth IRA contribution',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-016',
        name: 'Save for Equipment',
        type: 'custom',
        accountId: 'savings-006',
        target: 5000,
        targetDate: '2025-06-30',
        priority: 'medium',
        note: 'Save for professional equipment upgrades',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-051',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-051',
        amount: 2800.00,
        date: '2025-02-03',
        name: 'UPWORK PAYMENT',
        merchant_name: 'Upwork',
        category: ['Income', 'Freelance'],
        created_at: '2025-02-03T14:30:00Z'
      },
      {
        id: 'tx-052',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-052',
        amount: -500.00,
        date: '2025-01-26',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-052b',
        account_id: 'savings-006',
        plaid_transaction_id: 'plaid-tx-052b',
        amount: 500.00,
        date: '2025-01-26',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-053',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-053',
        amount: -400.00,
        date: '2025-02-01',
        name: 'ROTH IRA CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-02-01T09:00:00Z'
      },
      {
        id: 'tx-053b',
        account_id: 'investment-006',
        plaid_transaction_id: 'plaid-tx-053b',
        amount: 400.00,
        date: '2025-02-01',
        name: 'ROTH IRA CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-02-01T09:00:00Z'
      },
      {
        id: 'tx-054',
        account_id: 'credit-card-006',
        plaid_transaction_id: 'plaid-tx-054',
        amount: -120.00,
        date: '2025-01-03',
        name: 'BUSINESS CREDIT CARD PAYMENT',
        merchant_name: 'Capital One',
        category: ['Payment', 'Credit Card'],
        created_at: '2025-01-03T10:00:00Z'
      },
      {
        id: 'tx-055',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-055',
        amount: -1200.00,
        date: '2025-02-04',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Management',
        category: ['Rent'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-056',
        account_id: 'credit-card-006',
        plaid_transaction_id: 'plaid-tx-056',
        amount: -22.99,
        date: '2025-02-05',
        name: 'ADOBE CREATIVE SUITE',
        merchant_name: 'Adobe',
        category: ['Software', 'Business'],
        created_at: '2025-02-05T16:20:00Z'
      },
      {
        id: 'tx-057',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-057',
        amount: -45.00,
        date: '2025-02-06',
        name: 'COWORKING SPACE',
        merchant_name: 'WeWork',
        category: ['Business', 'Office'],
        created_at: '2025-02-06T09:30:00Z'
      },
      {
        id: 'tx-058',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-058',
        amount: 3200.00,
        date: '2025-02-02',
        name: 'FREELANCE PROJECT PAYMENT',
        merchant_name: 'Client ABC',
        category: ['Income', 'Freelance'],
        created_at: '2025-02-02T11:15:00Z'
      },
      {
        id: 'tx-059',
        account_id: 'credit-card-006',
        plaid_transaction_id: 'plaid-tx-059',
        amount: -75.50,
        date: '2025-01-05',
        name: 'STARBUCKS',
        merchant_name: 'Starbucks',
        category: ['Food and Drink', 'Coffee'],
        created_at: '2025-01-05T14:45:00Z'
      },
      {
        id: 'tx-060',
        account_id: 'checking-006',
        plaid_transaction_id: 'plaid-tx-060',
        amount: -200.00,
        date: '2025-01-04',
        name: 'EQUIPMENT SAVINGS TRANSFER',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T15:00:00Z'
      }
    ],
    expectedOpportunities: [
      'High-yield savings for irregular income',
      'Tax-advantaged retirement accounts',
      'Business expense optimization',
      'Income smoothing strategies',
      'Freelancer-specific financial planning'
    ],
    aiContext: 'Freelancer with variable income needs flexible financial strategies. Requires analytical approach with focus on emergency fund and tax optimization.'
  },

  newParent: {
    id: 'new-parent-001',
    name: 'New Parent',
    description: 'New parent adjusting to single income, managing childcare costs and planning for child\'s future',
    userProfile: {
      id: 'new-parent-001',
      firstName: 'Morgan',
      age: 31,
      ageRange: '31-35',
      income: 55000, // Reduced from dual income
      monthlyExpenses: 4200, // Increased with childcare
      riskTolerance: 'conservative',
      financialLiteracy: 'beginner',
      mainGoals: ['build_emergency', 'save_big_goal', 'start_investing'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'simple',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-007',
        name: 'Associated Bank Balanced Checking',
        type: 'checking',
        balance: 3200,
        monthlyContribution: 0
      },
      {
        id: 'savings-007',
        name: 'Associated Bank Relationship Savings',
        type: 'savings',
        balance: 15000,
        interestRate: 4.0,
        monthlyContribution: 300
      },
      {
        id: 'investment-007',
        name: '529 College Fund',
        type: 'investment',
        balance: 5000,
        monthlyContribution: 200
      },
      {
        id: 'investment-007b',
        name: 'Charles Schwab Traditional 401k',
        type: 'investment',
        balance: 18000,
        monthlyContribution: 300
      }
    ],
    goals: [
      {
        id: 'goal-017',
        name: 'Child Emergency Fund',
        type: 'emergency_fund',
        accountId: 'savings-007',
        target: 25200, // 6 months expenses
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Build 6-month emergency fund for family with child',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-018',
        name: 'College Fund',
        type: 'custom',
        accountId: 'investment-007',
        target: 50000,
        targetDate: '2040-12-31',
        priority: 'medium',
        note: '529 college savings plan for child\'s education',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-019',
        name: 'Family Vacation',
        type: 'custom',
        accountId: 'savings-007',
        target: 3000,
        targetDate: '2025-08-31',
        priority: 'low',
        note: 'Save for family vacation with young child',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-061',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-061',
        amount: 3200.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Marketing Agency',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-062',
        account_id: 'savings-007',
        plaid_transaction_id: 'plaid-tx-062',
        amount: -300.00,
        date: '2025-01-26',
        name: 'FAMILY EMERGENCY FUND',
        merchant_name: 'Associated Bank Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-063',
        account_id: 'investment-007',
        plaid_transaction_id: 'plaid-tx-063',
        amount: 200.00,
        date: '2025-02-01',
        name: '529 COLLEGE FUND CONTRIBUTION',
        merchant_name: 'College Savings Plan',
        category: ['Investment', 'Education'],
        created_at: '2025-02-01T10:00:00Z'
      },
      {
        id: 'tx-064',
        account_id: 'investment-007b',
        plaid_transaction_id: 'plaid-tx-064',
        amount: 300.00,
        date: '2025-01-03',
        name: '401K CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-01-03T09:00:00Z'
      },
      {
        id: 'tx-065',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-065',
        amount: -1800.00,
        date: '2025-02-04',
        name: 'CHILDCARE PAYMENT',
        merchant_name: 'Little Sprouts Daycare',
        category: ['Childcare'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-066',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-066',
        amount: -1200.00,
        date: '2025-02-05',
        name: 'RENT PAYMENT',
        merchant_name: 'Family Apartment',
        category: ['Rent'],
        created_at: '2025-02-05T08:00:00Z'
      },
      {
        id: 'tx-067',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-067',
        amount: -89.99,
        date: '2025-02-06',
        name: 'TARGET',
        merchant_name: 'Target',
        category: ['Shops', 'Baby'],
        created_at: '2025-02-06T16:20:00Z'
      },
      {
        id: 'tx-068',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-068',
        amount: -125.50,
        date: '2025-02-02',
        name: 'PEDIATRICIAN VISIT',
        merchant_name: 'Kids Health Clinic',
        category: ['Medical', 'Healthcare'],
        created_at: '2025-02-02T14:30:00Z'
      },
      {
        id: 'tx-069',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-069',
        amount: -67.50,
        date: '2025-01-05',
        name: 'WHOLE FOODS',
        merchant_name: 'Whole Foods',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-01-05T11:45:00Z'
      },
      {
        id: 'tx-070',
        account_id: 'checking-007',
        plaid_transaction_id: 'plaid-tx-070',
        amount: -150.00,
        date: '2025-01-04',
        name: 'FAMILY VACATION SAVINGS',
        merchant_name: 'Associated Bank Relationship Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T16:00:00Z'
      }
    ],
    expectedOpportunities: [
      '529 college savings plan optimization',
      'Childcare expense budgeting',
      'Life insurance planning',
      'Family emergency fund strategies',
      'Tax-advantaged savings for children'
    ],
    aiContext: 'New parent adjusting to single income and increased expenses. Needs encouraging, simple guidance focused on family financial security and child\'s future.'
  },

  earlyRetirement: {
    id: 'early-retirement-001',
    name: 'Early Retirement Planner',
    description: 'High earner in 30s aggressively saving for early retirement, optimizing tax strategies',
    userProfile: {
      id: 'early-retirement-001',
      firstName: 'Casey',
      age: 34,
      ageRange: '31-35',
      income: 120000,
      monthlyExpenses: 4500,
      riskTolerance: 'aggressive',
      financialLiteracy: 'advanced',
      mainGoals: ['retirement', 'start_investing', 'save_big_goal'],
      communicationStyle: 'detailed',
      notificationFrequency: 'monthly',
      preferredLanguage: 'technical',
      aiPersonality: 'analytical',
      detailLevel: 'high',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-008',
        name: 'Associated Bank Choice Checking',
        type: 'checking',
        balance: 12000,
        monthlyContribution: 0
      },
      {
        id: 'savings-008',
        name: 'Associated Bank Money Market',
        type: 'savings',
        balance: 25000,
        interestRate: 4.5,
        monthlyContribution: 2000
      },
      {
        id: 'investment-008',
        name: 'Charles Schwab Traditional 401k Max',
        type: 'investment',
        balance: 85000,
        monthlyContribution: 1917 // Max annual contribution
      },
      {
        id: 'investment-008b',
        name: 'Roth IRA',
        type: 'investment',
        balance: 45000,
        monthlyContribution: 583 // Max annual contribution
      },
      {
        id: 'investment-008c',
        name: 'Taxable Brokerage',
        type: 'investment',
        balance: 120000,
        monthlyContribution: 3000
      }
    ],
    goals: [
      {
        id: 'goal-020',
        name: 'Financial Independence',
        type: 'retirement',
        accountIds: ['investment-008', 'investment-008b', 'investment-008c'], // Multiple investment accounts
        target: 2000000,
        targetDate: '2035-12-31',
        priority: 'high',
        note: 'Achieve financial independence through aggressive investing',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-021',
        name: 'Tax Optimization',
        type: 'custom',
        accountId: 'savings-008',
        target: 0, // Process goal, not monetary
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Optimize tax strategy for early retirement',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-022',
        name: 'Real Estate Investment',
        type: 'custom',
        accountId: 'savings-008',
        target: 100000,
        targetDate: '2026-12-31',
        priority: 'medium',
        note: 'Build real estate investment fund for diversification',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-071',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-071',
        amount: 7500.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Tech Corporation',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-072',
        account_id: 'savings-008',
        plaid_transaction_id: 'plaid-tx-072',
        amount: -2000.00,
        date: '2025-01-26',
        name: 'TAXABLE SAVINGS TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-073',
        account_id: 'investment-008',
        plaid_transaction_id: 'plaid-tx-073',
        amount: 1917.00,
        date: '2025-02-01',
        name: '401K MAX CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-02-01T09:00:00Z'
      },
      {
        id: 'tx-074',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-074',
        amount: -583.00,
        date: '2025-01-03',
        name: 'ROTH IRA MAX CONTRIBUTION',
        merchant_name: 'Roth IRA',
        category: ['Investment', 'Retirement'],
        created_at: '2025-01-03T10:00:00Z'
      },
      {
        id: 'tx-074b',
        account_id: 'investment-008b',
        plaid_transaction_id: 'plaid-tx-074b',
        amount: 583.00,
        date: '2025-01-03',
        name: 'ROTH IRA MAX CONTRIBUTION',
        merchant_name: 'Roth IRA',
        category: ['Investment', 'Retirement'],
        created_at: '2025-01-03T10:00:00Z'
      },
      {
        id: 'tx-075',
        account_id: 'investment-008c',
        plaid_transaction_id: 'plaid-tx-075',
        amount: -3000.00,
        date: '2025-02-04',
        name: 'TAXABLE BROKERAGE INVESTMENT',
        merchant_name: 'Schwab Brokerage',
        category: ['Investment', 'Taxable'],
        created_at: '2025-02-04T11:00:00Z'
      },
      {
        id: 'tx-076',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-076',
        amount: -2200.00,
        date: '2025-02-05',
        name: 'RENT PAYMENT',
        merchant_name: 'Luxury Apartment Complex',
        category: ['Rent'],
        created_at: '2025-02-05T08:00:00Z'
      },
      {
        id: 'tx-077',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-077',
        amount: -14.99,
        date: '2025-02-06',
        name: 'AMAZON',
        merchant_name: 'Amazon',
        category: ['Entertainment', 'Subscription'],
        created_at: '2025-02-06T00:01:00Z'
      },
      {
        id: 'tx-078',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-078',
        amount: -125.00,
        date: '2025-02-02',
        name: 'COSTCO',
        merchant_name: 'Costco',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-02-02T11:20:00Z'
      },
      {
        id: 'tx-079',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-079',
        amount: -10.99,
        date: '2025-01-05',
        name: 'SPOTIFY',
        merchant_name: 'Spotify',
        category: ['Entertainment', 'Music'],
        created_at: '2025-01-05T00:01:00Z'
      },
      {
        id: 'tx-080',
        account_id: 'checking-008',
        plaid_transaction_id: 'plaid-tx-080',
        amount: -500.00,
        date: '2025-01-04',
        name: 'REAL ESTATE INVESTMENT FUND',
        merchant_name: 'Associated Bank Money Market',
        category: ['Transfer', 'Investment'],
        created_at: '2025-01-04T15:00:00Z'
      },
      {
        id: 'tx-080b',
        account_id: 'savings-008',
        plaid_transaction_id: 'plaid-tx-080b',
        amount: 500.00,
        date: '2025-01-04',
        name: 'REAL ESTATE INVESTMENT FUND',
        merchant_name: 'Associated Bank Money Market',
        category: ['Transfer', 'Investment'],
        created_at: '2025-01-04T15:00:00Z'
      }
    ],
    expectedOpportunities: [
      'Tax-advantaged account optimization',
      'Asset allocation strategies',
      'Real estate investment planning',
      'Tax loss harvesting',
      'Advanced investment strategies'
    ],
    aiContext: 'High earner with advanced financial knowledge seeking early retirement. Requires analytical, technical approach with focus on tax optimization and advanced strategies.'
  },

  debtFree: {
    id: 'debt-free-001',
    name: 'Recently Debt-Free',
    description: 'Just paid off all debt, now focusing on building wealth and investing',
    userProfile: {
      id: 'debt-free-001',
      firstName: 'Jordan',
      age: 32,
      ageRange: '31-35',
      income: 68000,
      monthlyExpenses: 3800,
      riskTolerance: 'moderate',
      financialLiteracy: 'intermediate',
      mainGoals: ['start_investing', 'build_emergency', 'save_big_goal'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'mixed',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: true
    },
    accounts: [
      {
        id: 'checking-009',
        name: 'Associated Bank Choice Checking',
        type: 'checking',
        balance: 8500,
        monthlyContribution: 0
      },
      {
        id: 'savings-009',
        name: 'Associated Bank Savings',
        type: 'savings',
        balance: 15000,
        interestRate: 4.2,
        monthlyContribution: 800
      },
      {
        id: 'investment-009',
        name: 'Charles Schwab Traditional 401k',
        type: 'investment',
        balance: 25000,
        monthlyContribution: 600
      },
      {
        id: 'investment-009b',
        name: 'Roth IRA',
        type: 'investment',
        balance: 12000,
        monthlyContribution: 500
      }
    ],
    goals: [
      {
        id: 'goal-023',
        name: 'Maximize Charles Schwab Traditional 401k',
        type: 'investment',
        accountId: 'investment-009',
        target: 23000, // Annual max
        targetDate: '2025-12-31',
        priority: 'high',
        note: 'Max out annual 401k contribution limit',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-024',
        name: 'House Down Payment',
        type: 'custom',
        accountId: 'savings-009',
        target: 60000,
        targetDate: '2027-12-31',
        priority: 'high',
        note: 'Building down payment for first home purchase',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'goal-025',
        name: 'Investment Portfolio',
        type: 'investment',
        accountIds: ['investment-009', 'investment-009b'], // Multiple investment accounts
        target: 100000,
        targetDate: '2030-12-31',
        priority: 'medium',
        note: 'Grow diversified investment portfolio for long-term wealth',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    transactions: [
      {
        id: 'tx-081',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-081',
        amount: 4200.00,
        date: '2025-02-03',
        name: 'PAYROLL DEPOSIT',
        merchant_name: 'Software Company',
        category: ['Payroll'],
        created_at: '2025-02-03T08:00:00Z'
      },
      {
        id: 'tx-082',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-082',
        amount: -800.00,
        date: '2025-01-26',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-082b',
        account_id: 'savings-009',
        plaid_transaction_id: 'plaid-tx-082b',
        amount: 800.00,
        date: '2025-01-26',
        name: 'EMERGENCY FUND TRANSFER',
        merchant_name: 'SoFi High-Yield Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-26T12:00:00Z'
      },
      {
        id: 'tx-083',
        account_id: 'investment-009',
        plaid_transaction_id: 'plaid-tx-083',
        amount: 600.00,
        date: '2025-02-01',
        name: '401K CONTRIBUTION',
        merchant_name: 'Charles Schwab',
        category: ['Investment', 'Retirement'],
        created_at: '2025-02-01T09:00:00Z'
      },
      {
        id: 'tx-084',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-084',
        amount: -500.00,
        date: '2025-01-03',
        name: 'ROTH IRA CONTRIBUTION',
        merchant_name: 'Roth IRA',
        category: ['Investment', 'Retirement'],
        created_at: '2025-01-03T10:00:00Z'
      },
      {
        id: 'tx-084b',
        account_id: 'investment-009b',
        plaid_transaction_id: 'plaid-tx-084b',
        amount: 500.00,
        date: '2025-01-03',
        name: 'ROTH IRA CONTRIBUTION',
        merchant_name: 'Roth IRA',
        category: ['Investment', 'Retirement'],
        created_at: '2025-01-03T10:00:00Z'
      },
      {
        id: 'tx-085',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-085',
        amount: -1200.00,
        date: '2025-02-04',
        name: 'RENT PAYMENT',
        merchant_name: 'Apartment Complex',
        category: ['Rent'],
        created_at: '2025-02-04T08:00:00Z'
      },
      {
        id: 'tx-086',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-086',
        amount: -89.99,
        date: '2025-02-05',
        name: 'AMAZON',
        merchant_name: 'Amazon',
        category: ['Shops', 'General'],
        created_at: '2025-02-05T19:45:00Z'
      },
      {
        id: 'tx-087',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-087',
        amount: -67.50,
        date: '2025-02-06',
        name: 'TRADER JOE\'S',
        merchant_name: 'Trader Joe\'s',
        category: ['Food and Drink', 'Groceries'],
        created_at: '2025-02-06T16:20:00Z'
      },
      {
        id: 'tx-088',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-088',
        amount: -35.00,
        date: '2025-02-02',
        name: 'LYFT',
        merchant_name: 'Lyft',
        category: ['Transportation', 'Rideshare'],
        created_at: '2025-02-02T22:15:00Z'
      },
      {
        id: 'tx-089',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-089',
        amount: -15.49,
        date: '2025-01-05',
        name: 'NETFLIX',
        merchant_name: 'Netflix',
        category: ['Entertainment', 'Streaming'],
        created_at: '2025-01-05T00:01:00Z'
      },
      {
        id: 'tx-090',
        account_id: 'checking-009',
        plaid_transaction_id: 'plaid-tx-090',
        amount: -400.00,
        date: '2025-01-04',
        name: 'HOUSE DOWN PAYMENT SAVINGS',
        merchant_name: 'Associated Bank Relationship Savings',
        category: ['Transfer', 'Savings'],
        created_at: '2025-01-04T15:00:00Z'
      }
    ],
    expectedOpportunities: [
      'Increase 401k contributions',
      'Taxable investment account',
      'High-yield savings optimization',
      'Real estate investment planning',
      'Wealth building strategies'
    ],
    aiContext: 'Recently debt-free individual ready to build wealth. Needs encouraging guidance with focus on investment strategies and wealth building.'
  }
};

// Utility functions for working with sample scenarios
export class SampleScenarioUtils {
  /**
   * Get scenario by ID
   */
  static getScenario(scenarioId: string): SampleScenario | undefined {
    return sampleScenarios[scenarioId];
  }

  /**
   * Get all scenario IDs
   */
  static getAllScenarioIds(): string[] {
    return Object.keys(sampleScenarios);
  }

  /**
   * Get scenarios by user type
   */
  static getScenariosByType(type: 'beginner' | 'intermediate' | 'advanced'): SampleScenario[] {
    return Object.values(sampleScenarios).filter(scenario => {
      switch (type) {
        case 'beginner':
          return ['recentGrad', 'debtStruggler', 'weddingSaver'].includes(scenario.id);
        case 'intermediate':
          return ['youngProfessional', 'millennialProfessional'].includes(scenario.id);
        case 'advanced':
          return ['youngProfessional'].includes(scenario.id); // Keep young professional as advanced for now
        default:
          return false;
      }
    });
  }

  /**
   * Get scenarios by risk tolerance
   */
  static getScenariosByRiskTolerance(riskTolerance: 'conservative' | 'moderate' | 'aggressive'): SampleScenario[] {
    return Object.values(sampleScenarios).filter(
      scenario => scenario.userProfile.riskTolerance === riskTolerance
    );
  }

  /**
   * Generate AI context for scenario
   */
  static generateAIContext(scenario: SampleScenario): string {
    const profile = scenario.userProfile;
    const accounts = scenario.accounts;
    const goals = scenario.goals;

    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);

    const netWorth = totalAssets - totalDebt;
    const debtToIncomeRatio = profile.income ? totalDebt / profile.income : 0;

    return `Scenario: ${scenario.name}
Description: ${scenario.description}

User Profile:
- Age: ${profile.age} (${profile.ageRange})
- Income: $${profile.income?.toLocaleString()}
- Monthly Expenses: $${profile.monthlyExpenses?.toLocaleString()}
- Risk Tolerance: ${profile.riskTolerance}
- Financial Literacy: ${profile.financialLiteracy}
- Main Goals: ${profile.mainGoals.join(', ')}
- Communication Style: ${profile.communicationStyle}
- AI Personality: ${profile.aiPersonality}

Financial Situation:
- Net Worth: $${netWorth.toLocaleString()}
- Total Assets: $${totalAssets.toLocaleString()}
- Total Debt: $${totalDebt.toLocaleString()}
- Debt-to-Income Ratio: ${(debtToIncomeRatio * 100).toFixed(1)}%
- Accounts: ${accounts.length} total (${accounts.map(a => a.type).join(', ')})
- Goals: ${goals.length} total (${goals.filter(g => g.priority === 'high').length} high priority)

Expected Opportunities: ${scenario.expectedOpportunities.join(', ')}

AI Context: ${scenario.aiContext}`;
  }

  /**
   * Get scenario recommendations for AI
   */
  static getAIRecommendations(scenario: SampleScenario): string[] {
    const profile = scenario.userProfile;
    const recommendations: string[] = [];

    // Risk-based recommendations
    if (profile.riskTolerance === 'conservative') {
      recommendations.push('Focus on debt payoff and emergency fund building');
      recommendations.push('Use conservative investment strategies');
      recommendations.push('Emphasize stability over growth');
    } else if (profile.riskTolerance === 'aggressive') {
      recommendations.push('Consider investment opportunities');
      recommendations.push('Focus on long-term wealth building');
      recommendations.push('Explore tax-advantaged accounts');
    }

    // Literacy-based recommendations
    if (profile.financialLiteracy === 'beginner') {
      recommendations.push('Use simple, clear explanations');
      recommendations.push('Avoid complex financial jargon');
      recommendations.push('Provide step-by-step guidance');
    } else if (profile.financialLiteracy === 'advanced') {
      recommendations.push('Provide detailed technical analysis');
      recommendations.push('Include advanced strategies');
      recommendations.push('Focus on optimization opportunities');
    }

    // Goal-based recommendations
    if (profile.mainGoals.includes('pay_down_debt')) {
      recommendations.push('Prioritize high-interest debt payoff');
      recommendations.push('Compare debt snowball vs avalanche methods');
      recommendations.push('Look for debt consolidation opportunities');
    }

    if (profile.mainGoals.includes('start_investing')) {
      recommendations.push('Focus on investment education');
      recommendations.push('Recommend diversified portfolio strategies');
      recommendations.push('Consider tax-advantaged accounts');
    }

    return recommendations;
  }
}
