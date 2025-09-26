import { Account, Goal } from './types';

// Enhanced user profile interface with rich context for AI
export interface EnhancedUserProfile {
  // Basic identification
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  
  // Demographics
  age?: number;
  ageRange?: string;
  
  // Financial situation
  income?: number;
  monthlyExpenses?: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  financialLiteracy: 'beginner' | 'intermediate' | 'advanced';
  
  // Goals and priorities
  mainGoals: string[];
  topPriority?: string;
  timeline?: 'short' | 'mid' | 'long';
  
  // Communication preferences
  communicationStyle: 'detailed' | 'concise' | 'visual';
  notificationFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  preferredLanguage: 'simple' | 'technical' | 'mixed';
  
  // AI preferences
  aiPersonality: 'encouraging' | 'analytical' | 'casual' | 'professional';
  detailLevel: 'high' | 'medium' | 'low';
  
  // Context and state
  primaryGoalAccountId?: string;
  hasSampleData?: boolean;
  lastActiveDate?: string;
  onboardingCompleted?: boolean;
  
  // Financial health indicators
  financialHealthScore?: number; // 0-100
  netWorth?: number;
  debtToIncomeRatio?: number;
  emergencyFundMonths?: number;
}

// User profile utility functions
export class UserProfileUtils {
  /**
   * Create enhanced user profile from basic profile and financial data
   */
  static createEnhancedProfile(
    basicProfile: any, 
    accounts: Account[], 
    goals: Goal[]
  ): EnhancedUserProfile {
    // Calculate financial metrics
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalDebt = accounts
      .filter(a => ['credit_card', 'loan', 'mortgage'].includes(a.type))
      .reduce((sum, a) => sum + Math.abs(a.balance), 0);
    
    const netWorth = totalAssets - totalDebt;
    
    // Calculate emergency fund months (estimate)
    const monthlyExpenses = basicProfile?.monthlyExpenses || 3000;
    const emergencyFund = accounts
      .filter(a => a.type === 'savings')
      .reduce((sum, a) => sum + a.balance, 0);
    const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    
    // Calculate debt-to-income ratio
    const annualIncome = basicProfile?.income || 60000;
    const debtToIncomeRatio = annualIncome > 0 ? (totalDebt / annualIncome) * 100 : 0;
    
    // Calculate financial health score
    const financialHealthScore = this.calculateFinancialHealthScore({
      netWorth,
      emergencyFundMonths,
      debtToIncomeRatio,
      totalAssets,
      totalDebt
    });

    return {
      id: basicProfile?.id || 'user-1',
      firstName: basicProfile?.firstName || basicProfile?.name?.split(' ')[0],
      lastName: basicProfile?.lastName || basicProfile?.name?.split(' ')[1],
      email: basicProfile?.email,
      age: basicProfile?.age,
      ageRange: basicProfile?.ageRange,
      income: annualIncome,
      monthlyExpenses,
      riskTolerance: basicProfile?.riskTolerance || 'moderate',
      financialLiteracy: basicProfile?.financialLiteracy || 'intermediate',
      mainGoals: basicProfile?.mainGoals || ['build_emergency_fund'],
      topPriority: basicProfile?.topPriority,
      timeline: basicProfile?.timeline || 'mid',
      communicationStyle: basicProfile?.communicationStyle || 'concise',
      notificationFrequency: 'weekly',
      preferredLanguage: basicProfile?.preferredLanguage || 'simple',
      aiPersonality: basicProfile?.aiPersonality || 'encouraging',
      detailLevel: basicProfile?.detailLevel || 'medium',
      primaryGoalAccountId: basicProfile?.primaryGoalAccountId,
      hasSampleData: basicProfile?.hasSampleData || false,
      lastActiveDate: new Date().toISOString(),
      onboardingCompleted: true,
      financialHealthScore,
      netWorth,
      debtToIncomeRatio,
      emergencyFundMonths
    };
  }

