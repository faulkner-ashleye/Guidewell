import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button, ButtonVariants, ButtonColors } from '../components/Button';
import AppHeader from '../app/components/AppHeader';
import { useAppState } from '../state/AppStateContext';
import { sumByType, getHighestAPR } from '../state/selectors';
import { ProgressMilestoneTracker } from '../components/ProgressMilestoneTracker';
import { PersonalSnapshot } from '../components/PersonalSnapshot';
import { TradeoffHighlight } from '../components/TradeoffHighlight';
import { FinancialJourneyChart } from '../components/FinancialJourneyChart';
import { AvatarUtils, NarrativeAvatar } from '../data/narrativeAvatars';
import { DebtCrusherSVG, BuildYourOwnSVG } from '../components/ThemeAwareSVG';
import '../components/Button.css';
import './Strategies.css';

export function Strategies() {
  const navigate = useNavigate();

  // Get real account data
  const { accounts = [], userProfile, goals = [] } = useAppState();

  // Calculate financial summary
  const savingsTotal = sumByType(accounts, ['checking', 'savings']);
  const debtTotal = Math.abs(sumByType(accounts, ['credit_card', 'loan'])); // Use absolute value for debt
  const investmentTotal = sumByType(accounts, ['investment']);
  const highestAPR = getHighestAPR(accounts);

  // Debug: Log the actual accounts data
  console.log('Strategy page - Raw accounts data:', accounts);
  console.log('Strategy page - Account types:', accounts.map(acc => ({ name: acc.name, type: acc.type, balance: acc.balance })));

  const hasData = accounts.length > 0;
  const hasDebt = debtTotal > 0;
  const hasSavings = savingsTotal > 0;
  const hasInvestments = investmentTotal > 0;

  // Determine current financial stage
  const getCurrentStage = (): 'foundation' | 'growth' | 'wealth' => {
    if (!hasData) return 'foundation';

    // Foundation: High debt relative to savings, or no emergency fund
    if (hasDebt && debtTotal > savingsTotal * 2) return 'foundation';
    if (!hasSavings || savingsTotal < 5000) return 'foundation';

    // Growth: Has savings but limited investments
    if (hasSavings && (!hasInvestments || investmentTotal < savingsTotal)) return 'growth';

    // Wealth: Strong investment portfolio
    return 'wealth';
  };

  const currentStage = getCurrentStage();

  // Determine recommended strategy based on user's financial situation
  const getRecommendedStrategy = (): NarrativeAvatar => {
    console.log('Strategy recommendation debug:', {
      hasData,
      hasDebt,
      hasSavings,
      hasInvestments,
      savingsTotal,
      debtTotal,
      investmentTotal,
      highestAPR
    });

    if (!hasData) {
      console.log('No data - returning goal_keeper');
      return AvatarUtils.getAvatarById('goal_keeper')!; // Default for new users
    }

    // High debt situation - recommend debt-focused strategy
    if (hasDebt && debtTotal > savingsTotal * 2) {
      console.log('High debt situation - returning debt_crusher');
      return AvatarUtils.getAvatarById('debt_crusher')!;
    }

    // Low savings situation - recommend savings-focused strategy
    if (!hasSavings || savingsTotal < 5000) {
      console.log('Low savings situation - returning goal_keeper');
      return AvatarUtils.getAvatarById('goal_keeper')!;
    }

    // Has savings but no investments - recommend investment strategy
    if (hasSavings && !hasInvestments) {
      console.log('Has savings but no investments - returning nest_builder');
      return AvatarUtils.getAvatarById('nest_builder')!;
    }

    // Balanced situation - recommend balanced approach
    console.log('Balanced situation - returning balanced_builder');
    return AvatarUtils.getAvatarById('balanced_builder')!;
  };

  const recommendedStrategy = getRecommendedStrategy();

  // Convert avatar ID to file name format
  const getPersonaFileName = (avatarId: string): string => {
    return avatarId.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  const handleBuildStrategy = () => {
    navigate('/build-strategy');

    // Ensure scroll to top after navigation
    setTimeout(() => {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.scrollTo(0, 0);
      }
    }, 50);
  };

  const handleViewStrategy = () => {
    // Navigate to custom strategy with recommended settings
    navigate('/custom-strategy', {
      state: {
        scope: 'all',
        strategy: recommendedStrategy.id,
        timeframe: 'mid',
        extra: 0,
        allocation: recommendedStrategy.allocation
      }
    });

    // Ensure scroll to top after navigation
    setTimeout(() => {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.scrollTo(0, 0);
      }
    }, 50);
  };

  return (
    <div className="strategies">
      <AppHeader title="Strategies" />


      <div className="strategy-page">
      <div className="journey-header">
        <div className="journey-title">
          <h1 className="typography-h1">Your financial journey</h1>
        </div>
      </div>
        {/* Financial Journey Chart */}
        <FinancialJourneyChart
          accounts={accounts}
          goals={goals}
          userProfile={userProfile}
        />

        <div className="strategy-cards-header">
        <h3 className="typography-h3">Choose how to explore</h3>
        </div>
        {/* Strategy Cards */}
        <div className="strategy-cards-container">
          {/* Recommended Strategy Card */}
          <Card className="strategy-card recommended">
            <div className="strategy-card-illustration">
              {recommendedStrategy.id === 'debt_crusher' ? (
                <DebtCrusherSVG className="strategy-illustration" />
              ) : (
                <div className="strategy-illustration-placeholder">
                  <div className="illustration-fallback">{recommendedStrategy.emoji}</div>
                </div>
              )}
              <div className="recommended-badge">Recommended</div>
            </div>
            <div className="card-content">
              <h3 className="strategy-card-title typography-h3">{recommendedStrategy.name}</h3>
              <p className="strategy-card-description">
                {recommendedStrategy.description}
              </p>
            </div>
            <div className="card-footer">
            <Button
              variant={ButtonVariants.text}
              color={ButtonColors.secondary}
              fullWidth={true}
              onClick={handleViewStrategy}
              className="strategy-action-button"
            >
              View strategy
            </Button>
            </div>
          </Card>

          {/* Build Your Own Strategy Card */}
          <Card className="strategy-card build-your-own">
            <div className="strategy-card-illustration">
              <BuildYourOwnSVG className="strategy-illustration" />
            </div>
            <div className="card-content">
              <h3 className="strategy-card-title typography-h3">Build your own strategy</h3>
              <p className="strategy-card-description">
                Try different allocations across debt, savings, and investing.
              </p>
            </div>
            <div className="card-footer">

            <Button
              variant={ButtonVariants.text}
              color={ButtonColors.secondary}
              fullWidth={true}
              onClick={handleBuildStrategy}
              className="strategy-action-button"
            >
              Start building
            </Button>
            </div>
          </Card>
        </div>

        {/* Tradeoff Highlight + Educational Tip */}
        <TradeoffHighlight
          userFinancialProfile={{
            hasDebt,
            hasSavings,
            hasInvestments,
            debtTotal,
            savingsTotal,
            investmentTotal,
            highestAPR: highestAPR ?? undefined,
            monthlyExpenses: 3000 // Default estimate, could be made dynamic
          }}
        />


      </div>
    </div>
  );
}
