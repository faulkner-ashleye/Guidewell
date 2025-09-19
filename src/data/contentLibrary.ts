import { EnhancedUserProfile } from './enhancedUserProfile';

// Content management system for educational materials
export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'interactive' | 'calculator' | 'checklist' | 'guide';
  category: 'debt' | 'savings' | 'investing' | 'budgeting' | 'credit' | 'retirement' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  tags: string[];
  content: string;
  summary: string;
  keyPoints: string[];
  prerequisites?: string[];
  relatedContent: string[];
  lastUpdated: string;
  author: string;
  version: string;
}

export interface ContentRecommendation {
  contentId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  personalizedFor: string;
}

export interface ContentLibrary {
  articles: ContentItem[];
  videos: ContentItem[];
  interactive: ContentItem[];
  calculators: ContentItem[];
  checklists: ContentItem[];
  guides: ContentItem[];
}

// Comprehensive educational content library
export const contentLibrary: ContentLibrary = {
  articles: [
    {
      id: 'debt-snowball-vs-avalanche',
      title: 'Debt Snowball vs Avalanche: Which Strategy Works Better?',
      type: 'article',
      category: 'debt',
      difficulty: 'beginner',
      estimatedTime: 8,
      tags: ['debt payoff', 'strategy', 'psychology', 'mathematics'],
      content: `When you're facing multiple debts, two popular strategies emerge: the debt snowball and debt avalanche methods. Both approaches could help you pay off debt faster, but they work differently.

**Debt Snowball Method:**
This strategy focuses on paying off your smallest debts first, regardless of interest rates. The idea is that quick wins provide psychological motivation to continue. You might pay minimums on all debts except the smallest, putting extra money toward that one until it's gone.

**Debt Avalanche Method:**
This approach prioritizes debts with the highest interest rates first. Mathematically, this could save you more money in interest over time. You'd pay minimums on all debts except the highest-interest one, focusing extra payments there.

**Which Should You Choose?**
The "better" strategy depends on your personality and financial situation. If you need motivation and quick wins, the snowball method might work better. If you're disciplined and want to minimize interest costs, the avalanche method could be more effective.

**Real-World Example:**
Imagine you have:
- Credit Card A: $2,000 at 18% APR
- Credit Card B: $5,000 at 12% APR  
- Personal Loan: $8,000 at 8% APR

With snowball: Pay off Credit Card A first ($2,000)
With avalanche: Pay off Credit Card A first (18% APR is highest)

In this case, both methods suggest the same first target, but the reasoning differs.

**Considerations:**
- Your psychological needs
- Total interest savings
- Timeline for debt freedom
- Your financial discipline level

Remember, the best debt payoff strategy is the one you'll actually stick to consistently.`,
      summary: 'Compare debt snowball vs avalanche methods to find the best debt payoff strategy for your situation.',
      keyPoints: [
        'Debt snowball focuses on smallest debts first for psychological wins',
        'Debt avalanche targets highest interest rates to minimize costs',
        'Choose based on your personality and financial discipline',
        'Consistency matters more than the specific method',
        'Both strategies could help you become debt-free faster'
      ],
      prerequisites: ['Understanding of interest rates', 'Basic budgeting knowledge'],
      relatedContent: ['debt-consolidation-guide', 'budgeting-basics', 'emergency-fund-importance'],
      lastUpdated: '2024-01-15',
      author: 'Guidewell Team',
      version: '1.2'
    },
    {
      id: 'emergency-fund-importance',
      title: 'Why Your Emergency Fund is Your Financial Safety Net',
      type: 'article',
      category: 'savings',
      difficulty: 'beginner',
      estimatedTime: 6,
      tags: ['emergency fund', 'savings', 'financial security', 'budgeting'],
      content: `An emergency fund is money set aside specifically for unexpected expenses. This could include job loss, medical emergencies, car repairs, or home maintenance. Having this safety net might prevent you from going into debt when life throws curveballs.

**How Much Should You Save?**
Most financial experts suggest saving 3-6 months of essential expenses. This amount could vary based on your situation:
- Single income household: 6 months
- Dual income household: 3-4 months
- Self-employed: 6-12 months
- High job security: 3 months

**Where to Keep Your Emergency Fund:**
Your emergency fund should be easily accessible but separate from your regular spending money. Consider:
- High-yield savings account
- Money market account
- Short-term CD ladder

**Building Your Emergency Fund:**
Start small if needed. Even $500-$1,000 could help with minor emergencies. Then gradually build up to your target amount. You might:
- Set up automatic transfers
- Use windfalls (tax refunds, bonuses)
- Cut non-essential expenses temporarily
- Sell unused items

**When to Use Your Emergency Fund:**
Only for true emergencies:
- Job loss
- Medical emergencies
- Major car or home repairs
- Unexpected legal expenses

**What NOT to Use It For:**
- Vacations
- Holiday gifts
- Regular bills
- Investment opportunities

**Rebuilding After Use:**
If you need to use your emergency fund, prioritize rebuilding it. You might temporarily reduce other savings goals or find ways to increase income.

Remember, an emergency fund is insurance for your financial life. It might not earn much interest, but it provides peace of mind and financial stability.`,
      summary: 'Learn why emergency funds are crucial for financial security and how to build one that works for your situation.',
      keyPoints: [
        'Emergency funds prevent debt during unexpected expenses',
        'Save 3-6 months of essential expenses',
        'Keep funds easily accessible but separate',
        'Only use for true emergencies',
        'Rebuild quickly after using the fund'
      ],
      prerequisites: ['Basic budgeting knowledge'],
      relatedContent: ['high-yield-savings', 'budgeting-basics', 'debt-snowball-vs-avalanche'],
      lastUpdated: '2024-01-10',
      author: 'Guidewell Team',
      version: '1.1'
    },
    {
      id: 'investment-basics-beginners',
      title: 'Investment Basics: Getting Started with Your First Investments',
      type: 'article',
      category: 'investing',
      difficulty: 'beginner',
      estimatedTime: 12,
      tags: ['investing', 'stocks', 'bonds', 'diversification', 'risk'],
      content: `Investing might seem intimidating, but understanding the basics could help you build long-term wealth. This guide covers fundamental concepts to get you started.

**What is Investing?**
Investing means putting your money to work to potentially earn returns over time. Unlike saving, investing involves risk, but historically has provided higher returns than savings accounts.

**Key Investment Types:**
1. **Stocks**: Ownership shares in companies
2. **Bonds**: Loans to governments or corporations
3. **Mutual Funds**: Collections of stocks/bonds managed professionally
4. **ETFs**: Exchange-traded funds that track market indexes
5. **Real Estate**: Property investments

**Risk vs Return:**
Generally, higher potential returns come with higher risk:
- Savings accounts: Low risk, low return
- Bonds: Medium risk, medium return
- Stocks: Higher risk, potentially higher return

**Diversification:**
Don't put all your eggs in one basket. Diversification means spreading investments across different:
- Asset types (stocks, bonds, real estate)
- Industries (technology, healthcare, finance)
- Geographic regions
- Company sizes (large, mid, small cap)

**Time Horizon:**
Your investment timeline affects strategy:
- Short-term (1-3 years): Conservative approach
- Medium-term (3-10 years): Balanced approach
- Long-term (10+ years): Growth-focused approach

**Getting Started:**
1. **Pay off high-interest debt first**
2. **Build emergency fund**
3. **Start with employer 401(k) match**
4. **Consider low-cost index funds**
5. **Invest regularly (dollar-cost averaging)**

**Common Beginner Mistakes:**
- Trying to time the market
- Investing money you'll need soon
- Putting all money in one stock
- Panicking during market downturns
- Not considering fees

**Tax-Advantaged Accounts:**
- 401(k): Employer-sponsored retirement account
- IRA: Individual retirement account
- Roth IRA: After-tax contributions, tax-free growth
- HSA: Health savings account with triple tax benefits

Remember, investing involves risk, and past performance doesn't guarantee future results. Start small, learn continuously, and consider consulting a financial advisor for personalized advice.`,
      summary: 'Learn the fundamentals of investing, including risk management, diversification, and getting started with your first investments.',
      keyPoints: [
        'Investing involves risk but historically provides higher returns',
        'Diversify across asset types, industries, and regions',
        'Consider your time horizon when choosing investments',
        'Start with employer 401(k) match and low-cost index funds',
        'Avoid common mistakes like market timing and panic selling'
      ],
      prerequisites: ['Emergency fund established', 'High-interest debt paid off'],
      relatedContent: ['retirement-planning-basics', 'tax-advantaged-accounts', 'dollar-cost-averaging'],
      lastUpdated: '2024-01-20',
      author: 'Guidewell Team',
      version: '1.3'
    }
  ],
  videos: [
    {
      id: 'budgeting-made-simple',
      title: 'Budgeting Made Simple: The 50/30/20 Rule',
      type: 'video',
      category: 'budgeting',
      difficulty: 'beginner',
      estimatedTime: 5,
      tags: ['budgeting', '50/30/20 rule', 'expense tracking', 'financial planning'],
      content: 'Video content about the 50/30/20 budgeting rule and how to implement it effectively.',
      summary: 'Learn the simple 50/30/20 budgeting method to manage your money effectively.',
      keyPoints: [
        '50% for needs (housing, food, utilities)',
        '30% for wants (entertainment, dining out)',
        '20% for savings and debt payoff',
        'Adjust percentages based on your situation',
        'Track expenses to stay within limits'
      ],
      prerequisites: [],
      relatedContent: ['expense-tracking-tools', 'emergency-fund-importance'],
      lastUpdated: '2024-01-12',
      author: 'Guidewell Team',
      version: '1.0'
    }
  ],
  interactive: [
    {
      id: 'debt-payoff-calculator',
      title: 'Debt Payoff Calculator: Compare Strategies',
      type: 'interactive',
      category: 'debt',
      difficulty: 'beginner',
      estimatedTime: 10,
      tags: ['calculator', 'debt payoff', 'comparison', 'strategy'],
      content: 'Interactive calculator to compare debt snowball vs avalanche methods.',
      summary: 'Compare debt payoff strategies and see which saves you more money and time.',
      keyPoints: [
        'Input your debts and interest rates',
        'Compare snowball vs avalanche methods',
        'See total interest savings',
        'View payoff timeline',
        'Get personalized recommendations'
      ],
      prerequisites: ['Understanding of interest rates'],
      relatedContent: ['debt-snowball-vs-avalanche', 'debt-consolidation-guide'],
      lastUpdated: '2024-01-18',
      author: 'Guidewell Team',
      version: '1.1'
    }
  ],
  calculators: [
    {
      id: 'compound-interest-calculator',
      title: 'Compound Interest Calculator',
      type: 'calculator',
      category: 'investing',
      difficulty: 'beginner',
      estimatedTime: 5,
      tags: ['calculator', 'compound interest', 'investing', 'growth'],
      content: 'Calculate how your investments could grow over time with compound interest.',
      summary: 'See how compound interest could grow your investments over time.',
      keyPoints: [
        'Input initial investment amount',
        'Set monthly contribution',
        'Choose expected annual return',
        'View growth over different time periods',
        'Understand the power of compound interest'
      ],
      prerequisites: [],
      relatedContent: ['investment-basics-beginners', 'retirement-planning-basics'],
      lastUpdated: '2024-01-14',
      author: 'Guidewell Team',
      version: '1.0'
    }
  ],
  checklists: [
    {
      id: 'financial-health-checklist',
      title: 'Financial Health Checklist',
      type: 'checklist',
      category: 'general',
      difficulty: 'beginner',
      estimatedTime: 15,
      tags: ['checklist', 'financial health', 'assessment', 'goals'],
      content: 'Comprehensive checklist to assess and improve your financial health.',
      summary: 'Use this checklist to evaluate your financial situation and identify areas for improvement.',
      keyPoints: [
        'Emergency fund adequacy',
        'Debt-to-income ratio',
        'Savings rate',
        'Insurance coverage',
        'Retirement planning',
        'Investment diversification',
        'Credit score monitoring',
        'Budget adherence'
      ],
      prerequisites: [],
      relatedContent: ['emergency-fund-importance', 'budgeting-made-simple'],
      lastUpdated: '2024-01-16',
      author: 'Guidewell Team',
      version: '1.0'
    }
  ],
  guides: [
    {
      id: 'first-time-homebuyer-guide',
      title: 'First-Time Homebuyer Guide: From Saving to Closing',
      type: 'guide',
      category: 'general',
      difficulty: 'intermediate',
      estimatedTime: 20,
      tags: ['homebuying', 'mortgage', 'down payment', 'closing costs'],
      content: 'Comprehensive guide for first-time homebuyers covering the entire process.',
      summary: 'Everything you need to know about buying your first home, from saving for a down payment to closing day.',
      keyPoints: [
        'Save for down payment (typically 3-20%)',
        'Improve credit score before applying',
        'Get pre-approved for mortgage',
        'Factor in closing costs (2-5% of home price)',
        'Consider ongoing homeownership costs',
        'Work with experienced real estate agent',
        'Get home inspection',
        'Understand closing process'
      ],
      prerequisites: ['Good credit score', 'Stable income', 'Emergency fund'],
      relatedContent: ['mortgage-basics', 'homeownership-costs'],
      lastUpdated: '2024-01-22',
      author: 'Guidewell Team',
      version: '1.2'
    }
  ]
};

