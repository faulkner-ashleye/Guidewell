// Comprehensive narrative avatar system for financial strategies
export interface NarrativeAvatar {
  id: string;
  name: string;
  emoji: string;
  category: 'debt' | 'savings' | 'investment';
  tier: 'anchor' | 'supporting';
  narrative: string;
  balance: string;
  description: string;
  allocation: {
    debt: number;
    savings: number;
    investment: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  timeline: 'short' | 'medium' | 'long';
}

// Debt-focused avatars
export const debtAvatars: NarrativeAvatar[] = [
  {
    id: 'debt_crusher',
    name: 'Debt Crusher',
    emoji: '🏋️',
    category: 'debt',
    tier: 'anchor',
    narrative: "I'm throwing every extra dollar at my balances so I can be free sooner.",
    balance: 'Accelerates payoff, but leaves little room for saving or investing.',
    description: 'Focus on debt to reduce what you owe faster.',
    allocation: { debt: 80, savings: 10, investment: 10 },
    riskLevel: 'low',
    timeline: 'short'
  },
  {
    id: 'steady_payer',
    name: 'Steady Payer',
    emoji: '🛤️',
    category: 'debt',
    tier: 'supporting',
    narrative: "I'll pay more than the minimum, but keep it manageable.",
    balance: 'Slower than Crusher, but steady progress without financial strain.',
    description: 'Stick to a consistent plan with a little extra each month.',
    allocation: { debt: 60, savings: 25, investment: 15 },
    riskLevel: 'low',
    timeline: 'medium'
  },
  {
    id: 'juggler',
    name: 'Juggler',
    emoji: '🌀',
    category: 'debt',
    tier: 'supporting',
    narrative: "Some months I do more, others I scale back.",
    balance: 'Flexible, but unpredictable; debt takes longer to clear.',
    description: 'Flex payments based on what life allows each month.',
    allocation: { debt: 50, savings: 30, investment: 20 },
    riskLevel: 'medium',
    timeline: 'medium'
  },
  {
    id: 'interest_minimizer',
    name: 'Interest Minimizer',
    emoji: '🧘',
    category: 'debt',
    tier: 'supporting',
    narrative: "I want to waste as little as possible on interest.",
    balance: 'Cost-efficient, but progress may feel slower emotionally than Crusher.',
    description: 'Target the highest-interest debts first.',
    allocation: { debt: 70, savings: 20, investment: 10 },
    riskLevel: 'low',
    timeline: 'medium'
  }
];

// Savings-focused avatars
export const savingsAvatars: NarrativeAvatar[] = [
  {
    id: 'goal_keeper',
    name: 'Goal Keeper',
    emoji: '🎯',
    category: 'savings',
    tier: 'anchor',
    narrative: "I'm saving for milestones — a home, wedding, or travel — and want to hit them faster.",
    balance: 'Accelerates goals, but limits debt payoff or investing.',
    description: 'Put more toward savings to reach goals sooner.',
    allocation: { debt: 30, savings: 60, investment: 10 },
    riskLevel: 'low',
    timeline: 'medium'
  },
  {
    id: 'safety_builder',
    name: 'Safety Builder',
    emoji: '🛟',
    category: 'savings',
    tier: 'supporting',
    narrative: "If I cover my basics, I can handle life's surprises.",
    balance: 'More conservative than Goal Keeper; builds security before milestones.',
    description: 'Focus on an emergency cushion first.',
    allocation: { debt: 40, savings: 50, investment: 10 },
    riskLevel: 'low',
    timeline: 'short'
  },
  {
    id: 'auto_pilot',
    name: 'Auto-Pilot',
    emoji: '🔄',
    category: 'savings',
    tier: 'supporting',
    narrative: "I'll save a set amount each payday and let it run in the background.",
    balance: 'Reliable habit, but slower to hit big goals compared to Goal Keeper.',
    description: 'Automate steady transfers without thinking about it.',
    allocation: { debt: 35, savings: 45, investment: 20 },
    riskLevel: 'low',
    timeline: 'long'
  },
  {
    id: 'opportunistic_saver',
    name: 'Opportunistic Saver',
    emoji: '🎉',
    category: 'savings',
    tier: 'supporting',
    narrative: "When extra money comes in, I funnel it into savings.",
    balance: 'Gives bursts of progress, but lacks the consistency of Goal Keeper.',
    description: 'Stash away bonuses, refunds, or side-hustle income.',
    allocation: { debt: 40, savings: 55, investment: 5 },
    riskLevel: 'medium',
    timeline: 'medium'
  }
];

// Investment-focused avatars
export const investmentAvatars: NarrativeAvatar[] = [
  {
    id: 'nest_builder',
    name: 'Nest Builder',
    emoji: '🪺',
    category: 'investment',
    tier: 'anchor',
    narrative: "I want to build wealth over time, even if the ride isn't always smooth.",
    balance: 'A growth-focused middle path — balances fluctuate, but future payoff is strong.',
    description: 'Invest for long-term growth, with some ups and downs.',
    allocation: { debt: 20, savings: 20, investment: 60 },
    riskLevel: 'medium',
    timeline: 'long'
  },
  {
    id: 'future_investor',
    name: 'Future Investor',
    emoji: '🌱',
    category: 'investment',
    tier: 'supporting',
    narrative: "I'll dip my toes in now so my money has time to grow.",
    balance: 'More cautious than Nest Builder; builds momentum slowly but steadily.',
    description: 'Start small to build the habit and confidence.',
    allocation: { debt: 40, savings: 30, investment: 30 },
    riskLevel: 'low',
    timeline: 'long'
  },
  {
    id: 'balanced_builder',
    name: 'Balanced Builder',
    emoji: '⚖️',
    category: 'investment',
    tier: 'supporting',
    narrative: "I want stability and growth together.",
    balance: 'More conservative than Nest Builder; reduces risk, but limits upside.',
    description: 'Split between safe and growth-oriented assets.',
    allocation: { debt: 30, savings: 35, investment: 35 },
    riskLevel: 'low',
    timeline: 'long'
  },
  {
    id: 'risk_taker',
    name: 'Risk Taker',
    emoji: '🎲',
    category: 'investment',
    tier: 'supporting',
    narrative: "I'm young enough to take swings now and see bigger potential gains.",
    balance: 'More aggressive than Nest Builder; higher upside, but setbacks sting harder.',
    description: 'Go bold with higher-risk, higher-reward investments.',
    allocation: { debt: 10, savings: 10, investment: 80 },
    riskLevel: 'high',
    timeline: 'long'
  }
];

// All avatars combined
export const allAvatars: NarrativeAvatar[] = [
  ...debtAvatars,
  ...savingsAvatars,
  ...investmentAvatars
];

// Anchor avatars (the main 3)
export const anchorAvatars: NarrativeAvatar[] = [
  debtAvatars.find(a => a.tier === 'anchor')!,
  savingsAvatars.find(a => a.tier === 'anchor')!,
  investmentAvatars.find(a => a.tier === 'anchor')!
];

// Utility functions
export class AvatarUtils {
  /**
   * Get avatars by category
   */
  static getAvatarsByCategory(category: 'debt' | 'savings' | 'investment'): NarrativeAvatar[] {
    return allAvatars.filter(avatar => avatar.category === category);
  }

