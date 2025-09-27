import React from 'react';
import { Opportunity } from '../data/marketData';
import './OpportunityCard.css';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onActionClick: (opportunity: Opportunity) => void;
  onDismiss: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, onActionClick, onDismiss }: OpportunityCardProps) {

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'low': return '⚡';
      case 'medium': return '🔧';
      case 'high': return '🏗️';
      default: return '📋';
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return '🚀';
      case 'short_term': return '📅';
      case 'long_term': return '🗓️';
      default: return '⏰';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="opportunity-card">
      <button 
        className="dismiss-button"
        onClick={() => onDismiss(opportunity.id)}
        aria-label="Dismiss opportunity"
      >
        ×
      </button>
      <div className="opportunity-details">
        <div className="opportunity-metrics">
          {opportunity.currentValue !== undefined && opportunity.currentValue !== null && opportunity.currentValue > 0 && (
            <div className="metric">
              <span className="metric-label">Current Rate</span>
              <span className="metric-value">{opportunity.currentValue}%</span>
            </div>
          )}
          {opportunity.potentialValue !== undefined && opportunity.potentialValue !== null && opportunity.potentialValue > 0 && (
            <div className="metric">
              <span className="metric-label">Potential Rate</span>
              <span className="metric-value">{opportunity.potentialValue}%</span>
            </div>
          )}
          {opportunity.potentialSavings !== undefined && opportunity.potentialSavings !== null && opportunity.potentialSavings > 0 && (
            <div className="metric highlight">
              <span className="metric-label">Annual Savings</span>
              <span className="metric-value">${opportunity.potentialSavings.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="opportunity-attributes">
          <div className="attribute">
            <span className="attribute-icon">{getEffortIcon(opportunity.effort)}</span>
            <span className="attribute-text">{opportunity.effort} effort</span>
          </div>
          <div className="attribute">
            <span className="attribute-icon">{getTimeframeIcon(opportunity.timeframe)}</span>
            <span className="attribute-text">{opportunity.timeframe.replace('_', ' ')}</span>
          </div>
          <div className="attribute">
            <span className="attribute-icon">{getRiskIcon(opportunity.risk)}</span>
            <span className="attribute-text">{opportunity.risk} risk</span>
          </div>
        </div>

        <div className="opportunity-description">
          <p>{opportunity.description}</p>
        </div>

      </div>

      <div className="opportunity-footer">
        <button 
          className="action-button secondary"
          onClick={() => onDismiss(opportunity.id)}
        >
          Not Now
        </button>
      </div>
    </div>
  );
}
