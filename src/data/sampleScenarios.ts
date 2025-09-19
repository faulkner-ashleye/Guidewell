import { Account, Goal } from './types';
import { EnhancedUserProfile } from './enhancedUserProfile';

// Comprehensive sample scenarios for AI testing and demonstration
export interface SampleScenario {
  id: string;
  name: string;
  description: string;
  userProfile: EnhancedUserProfile;
  accounts: Account[];
  goals: Goal[];
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
        name: 'Chase Checking',
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
      }
    ],
    goals: [
      {
        id: 'goal-001',
        name: 'Pay off Credit Card',
        type: 'debt_payoff',
        targetAmount: 2800,
        currentAmount: 2800,
        targetDate: '2024-12-31',
        priority: 'high'
      },
      {
        id: 'goal-002',
        name: 'Emergency Fund',
        type: 'emergency_fund',
        targetAmount: 8400, // 3 months expenses
        currentAmount: 0,
        targetDate: '2025-06-30',
        priority: 'high'
      },
      {
        id: 'goal-003',
        name: 'Student Loan Payoff',
        type: 'debt_payoff',
        targetAmount: 32000,
        currentAmount: 32000,
        targetDate: '2030-12-31',
        priority: 'medium'
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
        name: 'Wells Fargo Checking',
        type: 'checking',
        balance: 8500,
        monthlyContribution: 0
      },
      {
        id: 'savings-002',
        name: 'High-Yield Savings',
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
        name: '401k',
        type: 'investment',
        balance: 8500,
        monthlyContribution: 600
      }
    ],
    goals: [
      {
        id: 'goal-004',
        name: 'Maximize 401k',
        type: 'investment',
        targetAmount: 23000, // Annual max
        currentAmount: 8500,
        targetDate: '2024-12-31',
        priority: 'high'
      },
      {
        id: 'goal-005',
        name: 'Save for House',
        type: 'custom',
        targetAmount: 50000,
        currentAmount: 12000,
        targetDate: '2026-12-31',
        priority: 'medium'
      },
      {
        id: 'goal-006',
        name: 'Pay off Car',
        type: 'debt_payoff',
        targetAmount: 18000,
        currentAmount: 18000,
        targetDate: '2025-12-31',
        priority: 'low'
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
        name: 'Bank of America Checking',
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
      }
    ],
    goals: [
      {
        id: 'goal-007',
        name: 'Pay off High-Interest Debt',
        type: 'debt_payoff',
        targetAmount: 27700, // Total debt
        currentAmount: 27700,
        targetDate: '2027-12-31',
        priority: 'high'
      },
      {
        id: 'goal-008',
        name: 'Build Emergency Fund',
        type: 'emergency_fund',
        targetAmount: 5000,
        currentAmount: 0,
        targetDate: '2025-12-31',
        priority: 'medium'
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
        name: 'Chase Checking',
        type: 'checking',
        balance: 3200,
        monthlyContribution: 0
      },
      {
        id: 'savings-004',
        name: 'High-Yield Savings',
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
        name: '401k',
        type: 'investment',
        balance: 12000,
        monthlyContribution: 400
      }
    ],
    goals: [
      {
        id: 'goal-009',
        name: 'Emergency Fund',
        type: 'emergency_fund',
        targetAmount: 12600, // 3 months expenses
        currentAmount: 8500,
        targetDate: '2025-12-31',
        priority: 'high'
      },
      {
        id: 'goal-010',
        name: 'Pay off Credit Card',
        type: 'debt_payoff',
        targetAmount: 4200,
        currentAmount: 4200,
        targetDate: '2025-06-30',
        priority: 'high'
      },
      {
        id: 'goal-011',
        name: 'Start Investing',
        type: 'investment',
        targetAmount: 5000,
        currentAmount: 0,
        targetDate: '2025-12-31',
        priority: 'medium'
      },
      {
        id: 'goal-012',
        name: 'Save for House',
        type: 'custom',
        targetAmount: 25000,
        currentAmount: 0,
        targetDate: '2027-12-31',
        priority: 'medium'
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
        name: 'Wells Fargo Checking',
        type: 'checking',
        balance: 2800,
        monthlyContribution: 0
      },
      {
        id: 'savings-005',
        name: 'Wedding Savings',
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
        name: '401k',
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
        targetAmount: 25000,
        currentAmount: 12000,
        targetDate: '2025-10-31',
        priority: 'high'
      },
      {
        id: 'goal-012',
        name: 'Emergency Fund',
        type: 'emergency_fund',
        targetAmount: 11400, // 3 months expenses
        currentAmount: 0,
        targetDate: '2026-06-30',
        priority: 'medium'
      },
      {
        id: 'goal-013',
        name: 'Pay off Credit Card',
        type: 'debt_payoff',
        targetAmount: 1800,
        currentAmount: 1800,
        targetDate: '2025-03-31',
        priority: 'high'
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
        name: 'Emergency Fund',
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
        name: '6-Month Emergency Fund',
        type: 'emergency_fund',
        targetAmount: 19200, // 6 months expenses
        currentAmount: 8000,
        targetDate: '2025-12-31',
        priority: 'high'
      },
      {
        id: 'goal-015',
        name: 'Maximize Roth IRA',
        type: 'investment',
        targetAmount: 7000, // Annual max
        currentAmount: 12000,
        targetDate: '2024-12-31',
        priority: 'high'
      },
      {
        id: 'goal-016',
        name: 'Save for Equipment',
        type: 'custom',
        targetAmount: 5000,
        currentAmount: 0,
        targetDate: '2025-06-30',
        priority: 'medium'
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
        name: 'Family Checking',
        type: 'checking',
        balance: 3200,
        monthlyContribution: 0
      },
      {
        id: 'savings-007',
        name: 'Family Emergency Fund',
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
        name: '401k',
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
        targetAmount: 25200, // 6 months expenses
        currentAmount: 15000,
        targetDate: '2025-12-31',
        priority: 'high'
      },
      {
        id: 'goal-018',
        name: 'College Fund',
        type: 'custom',
        targetAmount: 50000,
        currentAmount: 5000,
        targetDate: '2040-12-31',
        priority: 'medium'
      },
      {
        id: 'goal-019',
        name: 'Family Vacation',
        type: 'custom',
        targetAmount: 3000,
        currentAmount: 0,
        targetDate: '2025-08-31',
        priority: 'low'
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
        name: 'High-Yield Checking',
        type: 'checking',
        balance: 12000,
        monthlyContribution: 0
      },
      {
        id: 'savings-008',
        name: 'Taxable Savings',
        type: 'savings',
        balance: 25000,
        interestRate: 4.5,
        monthlyContribution: 2000
      },
      {
        id: 'investment-008',
        name: '401k Max',
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
        targetAmount: 2000000,
        currentAmount: 275000,
        targetDate: '2035-12-31',
        priority: 'high'
      },
      {
        id: 'goal-021',
        name: 'Tax Optimization',
        type: 'custom',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '2024-12-31',
        priority: 'high'
      },
      {
        id: 'goal-022',
        name: 'Real Estate Investment',
        type: 'custom',
        targetAmount: 100000,
        currentAmount: 0,
        targetDate: '2026-12-31',
        priority: 'medium'
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
        name: 'Main Checking',
        type: 'checking',
        balance: 8500,
        monthlyContribution: 0
      },
      {
        id: 'savings-009',
        name: 'Emergency Fund',
        type: 'savings',
        balance: 15000,
        interestRate: 4.2,
        monthlyContribution: 800
      },
      {
        id: 'investment-009',
        name: '401k',
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
        name: 'Maximize 401k',
        type: 'investment',
        targetAmount: 23000, // Annual max
        currentAmount: 25000,
        targetDate: '2024-12-31',
        priority: 'high'
      },
      {
        id: 'goal-024',
        name: 'House Down Payment',
        type: 'custom',
        targetAmount: 60000,
        currentAmount: 0,
        targetDate: '2027-12-31',
        priority: 'high'
      },
      {
        id: 'goal-025',
        name: 'Investment Portfolio',
        type: 'investment',
        targetAmount: 100000,
        currentAmount: 37000,
        targetDate: '2030-12-31',
        priority: 'medium'
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
