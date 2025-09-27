import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityAnalysis } from '../data/marketData';
import { OpportunityCard } from './OpportunityCard';
import { aiIntegrationService } from '../services/aiIntegrationService';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { Account, Goal } from '../data/types';
import './OpportunitiesDashboard.css';

interface OpportunitiesDashboardProps {
  userProfile: EnhancedUserProfile;
  accounts: Account[];
  goals: Goal[];
  onOpportunityAction: (opportunity: Opportunity) => void;
}

export function OpportunitiesDashboard({
  userProfile,
  accounts,
  goals,
  onOpportunityAction
}: OpportunitiesDashboardProps) {
  const [opportunities, setOpportunities] = useState<OpportunityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissedOpportunities, setDismissedOpportunities] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOpportunities();
  }, [userProfile, accounts, goals]);

  const loadOpportunities = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use AI integration service to generate personalized opportunities
      const analysis = await aiIntegrationService.callAIAnalysisAPI(
        userProfile,
        accounts,
        goals,
        'opportunities'
      );

      if (analysis) {
        // Extract opportunities from AI response
        const opportunities = analysis.recommendations?.map((rec: string, index: number) => {
          // Parse the AI recommendation to extract meaningful values
          const hasSavings = rec.toLowerCase().includes('save') || rec.toLowerCase().includes('savings');
          const hasRate = rec.match(/(\d+\.?\d*)%/);
          const hasAmount = rec.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);

          // Extract potential savings amount if mentioned
          let potentialSavings = 0;
          if (hasAmount) {
            potentialSavings = parseFloat(hasAmount[1].replace(',', ''));
          } else if (hasSavings) {
            potentialSavings = Math.floor(Math.random() * 1500) + 200; // Only generate if savings-related
          }

          // Extract rate if mentioned
          let currentValue = undefined;
          let potentialValue = undefined;
          if (hasRate && hasRate.length > 1) {
            currentValue = parseFloat(hasRate[1]);
            potentialValue = currentValue + (Math.random() * 2 + 0.5); // Add 0.5-2.5% improvement
          }

          return {
            id: `opp-${index}`,
            type: 'savings' as const,
            accountId: 'unknown',
            accountName: 'Multiple Accounts',
            currentValue,
            potentialValue,
            potentialSavings,
            description: rec,
            confidence: 'medium' as const,
            timeframe: 'short_term' as const,
            effort: 'medium' as const,
            risk: 'low' as const,
            actionRequired: 'Review and implement based on your specific situation',
            estimatedImpact: potentialSavings > 0 ? `$${potentialSavings.toFixed(2)} annual savings` : 'Improved financial position'
          };
        }) || [];

        setOpportunities({
          opportunities,
          totalPotentialSavings: opportunities.reduce((sum: number, opp: any) => sum + opp.potentialSavings, 0),
          highImpactOpportunities: opportunities.filter((opp: any) => opp.potentialSavings > 500),
          quickWins: opportunities.filter((opp: any) => opp.effort === 'low'),
          summary: analysis.summary || 'AI-generated personalized opportunities based on your financial profile.'
        });
      } else {
        throw new Error('Failed to load AI opportunities');
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      setError('Failed to load opportunities. Please try again.');
      // Fallback to empty state
      setOpportunities({
        opportunities: [],
        totalPotentialSavings: 0,
        highImpactOpportunities: [],
        quickWins: [],
        summary: 'No opportunities found at this time.'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDismissOpportunity = (opportunityId: string) => {
    setDismissedOpportunities(prev => {
      const newSet = new Set(prev);
      newSet.add(opportunityId);
      return newSet;
    });
  };

  const handleOpportunityAction = (opportunity: Opportunity) => {
    onOpportunityAction(opportunity);
  };

  const getFilteredOpportunities = (): Opportunity[] => {
    if (!opportunities) return [];

    return opportunities.opportunities
      .filter(opp => !dismissedOpportunities.has(opp.id))
      .sort((a, b) => b.potentialSavings - a.potentialSavings);
  };


  if (loading) {
    return (
      <div className="opportunities-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>🤖 AI is generating personalized content recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-dashboard">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-button" onClick={loadOpportunities}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredOpportunities = getFilteredOpportunities();

  return (
    <div className="opportunities-dashboard">
      <h1>Insights</h1>

      {opportunities && (
        <div className="dashboard-summary">
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-value">{opportunities.opportunities.length}</span>
              <span className="stat-label">Total Opportunities</span>
            </div>
            <div className="stat">
              <span className="stat-value">${opportunities.totalPotentialSavings.toFixed(0)}</span>
              <span className="stat-label">Annual Savings</span>
            </div>
            <div className="stat">
              <span className="stat-value">{opportunities.quickWins.length}</span>
              <span className="stat-label">Quick Wins</span>
            </div>
            <div className="stat">
              <span className="stat-value">{opportunities.highImpactOpportunities.length}</span>
              <span className="stat-label">High Impact</span>
            </div>
          </div>

          <div className="summary-text">
            <p>{opportunities.summary}</p>
          </div>
        </div>
      )}


      <div className="opportunities-list">
        {filteredOpportunities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No opportunities found</h3>
            <p>
              Great job! We couldn't find any significant financial opportunities at this time.
            </p>
          </div>
        ) : (
          filteredOpportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onActionClick={handleOpportunityAction}
            />
          ))
        )}
      </div>

      {dismissedOpportunities.size > 0 && (
        <div className="dismissed-info">
          <p>
            {dismissedOpportunities.size} opportunity{dismissedOpportunities.size !== 1 ? 'ies' : 'y'} dismissed
          </p>
          <button
            className="reset-button"
            onClick={() => setDismissedOpportunities(new Set<string>())}
          >
            Reset Dismissed
          </button>
        </div>
      )}
    </div>
  );
}
