import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './Card';
import { Icon, IconNames } from './Icon';
import { useAppState } from '../state/AppStateContext';
import { aiIntegrationService } from '../services/aiIntegrationService';
import { EnhancedUserProfile, UserProfileUtils } from '../data/enhancedUserProfile';
import { Goal as AppGoal } from '../app/types';
import './TradeoffHighlight.css';

interface TradeoffTip {
  id: string;
  title: string;
  content: string;
  category: 'debt' | 'savings' | 'investing' | 'general';
  icon: string;
}

interface TradeoffHighlightProps {
  userFinancialProfile?: {
    hasDebt: boolean;
    hasSavings: boolean;
    hasInvestments: boolean;
    debtTotal: number;
    savingsTotal: number;
    investmentTotal: number;
    highestAPR?: number;
    monthlyExpenses?: number;
  };
  className?: string;
}

export function TradeoffHighlight({ userFinancialProfile, className }: TradeoffHighlightProps) {
  const { accounts = [], userProfile, goals = [] } = useAppState();
  const [currentTip, setCurrentTip] = useState<TradeoffTip>({ id: '', title: '', content: '', category: 'general', icon: '' });
  const [tipIndex, setTipIndex] = useState(0);
  const [aiTips, setAiTips] = useState<TradeoffTip[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Convert AppGoal to data Goal type for AI integration
  const convertedGoals = useMemo(() => {
    return goals.map((goal: AppGoal) => ({
      id: goal.id,
      name: goal.name,
      type: goal.type === 'savings' ? 'emergency_fund' :
            goal.type === 'debt' ? 'debt_payoff' :
            goal.type as 'debt_payoff' | 'emergency_fund' | 'retirement' | 'investment' | 'custom',
      accountId: goal.accountId,
      accountIds: goal.accountIds,
      target: goal.target,
      targetDate: goal.targetDate,
      monthlyContribution: goal.monthlyContribution,
      priority: goal.priority,
      note: goal.note,
      createdAt: goal.createdAt
    }));
  }, [goals]);

  // Create enhanced user profile for AI integration
  const enhancedUserProfile = useMemo((): EnhancedUserProfile => {
    return UserProfileUtils.createEnhancedProfile(userProfile, accounts, convertedGoals);
  }, [userProfile, accounts, convertedGoals]);

  // Generate AI-powered personalized tips
  const generateAITips = async (): Promise<void> => {
    if (!enhancedUserProfile || accounts.length === 0) {
      setAiError('Please connect accounts and complete your profile first');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const analysis = await aiIntegrationService.generateAIAnalysisWithAPI(
        enhancedUserProfile,
        accounts,
        convertedGoals,
        'tradeoff_insights'
      );

      if (analysis && analysis.aiResponse && analysis.aiResponse.summary && !analysis.aiResponse.fallback) {
        // Parse AI response into structured tips
        const aiGeneratedTips = parseAIResponseToTips(analysis.aiResponse.summary);
        setAiTips(aiGeneratedTips);
      } else {
        // Fallback to rule-based tips if AI fails
        console.log('Using fallback tips - AI analysis failed or returned fallback');
        setAiTips([]);
      }
    } catch (error) {
      console.error('AI Tips generation failed:', error);
      setAiError('Failed to generate AI insights. Using fallback.');
      setAiTips([]);
    } finally {
      setAiLoading(false);
    }
  };

  // Parse AI response into structured TradeoffTip format
  const parseAIResponseToTips = (aiResponse: string): TradeoffTip[] => {
    const tips: TradeoffTip[] = [];
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    let currentTip: Partial<TradeoffTip> = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for titles (usually lines that end with : or are short)
      if (trimmedLine.length < 60 && (trimmedLine.endsWith(':') || trimmedLine.endsWith('!'))) {
        if (currentTip.title && currentTip.content) {
          tips.push(completeTip(currentTip));
          currentTip = {};
        }
        currentTip.title = trimmedLine.replace(/[:!]$/, '');
      }
      // Look for content (longer lines)
      else if (trimmedLine.length > 20 && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('•')) {
        if (currentTip.title) {
          currentTip.content = trimmedLine;
          currentTip.id = `ai-${tips.length + 1}`;
          currentTip.category = categorizeTip(currentTip.title, trimmedLine);
          currentTip.icon = getIconForCategory(currentTip.category);
        }
      }
    }
    
    // Add the last tip if it exists
    if (currentTip.title && currentTip.content) {
      tips.push(completeTip(currentTip));
    }
    
    return tips.slice(0, 4); // Limit to 4 tips
  };

  const completeTip = (partialTip: Partial<TradeoffTip>): TradeoffTip => ({
    id: partialTip.id || 'ai-tip',
    title: partialTip.title || 'Financial Insight',
    content: partialTip.content || 'AI-generated financial insight',
    category: partialTip.category || 'general',
    icon: partialTip.icon || '💡'
  });

  const categorizeTip = (title: string, content: string): 'debt' | 'savings' | 'investing' | 'general' => {
    const combined = `${title} ${content}`.toLowerCase();
    if (combined.includes('debt') || combined.includes('loan') || combined.includes('credit')) return 'debt';
    if (combined.includes('savings') || combined.includes('emergency') || combined.includes('fund')) return 'savings';
    if (combined.includes('invest') || combined.includes('stock') || combined.includes('portfolio')) return 'investing';
    return 'general';
  };

  const getIconForCategory = (category: string): string => {
    switch (category) {
      case 'debt': return '🚨';
      case 'savings': return '💰';
      case 'investing': return '📈';
      default: return '💡';
    }
  };

  // Load AI tips when component mounts or data changes
  useEffect(() => {
    if (accounts.length > 0 && userProfile) {
      generateAITips();
    }
  }, [accounts.length, userProfile?.firstName, goals.length]);

  // Generate data-driven tips based on user's financial profile (fallback)
  const generatePersonalizedTips = (): TradeoffTip[] => {
    if (!userFinancialProfile) {
      return getDefaultTips();
    }

    const { hasDebt, hasSavings, hasInvestments, debtTotal, savingsTotal, investmentTotal, highestAPR, monthlyExpenses } = userFinancialProfile;
    const tips: TradeoffTip[] = [];

    // High-interest debt tips
    if (hasDebt && highestAPR && highestAPR > 20) {
      const monthlyInterest = Math.round((debtTotal * highestAPR / 100) / 12);
      tips.push({
        id: 'high-interest-debt',
        title: 'High-Interest Debt Alert',
        content: `Your ${highestAPR}% APR debt costs you ~$${monthlyInterest}/month in interest. Paying extra could save thousands annually.`,
        category: 'debt',
        icon: '🚨'
      });
    }

    // Emergency fund tips
    const estimatedExpenses = monthlyExpenses || 3000;
    const emergencyFundRatio = savingsTotal / estimatedExpenses;
    if (emergencyFundRatio < 3 && savingsTotal > 0) {
      const shortfall = Math.round((estimatedExpenses * 3) - savingsTotal);
      tips.push({
        id: 'emergency-fund-gap',
        title: 'Emergency Fund Gap',
        content: `You're $${shortfall.toLocaleString()} away from a 3-month emergency fund. This protects you from unexpected expenses.`,
        category: 'savings',
        icon: '🛡️'
      });
    }

    // Debt vs investing tradeoff
    if (hasDebt && hasSavings && savingsTotal > 5000 && !hasInvestments) {
      const avgDebtRate = highestAPR || 15;
      tips.push({
        id: 'debt-vs-invest',
        title: 'Debt vs. Investing Decision',
        content: `Your debt costs ${avgDebtRate}% annually. Paying it off first guarantees this return vs. uncertain market gains.`,
        category: 'general',
        icon: '⚖️'
      });
    }

    // Investment opportunity
    if (!hasDebt && savingsTotal > 10000 && !hasInvestments) {
      tips.push({
        id: 'investment-opportunity',
        title: 'Investment Opportunity',
        content: `With $${(savingsTotal / 1000).toFixed(1)}K in savings and no debt, you're ready to start building long-term wealth through investing.`,
        category: 'investing',
        icon: '📈'
      });
    }

    // Savings optimization
    if (hasSavings && savingsTotal > 2000) {
      const potentialAnnualGain = Math.round(savingsTotal * 0.04); // 4% high-yield
      tips.push({
        id: 'savings-optimization',
        title: 'Optimize Your Savings',
        content: `Moving to a high-yield savings account could earn you ~$${potentialAnnualGain} more annually on your current balance.`,
        category: 'savings',
        icon: '💰'
      });
    }

    // Goal acceleration
    if (hasSavings && savingsTotal > 0 && savingsTotal < 10000) {
      const monthlyGoal = Math.round(savingsTotal / 12);
      tips.push({
        id: 'goal-acceleration',
        title: 'Accelerate Your Goals',
        content: `Saving an extra $${monthlyGoal}/month could double your current savings in just 12 months.`,
        category: 'savings',
        icon: '⚡'
      });
    }

    // Return personalized tips or fallback to defaults
    return tips.length > 0 ? tips : getDefaultTips();
  };

  const getDefaultTips = (): TradeoffTip[] => [
    {
      id: 'debt-compound',
      title: 'The Power of Compound Interest',
      content: 'Most people underestimate how much interest adds up. Even small extra payments can cut years off debt.',
      category: 'debt',
      icon: '⚡'
    },
    {
      id: 'emergency-fund',
      title: 'Emergency Fund First',
      content: 'Before investing, build 3-6 months of expenses in savings. It prevents you from going deeper into debt during emergencies.',
      category: 'savings',
      icon: '🛡️'
    },
    {
      id: 'time-horizon',
      title: 'Time is Your Greatest Asset',
      content: 'Starting to invest early gives compound growth decades to work. A 25-year-old investing $100/month will have $1M+ by retirement.',
      category: 'investing',
      icon: '⏰'
    },
    {
      id: 'automation',
      title: 'Automation Beats Willpower',
      content: 'Set up automatic transfers for savings and investments. You\'ll save more consistently than trying to remember each month.',
      category: 'general',
      icon: '🤖'
    }
  ];

  // Combine AI tips with fallback tips
  const relevantTips = useMemo(() => {
    if (aiTips.length > 0) {
      return aiTips;
    }
    return generatePersonalizedTips();
  }, [aiTips, userFinancialProfile]);


  useEffect(() => {
    setCurrentTip(relevantTips[tipIndex] || relevantTips[0]);
  }, [tipIndex, relevantTips]);

  const handleTipChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setTipIndex(prev => prev === 0 ? relevantTips.length - 1 : prev - 1);
    } else {
      setTipIndex(prev => (prev + 1) % relevantTips.length);
    }
  };

  return (
    <div className={`tradeoff-highlight-container ${className || ''}`}>
      <div className="tradeoff-header">
        <h3 className="tradeoff-title">
          Financial Insight
          {aiLoading && <span className="ai-loading-indicator"> 🤖</span>}
          {aiError && <span className="ai-error-indicator"> ⚠️</span>}
        </h3>
      </div>

      <Card className="tradeoff-highlight">
        <div className="tradeoff-content">
          {aiLoading ? (
            <div className="ai-loading-content">
              <div className="loading-spinner"></div>
              <p>I'm putting the pieces together so your options are easier to see…</p>
            </div>
          ) : aiError ? (
            <div className="ai-error-content">
              <h4 className="tip-title">{currentTip.title}</h4>
              <p className="tip-content">{currentTip.content}</p>
              <small className="ai-error-message">{aiError}</small>
            </div>
          ) : (
            <>
              <h4 className="tip-title">{currentTip.title}</h4>
              <p className="tip-content">{currentTip.content}</p>
            </>
          )}
        </div>

        {!aiLoading && (
          <div className="tradeoff-footer">
            <div className="tip-category">
              {currentTip.category.charAt(0).toUpperCase() + currentTip.category.slice(1)}
            </div>
          </div>
        )}
      </Card>

      {relevantTips.length > 1 && (
        <div className="tradeoff-controls">
          <button
            className="control-btn prev"
            onClick={() => handleTipChange('prev')}
            aria-label="Previous tip"
          >
            <Icon name={IconNames.arrow_back} size="sm" />
          </button>
          <div className="tip-indicators">
            {relevantTips.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === tipIndex ? 'active' : ''}`}
                onClick={() => setTipIndex(index)}
              />
            ))}
          </div>
          <button
            className="control-btn next"
            onClick={() => handleTipChange('next')}
            aria-label="Next tip"
          >
            <Icon name={IconNames.arrow_forward} size="sm" />
          </button>
        </div>
      )}
    </div>
  );
}