  /**
   * Get anchor avatars (main 3)
   */
  static getAnchorAvatars(): NarrativeAvatar[] {
    return anchorAvatars;
  }

  /**
   * Get supporting avatars for a specific category
   */
  static getSupportingAvatars(category: 'debt' | 'savings' | 'investment'): NarrativeAvatar[] {
    return allAvatars.filter(avatar => avatar.category === category && avatar.tier === 'supporting');
  }

  /**
   * Get avatar by ID
   */
  static getAvatarById(id: string): NarrativeAvatar | undefined {
    return allAvatars.find(avatar => avatar.id === id);
  }

  /**
   * Get avatars suitable for account comparison
   * Returns anchor avatars when comparing all accounts
   * Returns category-specific avatars when focusing on specific account types
   */
  static getAvatarsForContext(
    accountTypes: string[], 
    focusCategory?: 'debt' | 'savings' | 'investment'
  ): NarrativeAvatar[] {
    // If focusing on a specific category, return all avatars for that category
    if (focusCategory) {
      return this.getAvatarsByCategory(focusCategory);
    }

    // If comparing all accounts, return anchor avatars
    const hasDebt = accountTypes.some(type => ['credit_card', 'loan'].includes(type));
    const hasSavings = accountTypes.some(type => ['checking', 'savings'].includes(type));
    const hasInvestment = accountTypes.some(type => type === 'investment');

    // If user has all three account types, show anchor avatars
    if (hasDebt && hasSavings && hasInvestment) {
      return this.getAnchorAvatars();
    }

    // Otherwise, show avatars relevant to their account types
    const relevantAvatars: NarrativeAvatar[] = [];
    if (hasDebt) relevantAvatars.push(...this.getAvatarsByCategory('debt'));
    if (hasSavings) relevantAvatars.push(...this.getAvatarsByCategory('savings'));
    if (hasInvestment) relevantAvatars.push(...this.getAvatarsByCategory('investment'));

    return relevantAvatars;
  }

