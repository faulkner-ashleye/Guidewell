import React from 'react';
import { Opportunity } from '../data/marketData';
import { Icon, IconNames } from './Icon';
import './OpportunityCard.css';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onActionClick: (opportunity: Opportunity) => void;
  onDismiss: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, onActionClick, onDismiss }: OpportunityCardProps) {

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'low': return IconNames.lightbulb_outline;
      case 'medium': return IconNames.settings;
      case 'high': return IconNames.trending_up;
      default: return IconNames.info;
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return IconNames.auto_awesome;
      case 'short_term': return IconNames.schedule;
      case 'long_term': return IconNames.calendar_today;
      default: return IconNames.access_time;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return IconNames.check_circle;
      case 'medium': return IconNames.warning;
      case 'high': return IconNames.error;
      default: return IconNames.help;
    }
  };

  return (
    <div className="opportunity-card">
      <button 
        className="sheet-close"
        onClick={() => onDismiss(opportunity.id)}
        aria-label="Dismiss opportunity"
      >
        <Icon name={IconNames.close} size="md" />
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
            <span className="attribute-icon">
              <Icon name={getEffortIcon(opportunity.effort)} size="sm" />
            </span>
            <span className="attribute-text">{opportunity.effort} effort</span>
          </div>
          <div className="attribute">
            <span className="attribute-icon">
              <Icon name={getTimeframeIcon(opportunity.timeframe)} size="sm" />
            </span>
            <span className="attribute-text">{opportunity.timeframe.replace('_', ' ')}</span>
          </div>
          <div className="attribute">
            <span className="attribute-icon">
              <Icon name={getRiskIcon(opportunity.risk)} size="sm" />
            </span>
            <span className="attribute-text">{opportunity.risk} risk</span>
          </div>
        </div>

        <div className="opportunity-description">
          <p>{opportunity.description}</p>
        </div>

      </div>
    </div>
  );
}
