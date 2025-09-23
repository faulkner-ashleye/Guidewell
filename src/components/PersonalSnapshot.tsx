import React from 'react';
import { Card } from './Card';
import './PersonalSnapshot.css';

interface PersonalSnapshotProps {
  debtTotal: number;
  savingsTotal: number;
  investmentTotal: number;
  className?: string;
}

export function PersonalSnapshot({ debtTotal, savingsTotal, investmentTotal, className }: PersonalSnapshotProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };

  const getDebtStatus = () => {
    if (debtTotal === 0) return { status: 'debt-free', color: 'var(--color-success-main)', icon: '🎉' };
    if (debtTotal < 10000) return { status: 'low-debt', color: 'var(--color-warning-main)', icon: '⚠️' };
    return { status: 'high-debt', color: 'var(--color-debt)', icon: '🚨' };
  };

  const getSavingsStatus = () => {
    if (savingsTotal === 0) return { status: 'no-savings', color: 'var(--color-error-main)', icon: '📉' };
    if (savingsTotal < 5000) return { status: 'building', color: 'var(--color-warning-main)', icon: '🏗️' };
    return { status: 'strong', color: 'var(--color-savings)', icon: '💪' };
  };

  const getInvestmentStatus = () => {
    if (investmentTotal === 0) return { status: 'not-investing', color: 'var(--color-text-secondary)', icon: '📊' };
    if (investmentTotal < 10000) return { status: 'starting', color: 'var(--color-investing)', icon: '🌱' };
    return { status: 'growing', color: 'var(--color-success-main)', icon: '📈' };
  };

  const debtStatus = getDebtStatus();
  const savingsStatus = getSavingsStatus();
  const investmentStatus = getInvestmentStatus();

  return (
    <Card className={`personal-snapshot ${className || ''}`}>
      <div className="snapshot-header">
        <h3 className="snapshot-title">Your Financial Snapshot</h3>
        <p className="snapshot-subtitle">Key metrics driving your strategy recommendations</p>
      </div>
      
      <div className="snapshot-metrics">
        <div className="metric-item">
          <div className="metric-icon" style={{ color: debtStatus.color }}>
            {debtStatus.icon}
          </div>
          <div className="metric-content">
            <div className="metric-label">Debt</div>
            <div className="metric-value" style={{ color: debtStatus.color }}>
              {formatCurrency(debtTotal)}
            </div>
          </div>
        </div>
        
        <div className="metric-divider"></div>
        
        <div className="metric-item">
          <div className="metric-icon" style={{ color: savingsStatus.color }}>
            {savingsStatus.icon}
          </div>
          <div className="metric-content">
            <div className="metric-label">Savings</div>
            <div className="metric-value" style={{ color: savingsStatus.color }}>
              {formatCurrency(savingsTotal)}
            </div>
          </div>
        </div>
        
        <div className="metric-divider"></div>
        
        <div className="metric-item">
          <div className="metric-icon" style={{ color: investmentStatus.color }}>
            {investmentStatus.icon}
          </div>
          <div className="metric-content">
            <div className="metric-label">Investments</div>
            <div className="metric-value" style={{ color: investmentStatus.color }}>
              {formatCurrency(investmentTotal)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="snapshot-insight">
        <div className="insight-icon">💡</div>
        <div className="insight-text">
          {debtTotal > savingsTotal ? 
            "Focus on debt reduction to strengthen your financial foundation" :
          savingsTotal < 5000 ?
            "Build your emergency fund before taking on investment risk" :
          investmentTotal === 0 ?
            "Consider starting to invest for long-term wealth building" :
            "Great balance! Consider optimizing your allocation strategy"
          }
        </div>
      </div>
    </Card>
  );
}