  /**
   * Calculate financial health score (0-100)
   */
  private static calculateFinancialHealthScore(metrics: {
    netWorth: number;
    emergencyFundMonths: number;
    debtToIncomeRatio: number;
    totalAssets: number;
    totalDebt: number;
  }): number {
    let score = 50; // Base score
    
    // Net worth factor
    if (metrics.netWorth > 0) score += 20;
    else if (metrics.netWorth > -10000) score += 10;
    else score -= 10;
    
    // Emergency fund factor
    if (metrics.emergencyFundMonths >= 6) score += 15;
    else if (metrics.emergencyFundMonths >= 3) score += 10;
    else if (metrics.emergencyFundMonths >= 1) score += 5;
    else score -= 5;
    
    // Debt-to-income factor
    if (metrics.debtToIncomeRatio < 20) score += 15;
    else if (metrics.debtToIncomeRatio < 40) score += 10;
    else if (metrics.debtToIncomeRatio < 60) score += 5;
    else score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }
  /**
   * Calculate financial literacy level based on user characteristics
   */
  static calculateFinancialLiteracy(profile: Partial<EnhancedUserProfile>): 'beginner' | 'intermediate' | 'advanced' {
    let score = 0;
    
    // Age factor
    if (profile.age) {
      if (profile.age >= 30) score += 1;
      if (profile.age >= 40) score += 1;
    }
    
    // Risk tolerance factor
    if (profile.riskTolerance === 'aggressive') score += 2;
    else if (profile.riskTolerance === 'moderate') score += 1;
    
    // Goals complexity factor
    if (profile.mainGoals?.includes('start_investing')) score += 1;
    if (profile.mainGoals?.includes('retirement')) score += 1;
    if (profile.mainGoals?.length && profile.mainGoals.length > 2) score += 1;
    
    // Timeline factor
    if (profile.timeline === 'long') score += 1;
    
    if (score >= 4) return 'advanced';
    if (score >= 2) return 'intermediate';
    return 'beginner';
  }

  /**
   * Determine preferred detail level based on literacy and preferences
   */
  static getPreferredDetailLevel(profile: EnhancedUserProfile): 'high' | 'medium' | 'low' {
    if (profile.detailLevel) return profile.detailLevel;
    
    if (profile.financialLiteracy === 'advanced') return 'high';
    if (profile.financialLiteracy === 'beginner') return 'low';
    return 'medium';
  }

