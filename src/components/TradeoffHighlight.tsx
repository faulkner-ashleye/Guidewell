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

const tradeoffTips: TradeoffTip[] = [
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
    id: 'debt-vs-invest',
    title: 'Debt vs. Investing Tradeoff',
    content: 'Pay off high-interest debt (7%+) before investing. But low-interest debt (3-4%) can wait while you build wealth through investing.',
    category: 'general',
    icon: '⚖️'
  },
  {
    id: 'automation',
    title: 'Automation Beats Willpower',
    content: 'Set up automatic transfers for savings and investments. You\'ll save more consistently than trying to remember each month.',
    category: 'general',
    icon: '🤖'
  },
  {
    id: 'risk-tolerance',
    title: 'Risk vs. Reward',
    content: 'Higher potential returns come with higher risk. Young investors can afford more risk since they have decades to recover.',
    category: 'investing',
    icon: '🎯'
  },
  {
    id: 'lifestyle-creep',
    title: 'Avoid Lifestyle Creep',
    content: 'As income grows, resist the urge to spend proportionally more. Instead, increase your savings rate to build wealth faster.',
    category: 'general',
    icon: '📈'
  },
  {
    id: 'tax-advantaged',
    title: 'Tax-Advantaged Accounts',
    content: 'Maximize 401(k) matches and IRA contributions first. The tax benefits can boost your returns by 20-30% over time.',
    category: 'investing',
    icon: '💰'
  }
];

interface TradeoffHighlightProps {
  userFinancialProfile?: {
    hasDebt: boolean;
    hasSavings: boolean;
    hasInvestments: boolean;
    debtTotal: number;
    savingsTotal: number;
  };
  className?: string;
}

export function TradeoffHighlight({ userFinancialProfile, className }: TradeoffHighlightProps) {
  const [currentTip, setCurrentTip] = useState<TradeoffTip>(tradeoffTips[0]);
  const [tipIndex, setTipIndex] = useState(0);

  // Filter tips based on user's financial situation
  const getRelevantTips = () => {
    if (!userFinancialProfile) return tradeoffTips;
    
    const { hasDebt, hasSavings, hasInvestments, debtTotal, savingsTotal } = userFinancialProfile;
    
    return tradeoffTips.filter(tip => {
      switch (tip.category) {
        case 'debt':
          return hasDebt && debtTotal > 0;
        case 'savings':
          return !hasSavings || savingsTotal < 10000;
        case 'investing':
          return hasSavings && savingsTotal > 5000 && !hasInvestments;
        default:
          return true;
      }
    });
  };

  const relevantTips = getRelevantTips();

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % relevantTips.length);
    }, 8000); // Change tip every 8 seconds

    return () => clearInterval(interval);
  }, [relevantTips.length]);

  useEffect(() => {
    setCurrentTip(relevantTips[tipIndex] || tradeoffTips[0]);
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
