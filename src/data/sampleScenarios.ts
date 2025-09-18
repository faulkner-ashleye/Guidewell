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