  /**
   * Generate comprehensive user context for AI
   */
  static generateUserContext(profile: EnhancedUserProfile, accounts: Account[], goals: Goal[]): string {
    const context = {
      demographics: {
        age: profile.age || 'Unknown',
        ageRange: profile.ageRange || 'Unknown',
        income: profile.income ? `$${profile.income.toLocaleString()}` : 'Unknown'
      },
      financialSituation: {
        riskTolerance: profile.riskTolerance,
        financialLiteracy: profile.financialLiteracy,
        monthlyExpenses: profile.monthlyExpenses ? `$${profile.monthlyExpenses.toLocaleString()}` : 'Unknown',
        netWorth: profile.netWorth ? `$${profile.netWorth.toLocaleString()}` : 'Unknown'
      },
      goals: {
        mainGoals: profile.mainGoals.join(', '),
        topPriority: profile.topPriority || 'None specified',
        timeline: profile.timeline || 'Not specified'
      },
      preferences: {
        communicationStyle: profile.communicationStyle,
        aiPersonality: profile.aiPersonality,
        detailLevel: profile.detailLevel,
        preferredLanguage: profile.preferredLanguage
      },
      accounts: {
        totalAccounts: accounts.length,
        accountTypes: Array.from(new Set(accounts.map(a => a.type))).join(', '),
        totalDebt: accounts.filter(a => ['loan', 'credit_card'].includes(a.type)).reduce((sum, a) => sum + a.balance, 0),
        totalAssets: accounts.filter(a => ['checking', 'savings', 'investment'].includes(a.type)).reduce((sum, a) => sum + a.balance, 0)
      },
      goalsSummary: {
        totalGoals: goals.length,
        completedGoals: goals.filter(g => {
          // Calculate current amount from linked accounts
          let currentAmount = 0;
          if (g.accountId) {
            const account = accounts.find(a => a.id === g.accountId);
            currentAmount = account ? account.balance : 0;
          } else if (g.accountIds && g.accountIds.length > 0) {
            currentAmount = g.accountIds.reduce((sum, accountId) => {
              const account = accounts.find(a => a.id === accountId);
              return sum + (account ? account.balance : 0);
            }, 0);
          }
          return currentAmount >= g.target;
        }).length,
        highPriorityGoals: goals.filter(g => g.priority === 'high').length
      }
    };

    return `User Context:
Demographics: Age ${context.demographics.age} (${context.demographics.ageRange}), Income ${context.demographics.income}
Financial Situation: ${context.financialSituation.riskTolerance} risk tolerance, ${context.financialSituation.financialLiteracy} financial literacy
Goals: ${profile.mainGoals.join(', ')} (Priority: ${profile.topPriority || 'None'}, Timeline: ${profile.timeline || 'Not specified'})
Preferences: ${context.preferences.communicationStyle} communication, ${context.preferences.aiPersonality} AI personality, ${context.preferences.detailLevel} detail level
Accounts: ${context.accounts.totalAccounts} accounts (${context.accounts.accountTypes}), $${context.accounts.totalAssets.toLocaleString()} assets, $${context.accounts.totalDebt.toLocaleString()} debt
Goals: ${context.goalsSummary.totalGoals} total goals, ${context.goalsSummary.completedGoals} completed, ${context.goalsSummary.highPriorityGoals} high priority`;
  }


  /**
   * Generate personalized AI prompt context
   */
  static generateAIPromptContext(profile: EnhancedUserProfile): string {
    const literacyLevel = profile.financialLiteracy;
    const communicationStyle = profile.communicationStyle;
    const aiPersonality = profile.aiPersonality;
    const detailLevel = profile.detailLevel;
    
    return `User Profile for AI Personalization:
- Financial Literacy: ${literacyLevel} (adjust explanation complexity accordingly)
- Communication Style: ${communicationStyle} (prefer ${communicationStyle} explanations)
- AI Personality: ${aiPersonality} (use ${aiPersonality} tone and approach)
- Detail Level: ${detailLevel} (provide ${detailLevel} level of detail)
- Risk Tolerance: ${profile.riskTolerance} (align recommendations with risk comfort)
- Main Goals: ${profile.mainGoals.join(', ')} (focus on these priorities)
- Timeline: ${profile.timeline} (consider this timeframe for recommendations)

Always use conditional language ("could", "might", "scenario shows") and emphasize educational scenarios only.`;
  }

  /**
   * Determine appropriate AI response length
   */
  static getOptimalResponseLength(profile: EnhancedUserProfile): 'short' | 'medium' | 'long' {
    if (profile.communicationStyle === 'concise') return 'short';
    if (profile.communicationStyle === 'detailed') return 'long';
    if (profile.detailLevel === 'high') return 'long';
    if (profile.detailLevel === 'low') return 'short';
    return 'medium';
  }

  /**
   * Get appropriate financial terminology level
   */
  static getTerminologyLevel(profile: EnhancedUserProfile): 'simple' | 'technical' | 'mixed' {
    if (profile.preferredLanguage === 'simple') return 'simple';
    if (profile.preferredLanguage === 'technical') return 'technical';
    if (profile.financialLiteracy === 'beginner') return 'simple';
    if (profile.financialLiteracy === 'advanced') return 'technical';
    return 'mixed';
  }

  /**
   * Create default profile for new users
   */
  static createDefaultProfile(userId: string): EnhancedUserProfile {
    return {
      id: userId,
      riskTolerance: 'moderate',
      financialLiteracy: 'beginner',
      mainGoals: ['build_emergency'],
      communicationStyle: 'detailed',
      notificationFrequency: 'weekly',
      preferredLanguage: 'simple',
      aiPersonality: 'encouraging',
      detailLevel: 'medium',
      hasSampleData: true,
      onboardingCompleted: false
    };
  }