// Content recommendation engine
export class ContentRecommendationEngine {
  /**
   * Get personalized content recommendations based on user profile
   */
  static getRecommendations(
    userProfile: EnhancedUserProfile,
    userGoals: string[],
    currentChallenges: string[]
  ): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];
    const allContent = [
      ...contentLibrary.articles,
      ...contentLibrary.videos,
      ...contentLibrary.interactive,
      ...contentLibrary.calculators,
      ...contentLibrary.checklists,
      ...contentLibrary.guides
    ];

    // Filter content based on user profile
    const relevantContent = allContent.filter(content => {
      // Match difficulty level
      if (userProfile.financialLiteracy === 'beginner' && content.difficulty === 'advanced') {
        return false;
      }
      if (userProfile.financialLiteracy === 'advanced' && content.difficulty === 'beginner') {
        return false;
      }

      // Match estimated time with user preferences
      if (userProfile.communicationStyle === 'concise' && content.estimatedTime > 10) {
        return false;
      }

      return true;
    });

    // Score content based on relevance
    relevantContent.forEach(content => {
      let score = 0;
      let reasons: string[] = [];

      // Score based on user goals
      if (userGoals.includes('pay_down_debt') && content.category === 'debt') {
        score += 3;
        reasons.push('Matches your debt payoff goals');
      }
      if (userGoals.includes('build_emergency') && content.category === 'savings') {
        score += 3;
        reasons.push('Supports emergency fund building');
      }
      if (userGoals.includes('start_investing') && content.category === 'investing') {
        score += 3;
        reasons.push('Aligns with investment goals');
      }

      // Score based on current challenges
      if (currentChallenges.includes('high_interest_debt') && content.tags.includes('debt payoff')) {
        score += 2;
        reasons.push('Addresses high-interest debt challenge');
      }
      if (currentChallenges.includes('low_savings') && content.tags.includes('savings')) {
        score += 2;
        reasons.push('Helps with low savings situation');
      }

      // Score based on user profile
      if (userProfile.riskTolerance === 'conservative' && content.tags.includes('conservative')) {
        score += 1;
        reasons.push('Matches conservative risk tolerance');
      }

      // Score based on content type preference
      if (userProfile.communicationStyle === 'visual' && content.type === 'video') {
        score += 1;
        reasons.push('Matches visual learning preference');
      }
      if (userProfile.communicationStyle === 'detailed' && content.type === 'article') {
        score += 1;
        reasons.push('Matches detailed communication style');
      }

      if (score > 0) {
        recommendations.push({
          contentId: content.id,
          reason: reasons.join(', '),
          priority: score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low',
          personalizedFor: `${userProfile.firstName || 'User'} - ${userProfile.financialLiteracy} level`
        });
      }
    });

    // Sort by priority and score
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get content by category
   */
  static getContentByCategory(category: string): ContentItem[] {
    const allContent = [
      ...contentLibrary.articles,
      ...contentLibrary.videos,
      ...contentLibrary.interactive,
      ...contentLibrary.calculators,
      ...contentLibrary.checklists,
      ...contentLibrary.guides
    ];

    return allContent.filter(content => content.category === category);
  }

  /**
   * Get content by difficulty level
   */
  static getContentByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ContentItem[] {
    const allContent = [
      ...contentLibrary.articles,
      ...contentLibrary.videos,
      ...contentLibrary.interactive,
      ...contentLibrary.calculators,
      ...contentLibrary.checklists,
      ...contentLibrary.guides
    ];

    return allContent.filter(content => content.difficulty === difficulty);
  }

  /**
   * Get related content for a specific item
   */
  static getRelatedContent(contentId: string): ContentItem[] {
    const allContent = [
      ...contentLibrary.articles,
      ...contentLibrary.videos,
      ...contentLibrary.interactive,
      ...contentLibrary.calculators,
      ...contentLibrary.checklists,
      ...contentLibrary.guides
    ];

    const content = allContent.find(item => item.id === contentId);
    if (!content) return [];

    return allContent.filter(item => 
      content.relatedContent.includes(item.id) && item.id !== contentId
    );
  }

  /**
   * Search content by tags or keywords
   */
  static searchContent(query: string): ContentItem[] {
    const allContent = [
      ...contentLibrary.articles,
      ...contentLibrary.videos,
      ...contentLibrary.interactive,
      ...contentLibrary.calculators,
      ...contentLibrary.checklists,
      ...contentLibrary.guides
    ];

    const lowercaseQuery = query.toLowerCase();
    
    return allContent.filter(content => 
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.summary.toLowerCase().includes(lowercaseQuery) ||
      content.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      content.keyPoints.some(point => point.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Content delivery utilities
export class ContentDeliveryUtils {
  /**
   * Get content formatted for AI consumption
   */
  static formatContentForAI(content: ContentItem, userProfile: EnhancedUserProfile): string {
    const difficulty = userProfile.financialLiteracy === 'beginner' ? 'simple' : 
                     userProfile.financialLiteracy === 'advanced' ? 'detailed' : 'balanced';
    
    return `Content: ${content.title}
Type: ${content.type}
Category: ${content.category}
Difficulty: ${content.difficulty}
Estimated Time: ${content.estimatedTime} minutes

Summary: ${content.summary}

Key Points:
${content.keyPoints.map(point => `- ${point}`).join('\n')}

Content: ${content.content}

Prerequisites: ${content.prerequisites?.join(', ') || 'None'}

Format for user: ${difficulty} language, ${userProfile.communicationStyle} style, ${userProfile.aiPersonality} tone`;
  }

  /**
   * Get content progress tracking
   */
  static getContentProgress(contentId: string, userId: string): {
    completed: boolean;
    timeSpent: number;
    lastAccessed: string;
    bookmarked: boolean;
  } {
    // In a real implementation, this would fetch from database
    return {
      completed: false,
      timeSpent: 0,
      lastAccessed: new Date().toISOString(),
      bookmarked: false
    };
  }
}