  /**
   * Generate narrative for avatar based on user context
   */
  static generateAvatarNarrative(
    avatar: NarrativeAvatar, 
    userContext: {
      totalDebt: number;
      totalSavings: number;
      totalInvestment: number;
      monthlyContribution: number;
    }
  ): string {
    const { totalDebt, totalSavings, totalInvestment, monthlyContribution } = userContext;
    
    let narrative = avatar.narrative;
    
    // Add context-specific details
    if (avatar.category === 'debt' && totalDebt > 0) {
      const debtAllocation = monthlyContribution * (avatar.allocation.debt / 100);
      narrative += ` With $${debtAllocation.toFixed(0)}/month toward debt, you could see significant progress.`;
    }
    
    if (avatar.category === 'savings' && totalSavings > 0) {
      const savingsAllocation = monthlyContribution * (avatar.allocation.savings / 100);
      narrative += ` With $${savingsAllocation.toFixed(0)}/month toward savings, your goals could accelerate.`;
    }
    
    if (avatar.category === 'investment' && totalInvestment > 0) {
      const investmentAllocation = monthlyContribution * (avatar.allocation.investment / 100);
      narrative += ` With $${investmentAllocation.toFixed(0)}/month toward investments, you could build long-term wealth.`;
    }
    
    return narrative;
  }

  /**
   * Get avatar recommendations based on user profile
   */
  static getRecommendedAvatars(
    userProfile: {
      riskTolerance: 'conservative' | 'moderate' | 'aggressive';
      mainGoals: string[];
      financialLiteracy: 'beginner' | 'intermediate' | 'advanced';
    }
  ): NarrativeAvatar[] {
    const { riskTolerance, mainGoals, financialLiteracy } = userProfile;
    
    let recommended: NarrativeAvatar[] = [];
    
    // Risk tolerance matching
    if (riskTolerance === 'conservative') {
      recommended = allAvatars.filter(a => a.riskLevel === 'low');
    } else if (riskTolerance === 'aggressive') {
      recommended = allAvatars.filter(a => a.riskLevel === 'high');
    } else {
      recommended = allAvatars.filter(a => a.riskLevel === 'medium');
    }
    
    // Goal-based filtering
    if (mainGoals.includes('pay_down_debt')) {
      recommended = recommended.filter(a => a.category === 'debt');
    } else if (mainGoals.includes('build_emergency') || mainGoals.includes('save_big_goal')) {
      recommended = recommended.filter(a => a.category === 'savings');
    } else if (mainGoals.includes('start_investing')) {
      recommended = recommended.filter(a => a.category === 'investment');
    }
    
    // Literacy-based filtering
    if (financialLiteracy === 'beginner') {
      recommended = recommended.filter(a => a.tier === 'anchor');
    }
    
    return recommended.length > 0 ? recommended : anchorAvatars;
  }
}