  /**
   * Update profile with calculated fields
   */
  static enrichProfile(profile: EnhancedUserProfile, accounts: Account[], goals: Goal[]): EnhancedUserProfile {
    const enriched = { ...profile };
    
    // Calculate financial literacy if not set
    if (!enriched.financialLiteracy) {
      enriched.financialLiteracy = this.calculateFinancialLiteracy(enriched);
    }
    
    // Calculate detail level if not set
    if (!enriched.detailLevel) {
      enriched.detailLevel = this.getPreferredDetailLevel(enriched);
    }
    
    // Calculate financial health score
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalDebt = accounts
      .filter(a => ['credit_card', 'loan', 'mortgage'].includes(a.type))
      .reduce((sum, a) => sum + Math.abs(a.balance), 0);
    
    const netWorth = totalAssets - totalDebt;
    
    // Calculate emergency fund months (estimate)
    const monthlyExpenses = enriched.monthlyExpenses || 3000;
    const emergencyFund = accounts
      .filter(a => a.type === 'savings')
      .reduce((sum, a) => sum + a.balance, 0);
    const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
    
    // Calculate debt-to-income ratio
    const annualIncome = enriched.income || 60000;
    const debtToIncomeRatio = annualIncome > 0 ? (totalDebt / annualIncome) * 100 : 0;
    
    enriched.financialHealthScore = this.calculateFinancialHealthScore({
      netWorth,
      emergencyFundMonths,
      debtToIncomeRatio,
      totalAssets,
      totalDebt
    });
    
    // Calculate net worth
    const assets = accounts.filter(a => ['checking', 'savings', 'investment'].includes(a.type));
    const debts = accounts.filter(a => ['loan', 'credit_card'].includes(a.type));
    enriched.netWorth = assets.reduce((sum, a) => sum + a.balance, 0) - debts.reduce((sum, a) => sum + a.balance, 0);
    
    // Calculate debt-to-income ratio
    if (enriched.income && debts.length > 0) {
      const totalDebt = debts.reduce((sum, a) => sum + a.balance, 0);
      enriched.debtToIncomeRatio = totalDebt / enriched.income;
    }
    
    // Calculate emergency fund months
    if (enriched.monthlyExpenses) {
      const emergencyFund = accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0);
      enriched.emergencyFundMonths = emergencyFund / enriched.monthlyExpenses;
    }
    
    return enriched;
  }
}

// Sample enhanced profiles for testing
export const sampleEnhancedProfiles = {
  recentGrad: {
    id: 'recent-grad-001',
    firstName: 'Alex',
    age: 24,
    ageRange: '20-25',
    income: 45000,
    monthlyExpenses: 2800,
    riskTolerance: 'conservative' as const,
    financialLiteracy: 'beginner' as const,
    mainGoals: ['pay_down_debt', 'build_emergency'],
    communicationStyle: 'detailed' as const,
    notificationFrequency: 'weekly' as const,
    preferredLanguage: 'simple' as const,
    aiPersonality: 'encouraging' as const,
    detailLevel: 'medium' as const,
    hasSampleData: true,
    onboardingCompleted: true
  },
  
  youngProfessional: {
    id: 'young-professional-001',
    firstName: 'Jordan',
    age: 28,
    ageRange: '26-30',
    income: 75000,
    monthlyExpenses: 4200,
    riskTolerance: 'moderate' as const,
    financialLiteracy: 'intermediate' as const,
    mainGoals: ['start_investing', 'save_big_goal'],
    communicationStyle: 'concise' as const,
    notificationFrequency: 'monthly' as const,
    preferredLanguage: 'mixed' as const,
    aiPersonality: 'analytical' as const,
    detailLevel: 'high' as const,
    hasSampleData: true,
    onboardingCompleted: true
  }
};
