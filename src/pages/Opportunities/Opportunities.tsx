import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../state/AppStateContext';
import { Icon, IconNames } from '../../components/Icon';
import AppHeader from '../../app/components/AppHeader';
import { Button, ButtonVariants } from '../../components/Button';
import { dismissInsights } from '../../hooks/useInsightsCount';
import { OpportunitiesDashboard } from '../../components/OpportunitiesDashboard';
import { Opportunity } from '../../data/marketData';
import { EnhancedUserProfile } from '../../data/enhancedUserProfile';
import { UserProfileUtils } from '../../data/enhancedUserProfile';
import { Goal as AppGoal } from '../../app/types';
import './Opportunities.css';

export function Opportunities() {
  const navigate = useNavigate();
  const {
    accounts = [],
    userProfile,
    goals = []
  } = useAppState();

  // Convert AppGoal to data Goal type for OpportunitiesDashboard
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

  // Create enhanced user profile for AI foundation components
  const enhancedUserProfile = useMemo((): EnhancedUserProfile => {
    return UserProfileUtils.createEnhancedProfile(userProfile, accounts, convertedGoals);
  }, [userProfile, accounts, convertedGoals]);

  // Handle opportunity actions
  const handleOpportunityAction = (opportunity: Opportunity) => {
    // For now, just show an alert - in a real app, this would navigate to relevant pages
    console.log('Opportunity action clicked:', opportunity);
    // You could navigate to specific pages based on opportunity type
    // e.g., navigate('/strategies') for investment opportunities
  };

  // Dismiss insights badge when user visits the opportunities page
  useEffect(() => {
    dismissInsights();
  }, []);

  return (
    <div className="opportunities-page">
      <AppHeader
        title="Opportunities"
        leftAction={
          <Button
            variant={ButtonVariants.text}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <Icon name={IconNames.arrow_back} size="sm" />
          </Button>
        }
      />

      <div className="opportunities-content">
        {/* Use AI Foundation Opportunities Dashboard */}
        <OpportunitiesDashboard
          userProfile={enhancedUserProfile}
          accounts={accounts}
          goals={convertedGoals}
          onOpportunityAction={handleOpportunityAction}
        />
      </div>
    </div>
  );
}
