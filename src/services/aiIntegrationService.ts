import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { Account, Goal } from '../data/types';
import { Opportunity, OpportunityAnalysis } from '../data/marketData';
import { SampleScenario } from '../data/sampleScenarios';
import { ContentItem, ContentRecommendation } from '../data/contentLibrary';
import { marketDataService } from './marketDataService';
import { OpportunityDetection } from '../data/marketData';
import { ContentRecommendationEngine } from '../data/contentLibrary';

// AI Integration Service - Central hub for all AI-related functionality
export interface AIAnalysisResult {
  userContext: string;
  opportunities: OpportunityAnalysis;
  contentRecommendations: ContentRecommendation[];
  personalizedInsights: string[];
  nextSteps: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  };
  financialHealthScore: number;
  aiPersonality: string;
  communicationStyle: string;
  aiResponse?: {
    summary: string;
    recommendations: string[];
    nextStep: string;
    motivation: string;
    cached?: boolean;
    fallback?: boolean;
  };
}

export interface AIPromptContext {
  userProfile: EnhancedUserProfile;
  accounts: Account[];
  goals: Goal[];
  opportunities: Opportunity[];
  contentRecommendations: ContentRecommendation[];
  marketData: any;
  userContext: string;
  personalizedInstructions: string;
}

export class AIIntegrationService {
  private static instance: AIIntegrationService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/api' 
      : 'http://localhost:3001/api';
  }

  static getInstance(): AIIntegrationService {
    if (!AIIntegrationService.instance) {
      AIIntegrationService.instance = new AIIntegrationService();
    }
    return AIIntegrationService.instance;
  }

  /**
   * Generate comprehensive AI analysis for user
   */
  async generateAIAnalysis(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[]
  ): Promise<AIAnalysisResult> {
    try {
      // Get market data
      const marketData = await marketDataService.getMarketData();
      
      // Analyze opportunities
      const opportunities = OpportunityDetection.analyzeOpportunities(accounts, userProfile);
      
      // Get content recommendations
      const contentRecommendations = ContentRecommendationEngine.getRecommendations(
        userProfile,
        userProfile.mainGoals,
        this.identifyCurrentChallenges(accounts, goals)
      );
      
      // Generate user context
      const userContext = this.generateUserContext(userProfile, accounts, goals);
      
      // Generate personalized insights
      const personalizedInsights = this.generatePersonalizedInsights(
        userProfile,
        accounts,
        goals,
        opportunities
      );
      
      // Generate next steps
      const nextSteps = this.generateNextSteps(
        userProfile,
        accounts,
        goals,
        opportunities
      );
      
      // Assess risk
      const riskAssessment = this.assessRisk(userProfile, accounts, goals);
      
      // Calculate financial health score
      const financialHealthScore = this.calculateFinancialHealthScore(userProfile, accounts, goals);
      
      return {
        userContext,
        opportunities,
        contentRecommendations,
        personalizedInsights,
        nextSteps,
        riskAssessment,
        financialHealthScore,
        aiPersonality: userProfile.aiPersonality,
        communicationStyle: userProfile.communicationStyle
      };
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      throw new Error('Failed to generate AI analysis');
    }
  }

  /**
   * Generate AI prompt context for external AI services
   */
  async generateAIPromptContext(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[],
    specificQuery?: string
  ): Promise<AIPromptContext> {
    const marketData = await marketDataService.getMarketData();
    const opportunities = OpportunityDetection.analyzeOpportunities(accounts, userProfile);
    const contentRecommendations = ContentRecommendationEngine.getRecommendations(
      userProfile,
      userProfile.mainGoals,
      this.identifyCurrentChallenges(accounts, goals)
    );
    
    const userContext = this.generateUserContext(userProfile, accounts, goals);
    const personalizedInstructions = this.generatePersonalizedInstructions(userProfile);

    return {
      userProfile,
      accounts,
      goals,
      opportunities: opportunities.opportunities,
      contentRecommendations,
      marketData,
      userContext,
      personalizedInstructions
    };
  }

  /**
   * Generate personalized AI response based on user profile
   */
  generatePersonalizedResponse(
    baseResponse: string,
    userProfile: EnhancedUserProfile,
    context: AIPromptContext
  ): string {
    let personalizedResponse = baseResponse;

    // Adjust tone based on AI personality
    if (userProfile.aiPersonality === 'encouraging') {
      personalizedResponse = this.addEncouragingTone(personalizedResponse);
    } else if (userProfile.aiPersonality === 'analytical') {
      personalizedResponse = this.addAnalyticalTone(personalizedResponse);
    } else if (userProfile.aiPersonality === 'casual') {
      personalizedResponse = this.addCasualTone(personalizedResponse);
    }

    // Adjust detail level
    if (userProfile.detailLevel === 'low') {
      personalizedResponse = this.simplifyResponse(personalizedResponse);
    } else if (userProfile.detailLevel === 'high') {
      personalizedResponse = this.addDetailedExplanation(personalizedResponse);
    }

    // Adjust communication style
    if (userProfile.communicationStyle === 'concise') {
      personalizedResponse = this.makeConcise(personalizedResponse);
    } else if (userProfile.communicationStyle === 'visual') {
      personalizedResponse = this.addVisualElements(personalizedResponse);
    }

    // Add personalized context
    if (userProfile.firstName) {
      personalizedResponse = `Hi ${userProfile.firstName}! ${personalizedResponse}`;
    }

    // Add educational disclaimers
    personalizedResponse = this.addEducationalDisclaimers(personalizedResponse);

    return personalizedResponse;
  }

  /**
   * Get scenario-based recommendations
   */
  getScenarioRecommendations(userProfile: EnhancedUserProfile): SampleScenario[] {
    // Find matching scenarios based on user profile
    const matchingScenarios: SampleScenario[] = [];
    
    // This would integrate with the sample scenarios to find matches
    // For now, return empty array - would be implemented with scenario matching logic
    
    return matchingScenarios;
  }

  /**
   * Generate user context string
   */
  private generateUserContext(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[]
  ): string {
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const netWorth = totalAssets - totalDebt;
    const debtToIncomeRatio = userProfile.income ? totalDebt / userProfile.income : 0;

    return `User Context:
- Age: ${userProfile.age || 'Unknown'} (${userProfile.ageRange || 'Unknown'})
- Income: $${userProfile.income?.toLocaleString() || 'Unknown'}
- Monthly Expenses: $${userProfile.monthlyExpenses?.toLocaleString() || 'Unknown'}
- Risk Tolerance: ${userProfile.riskTolerance}
- Financial Literacy: ${userProfile.financialLiteracy}
- Main Goals: ${userProfile.mainGoals.join(', ')}
- Net Worth: $${netWorth.toLocaleString()}
- Total Assets: $${totalAssets.toLocaleString()}
- Total Debt: $${totalDebt.toLocaleString()}
- Debt-to-Income Ratio: ${(debtToIncomeRatio * 100).toFixed(1)}%
- Accounts: ${accounts.length} total
- Goals: ${goals.length} total (${goals.filter(g => g.priority === 'high').length} high priority)`;
  }

  /**
   * Identify current challenges based on accounts and goals
   */
  private identifyCurrentChallenges(accounts: Account[], goals: Goal[]): string[] {
    const challenges: string[] = [];
    
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const highInterestDebt = accounts
      .filter(a => a.type === 'credit_card' && (a.interestRate || 0) > 15)
      .reduce((sum, a) => sum + a.balance, 0);
    
    const emergencyFund = accounts
      .filter(a => a.type === 'savings')
      .reduce((sum, a) => sum + a.balance, 0);

    if (highInterestDebt > 0) {
      challenges.push('high_interest_debt');
    }
    
    if (totalDebt > totalAssets * 0.5) {
      challenges.push('high_debt_ratio');
    }
    
    if (emergencyFund < 1000) {
      challenges.push('low_emergency_fund');
    }
    
    if (accounts.filter(a => a.type === 'investment').length === 0) {
      challenges.push('no_investments');
    }
    
    if (goals.filter(g => g.priority === 'high').length > 3) {
      challenges.push('too_many_priorities');
    }

    return challenges;
  }

  /**
   * Generate personalized insights
   */
  private generatePersonalizedInsights(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[],
    opportunities: OpportunityAnalysis
  ): string[] {
    const insights: string[] = [];
    
    // Financial health insights
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    if (totalDebt > totalAssets) {
      insights.push('Your debt exceeds your assets, which could indicate financial stress. Consider focusing on debt reduction strategies.');
    } else if (totalAssets > totalDebt * 2) {
      insights.push('Great job! Your assets significantly exceed your debt, showing strong financial health.');
    }
    
    // Goal progress insights
    const completedGoals = goals.filter(g => {
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
    }).length;
    if (completedGoals > 0) {
      insights.push(`Congratulations! You've completed ${completedGoals} of your ${goals.length} financial goals.`);
    }
    
    // Opportunity insights
    if (opportunities.quickWins.length > 0) {
      insights.push(`You have ${opportunities.quickWins.length} quick-win opportunities that could save you money with minimal effort.`);
    }
    
    if (opportunities.highImpactOpportunities.length > 0) {
      insights.push(`There are ${opportunities.highImpactOpportunities.length} high-impact opportunities that could significantly improve your financial situation.`);
    }
    
    // Risk tolerance insights
    if (userProfile.riskTolerance === 'conservative' && accounts.filter(a => a.type === 'investment').length === 0) {
      insights.push('Your conservative risk tolerance aligns well with your current approach. Consider gradually introducing low-risk investments.');
    }
    
    return insights;
  }

  /**
   * Generate next steps
   */
  private generateNextSteps(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[],
    opportunities: OpportunityAnalysis
  ): string[] {
    const nextSteps: string[] = [];
    
    // Priority-based next steps
    if (opportunities.quickWins.length > 0) {
      nextSteps.push('Start with quick-win opportunities for immediate impact');
    }
    
    if (userProfile.mainGoals.includes('pay_down_debt')) {
      nextSteps.push('Focus on high-interest debt payoff strategies');
    }
    
    if (userProfile.mainGoals.includes('build_emergency')) {
      nextSteps.push('Build emergency fund to 3-6 months of expenses');
    }
    
    if (userProfile.mainGoals.includes('start_investing')) {
      nextSteps.push('Begin investing with low-cost index funds');
    }
    
    // Risk-based next steps
    if (userProfile.riskTolerance === 'conservative') {
      nextSteps.push('Prioritize stability and debt reduction over growth');
    } else if (userProfile.riskTolerance === 'aggressive') {
      nextSteps.push('Consider increasing investment allocation');
    }
    
    return nextSteps;
  }

  /**
   * Assess financial risk
   */
  private assessRisk(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[]
  ): { level: 'low' | 'medium' | 'high'; factors: string[]; recommendations: string[] } {
    const factors: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;
    
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const debtToIncomeRatio = userProfile.income ? totalDebt / userProfile.income : 0;
    
    // High debt-to-income ratio
    if (debtToIncomeRatio > 0.4) {
      riskScore += 3;
      factors.push('High debt-to-income ratio');
      recommendations.push('Focus on debt reduction to improve financial stability');
    }
    
    // High-interest debt
    const highInterestDebt = accounts
      .filter(a => a.type === 'credit_card' && (a.interestRate || 0) > 20)
      .reduce((sum, a) => sum + a.balance, 0);
    
    if (highInterestDebt > 0) {
      riskScore += 2;
      factors.push('High-interest credit card debt');
      recommendations.push('Prioritize paying off high-interest debt');
    }
    
    // Low emergency fund
    const emergencyFund = accounts
      .filter(a => a.type === 'savings')
      .reduce((sum, a) => sum + a.balance, 0);
    
    if (emergencyFund < (userProfile.monthlyExpenses || 0) * 3) {
      riskScore += 2;
      factors.push('Insufficient emergency fund');
      recommendations.push('Build emergency fund to 3-6 months of expenses');
    }
    
    // No investments
    if (accounts.filter(a => a.type === 'investment').length === 0) {
      riskScore += 1;
      factors.push('No investment diversification');
      recommendations.push('Consider starting with low-risk investments');
    }
    
    let level: 'low' | 'medium' | 'high';
    if (riskScore >= 5) level = 'high';
    else if (riskScore >= 3) level = 'medium';
    else level = 'low';
    
    return { level, factors, recommendations };
  }

  /**
   * Calculate financial health score
   */
  private calculateFinancialHealthScore(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[]
  ): number {
    let score = 50; // Base score
    
    const totalAssets = accounts
      .filter(a => ['checking', 'savings', 'investment'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);
    
    const netWorth = totalAssets - totalDebt;
    
    // Net worth factor
    if (netWorth > 0) score += 20;
    if (netWorth > (userProfile.income || 0) * 0.5) score += 10;
    
    // Debt factor
    if (totalDebt === 0) score += 15;
    else if (totalDebt < (userProfile.income || 0) * 0.3) score += 10;
    
    // Emergency fund factor
    if (userProfile.monthlyExpenses) {
      const emergencyFund = accounts
        .filter(a => a.type === 'savings')
        .reduce((sum, a) => sum + a.balance, 0);
      const monthsCovered = emergencyFund / userProfile.monthlyExpenses;
      if (monthsCovered >= 6) score += 10;
      else if (monthsCovered >= 3) score += 5;
    }
    
    // Diversification factor
    if (accounts.filter(a => ['checking', 'savings', 'investment'].includes(a.type)).length > 1) {
      score += 5;
    }
    if (accounts.some(a => a.type === 'investment')) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate personalized instructions for AI
   */
  private generatePersonalizedInstructions(userProfile: EnhancedUserProfile): string {
    return `Personalized AI Instructions:
- Financial Literacy: ${userProfile.financialLiteracy} (adjust explanation complexity)
- Communication Style: ${userProfile.communicationStyle} (prefer ${userProfile.communicationStyle} explanations)
- AI Personality: ${userProfile.aiPersonality} (use ${userProfile.aiPersonality} tone)
- Detail Level: ${userProfile.detailLevel} (provide ${userProfile.detailLevel} level of detail)
- Risk Tolerance: ${userProfile.riskTolerance} (align recommendations with risk comfort)
- Main Goals: ${userProfile.mainGoals.join(', ')} (focus on these priorities)

Always use conditional language ("could", "might", "scenario shows") and emphasize educational scenarios only.`;
  }

  // Tone adjustment methods
  private addEncouragingTone(response: string): string {
    return response.replace(/\./g, '!').replace(/could/g, 'can definitely');
  }

  private addAnalyticalTone(response: string): string {
    return `Based on the data analysis: ${response}`;
  }

  private addCasualTone(response: string): string {
    return response.replace(/you should/g, 'you might want to').replace(/must/g, 'should probably');
  }

  private simplifyResponse(response: string): string {
    // Remove complex sentences and jargon
    return response.replace(/Furthermore|Moreover|Additionally/g, 'Also');
  }

  private addDetailedExplanation(response: string): string {
    return `${response}\n\nFor more context, this approach considers your specific financial situation and risk tolerance.`;
  }

  private makeConcise(response: string): string {
    // Remove filler words and shorten sentences
    return response.replace(/\s+/g, ' ').trim();
  }

  private addVisualElements(response: string): string {
    return `${response}\n\n📊 Consider using charts to visualize your progress.`;
  }

  private addEducationalDisclaimers(response: string): string {
    return `${response}\n\n⚠️ This is educational content only and not financial advice. Results may vary based on individual circumstances.`;
  }

  /**
   * Call ChatGPT API for analysis
   */
  async callAIAnalysisAPI(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[],
    analysisType: string = 'general'
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          accounts,
          goals,
          analysisType
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI API call failed:', error);
      return null;
    }
  }

  /**
   * Send chat message to ChatGPT API
   */
  async sendChatMessage(
    userId: string,
    message: string,
    userProfile: EnhancedUserProfile,
    accounts: Account[]
  ): Promise<{ response: string; fallback?: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message,
          userProfile,
          accounts
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response,
        fallback: data.fallback
      };
    } catch (error) {
      console.error('Chat API call failed:', error);
      return {
        response: "I'm having trouble connecting right now, but I'm here to help! 😊 Please try again in a moment.",
        fallback: true
      };
    }
  }

  /**
   * Check AI service health
   */
  async checkAIHealth(): Promise<{ status: string; configured: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-health`);
      const data = await response.json();
      return {
        status: data.status,
        configured: data.openai?.configured || false
      };
    } catch (error) {
      console.error('AI health check failed:', error);
      return {
        status: 'error',
        configured: false
      };
    }
  }

  /**
   * Enhanced generateAIAnalysis method that uses ChatGPT API
   */
  async generateAIAnalysisWithAPI(
    userProfile: EnhancedUserProfile,
    accounts: Account[],
    goals: Goal[],
    analysisType: string = 'general'
  ): Promise<AIAnalysisResult> {
    try {
      // Get existing analysis
      const baseAnalysis = await this.generateAIAnalysis(userProfile, accounts, goals);
      
      // Call ChatGPT API for enhanced insights
      const aiResponse = await this.callAIAnalysisAPI(userProfile, accounts, goals, analysisType);
      
      // Parse the AI response to extract structured data
      const parsedResponse = this.parseAIResponse(aiResponse);
      
      return {
        ...baseAnalysis,
        aiResponse: parsedResponse
      };
    } catch (error) {
      console.error('Error generating AI analysis with API:', error);
      // Return base analysis if API fails
      return await this.generateAIAnalysis(userProfile, accounts, goals);
    }
  }

  /**
   * Parse AI response to extract structured data (similar to backend parsing)
   */
  private parseAIResponse(response: any): any {
    if (!response) return null;
    
    // If response is already parsed (has summary, recommendations, etc.), return as-is
    if (response.summary && response.recommendations) {
      return response;
    }
    
    // If response is a string, try to parse it
    if (typeof response === 'string') {
      try {
        // Clean the response - remove markdown code blocks and extra whitespace
        let cleanedResponse = response.trim();
        
        // Remove various markdown code block patterns
        cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        cleanedResponse = cleanedResponse.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
        cleanedResponse = cleanedResponse.replace(/^`\s*/i, '').replace(/\s*`$/i, '');
        
        // Remove any remaining markdown artifacts
        cleanedResponse = cleanedResponse.replace(/^json\s*/i, '');
        
        // Try to find JSON object boundaries if there's extra text
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }
        
        // Try to parse as JSON
        const parsed = JSON.parse(cleanedResponse);
        return parsed;
      } catch (error) {
        // If JSON parsing fails, return the raw response as summary
        return {
          summary: response,
          recommendations: [],
          nextStep: '',
          motivation: '',
          fallback: true
        };
      }
    }
    
    return response;
  }
}

// Export singleton instance
export const aiIntegrationService = AIIntegrationService.getInstance();
