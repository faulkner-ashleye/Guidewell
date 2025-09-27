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


        <div className="opportunity-description">
          <p>{opportunity.description}</p>
        </div>

      </div>
    </div>
  );
}
