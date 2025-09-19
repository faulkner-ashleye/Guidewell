import React from 'react';
import { Opportunity } from '../data/marketData';
import './OpportunityCard.css';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onActionClick: (opportunity: Opportunity) => void;
  onDismiss: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, onActionClick, onDismiss }: OpportunityCardProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#10B981'; // green
      case 'medium': return '#F59E0B'; // yellow
      case 'low': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

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
      <div className="opportunity-header">
        <div className="opportunity-title">
          <h3>{opportunity.description.split('.')[0]}</h3>
          <div className="opportunity-badges">
            <span 
              className="confidence-badge"
              style={{ backgroundColor: getConfidenceColor(opportunity.confidence) }}
            >
              {opportunity.confidence} confidence
            </span>
          </div>
        </div>
        <button 
          className="dismiss-button"
          onClick={() => onDismiss(opportunity.id)}
          aria-label="Dismiss opportunity"
        >
          ×
        </button>
      </div>

      <div className="opportunity-details">
        <div className="opportunity-metrics">
          <div className="metric">
            <span className="metric-label">Current Rate</span>
            <span className="metric-value">{opportunity.currentValue}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Potential Rate</span>
            <span className="metric-value">{opportunity.potentialValue}%</span>
          </div>
          <div className="metric highlight">
            <span className="metric-label">Annual Savings</span>
            <span className="metric-value">${opportunity.potentialSavings.toFixed(2)}</span>
          </div>
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

        <div className="opportunity-action">
          <div className="action-required">
            <strong>Action Required:</strong> {opportunity.actionRequired}
          </div>
          <div className="estimated-impact">
            <strong>Estimated Impact:</strong> {opportunity.estimatedImpact}
          </div>
        </div>
      </div>

      <div className="opportunity-footer">
        <button 
          className="action-button primary"
          onClick={() => onActionClick(opportunity)}
        >
          Learn More
        </button>
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
