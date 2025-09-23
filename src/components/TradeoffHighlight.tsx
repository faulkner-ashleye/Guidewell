import React, { useState, useEffect } from 'react';
import { Card } from './Card';
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
  const [currentTip, setCurrentTip] = useState<TradeoffTip>({ id: '', title: '', content: '', category: 'general', icon: '' });
  const [tipIndex, setTipIndex] = useState(0);

  // Generate data-driven tips based on user's financial profile
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

  const relevantTips = generatePersonalizedTips();

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % relevantTips.length);
    }, 8000); // Change tip every 8 seconds

    return () => clearInterval(interval);
  }, [relevantTips.length]);

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
    <Card className={`tradeoff-highlight ${className || ''}`}>
      <div className="tradeoff-header">
        <div className="tradeoff-icon">{currentTip.icon}</div>
        <h3 className="tradeoff-title">Financial Insight</h3>
        <div className="tradeoff-controls">
          <button 
            className="control-btn prev" 
            onClick={() => handleTipChange('prev')}
            aria-label="Previous tip"
          >
            ‹
          </button>
          <button 
            className="control-btn next" 
            onClick={() => handleTipChange('next')}
            aria-label="Next tip"
          >
            ›
          </button>
        </div>
      </div>
      
      <div className="tradeoff-content">
        <h4 className="tip-title">{currentTip.title}</h4>
        <p className="tip-content">{currentTip.content}</p>
      </div>
      
      <div className="tradeoff-footer">
        <div className="tip-indicators">
          {relevantTips.map((_, index) => (
            <div 
              key={index}
              className={`indicator ${index === tipIndex ? 'active' : ''}`}
              onClick={() => setTipIndex(index)}
            />
          ))}
        </div>
        <div className="tip-category">
          {currentTip.category.charAt(0).toUpperCase() + currentTip.category.slice(1)}
        </div>
      </div>
    </Card>
  );
}