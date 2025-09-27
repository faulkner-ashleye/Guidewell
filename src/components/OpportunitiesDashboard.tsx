import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityAnalysis } from '../data/marketData';
import { OpportunityCard } from './OpportunityCard';
import { marketDataService } from '../services/marketDataService';
import { OpportunityDetection } from '../data/marketData';
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
  const [filter, setFilter] = useState<'all' | 'quick_wins' | 'high_impact' | 'low_risk'>('all');

  useEffect(() => {
    loadOpportunities();
  }, [userProfile, accounts, goals]);

  const loadOpportunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use AI to generate personalized opportunities
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          accounts,
          goals,
          analysisType: 'opportunities'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Extract opportunities from AI response
        const opportunities = data.recommendations?.map((rec: string, index: number) => ({
          id: `opp-${index}`,
          title: rec,
          type: 'savings' as const,
          potentialSavings: Math.floor(Math.random() * 2000) + 500, // Mock savings amount
          difficulty: 'medium' as const,
          timeframe: '3-6 months' as const,
          description: rec,
          actionRequired: 'Review and implement',
          impact: 'medium' as const
        })) || [];

        setOpportunities({
          opportunities,
          totalPotentialSavings: opportunities.reduce((sum: number, opp: any) => sum + opp.potentialSavings, 0),
          highImpactOpportunities: opportunities.filter((opp: any) => opp.impact === 'high'),
          quickWins: opportunities.filter((opp: any) => opp.difficulty === 'easy'),
          summary: data.summary || 'AI-generated personalized opportunities based on your financial profile.'
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

    let filtered = opportunities.opportunities.filter(
      opp => !dismissedOpportunities.has(opp.id)
    );

    switch (filter) {
      case 'quick_wins':
        filtered = filtered.filter(opp => opp.effort === 'low' && opp.timeframe === 'immediate');
        break;
      case 'high_impact':
        filtered = filtered.filter(opp => opp.potentialSavings > 500);
        break;
      case 'low_risk':
        filtered = filtered.filter(opp => opp.risk === 'low');
        break;
      default:
        // Show all opportunities
        break;
    }

    return filtered.sort((a, b) => b.potentialSavings - a.potentialSavings);
  };

  const getMarketDataStatus = () => {
    const lastUpdate = marketDataService.getLastUpdateTime();
    const isStale = marketDataService.isMarketDataStale();
    
    if (!lastUpdate) return 'Never updated';
    if (isStale) return 'Data may be outdated';
    
    const hoursAgo = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60));
    if (hoursAgo < 1) return 'Updated recently';
    if (hoursAgo < 24) return `Updated ${hoursAgo} hours ago`;
    return `Updated ${Math.floor(hoursAgo / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="opportunities-dashboard">
        <div className="dashboard-header">
          <h2>Financial Opportunities</h2>
          <div className="market-data-status">
            <span className="status-indicator loading">Loading...</span>
          </div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Analyzing your financial situation for opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-dashboard">
        <div className="dashboard-header">
          <h2>Financial Opportunities</h2>
        </div>
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
      <div className="dashboard-header">
        <h2>Financial Opportunities</h2>
        <div className="market-data-status">
          <span className="status-indicator">Market data: {getMarketDataStatus()}</span>
          <button 
            className="refresh-button"
            onClick={loadOpportunities}
            title="Refresh market data"
          >
            🔄
          </button>
        </div>
      </div>

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

      <div className="filter-controls">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({opportunities?.opportunities.length || 0})
        </button>
        <button 
          className={`filter-button ${filter === 'quick_wins' ? 'active' : ''}`}
          onClick={() => setFilter('quick_wins')}
        >
          Quick Wins ({opportunities?.quickWins.length || 0})
        </button>
        <button 
          className={`filter-button ${filter === 'high_impact' ? 'active' : ''}`}
          onClick={() => setFilter('high_impact')}
        >
          High Impact ({opportunities?.highImpactOpportunities.length || 0})
        </button>
        <button 
          className={`filter-button ${filter === 'low_risk' ? 'active' : ''}`}
          onClick={() => setFilter('low_risk')}
        >
          Low Risk ({opportunities?.opportunities.filter(o => o.risk === 'low').length || 0})
        </button>
      </div>

      <div className="opportunities-list">
        {filteredOpportunities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No opportunities found</h3>
            <p>
              {filter === 'all' 
                ? "Great job! We couldn't find any significant financial opportunities at this time."
                : `No ${filter.replace('_', ' ')} opportunities found. Try a different filter.`
              }
            </p>
            {filter !== 'all' && (
              <button 
                className="clear-filter-button"
                onClick={() => setFilter('all')}
              >
                Show All Opportunities
              </button>
            )}
          </div>
        ) : (
          filteredOpportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onActionClick={handleOpportunityAction}
              onDismiss={handleDismissOpportunity}
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
