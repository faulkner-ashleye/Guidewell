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
import '../components/Button.css';
import './Strategies.css';

export function Strategies() {
  const navigate = useNavigate();
  
  // Get real account data
  const { accounts = [], userProfile } = useAppState();
  
  // Calculate financial summary
  const savingsTotal = sumByType(accounts, ['checking', 'savings']);
  const debtTotal = sumByType(accounts, ['credit_card', 'loan']);
  const investmentTotal = sumByType(accounts, ['investment']);
  const highestAPR = getHighestAPR(accounts);
  
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

  const handleBuildStrategy = () => {
    navigate('/build-strategy');
  };

  const handleViewStrategy = () => {
    // Generate recommended strategy based on user's financial situation
    let recommendedStrategy = 'balanced_builder'; // default
    
    if (hasDebt && debtTotal > savingsTotal) {
      recommendedStrategy = 'debt_crusher';
    } else if (!hasSavings || savingsTotal < 5000) {
      recommendedStrategy = 'goal_keeper';
    } else if (hasSavings && !hasInvestments) {
      recommendedStrategy = 'nest_builder';
    }
    
    // Navigate to custom strategy with recommended settings
    navigate('/custom-strategy', {
      state: {
        scope: 'all',
        strategy: recommendedStrategy,
        timeframe: 'mid',
        extra: 0,
        allocation: undefined // Will use avatar default
      }
    });
  };

  return (
    <div className="strategies">
      <AppHeader title="Strategies" />

      <div className="p-lg container-md mx-auto">
        {/* Progress / Milestone Tracker */}
        <ProgressMilestoneTracker currentStage={currentStage} />

        {/* Personal Snapshot / Progress Strip */}
        <PersonalSnapshot 
          debtTotal={debtTotal}
          savingsTotal={savingsTotal}
          investmentTotal={investmentTotal}
        />

        {/* Strategy Cards */}
        <div className="grid-auto mb-lg">
          {/* Recommended Strategy Card */}
          <Card className="strategy-card recommended">
            <div className="card-header">
              <div className="strategy-card-icon">⭐</div>
              <h3 className="card-title">
                Recommended Strategy
              </h3>
            </div>
            <div className="card-body">
              <p className="strategy-card-description">
                {hasData ? (
                  hasDebt && debtTotal > savingsTotal ? 
                    "Based on your current debt situation, we recommend focusing on debt reduction strategies to improve your financial foundation." :
                  !hasSavings || savingsTotal < 5000 ?
                    "Based on your current savings, we recommend building your emergency fund and savings goals first." :
                  hasSavings && !hasInvestments ?
                    "Based on your savings progress, we recommend starting to invest for long-term wealth building." :
                    "Based on your balanced financial profile, we recommend a diversified approach across debt, savings, and investments."
                ) : (
                  "Connect your accounts to get a personalized strategy recommendation based on your financial situation."
                )}
              </p>
            </div>
            <div className="card-footer">
              <Button 
                variant={ButtonVariants.contained}
                color={ButtonColors.secondary}
                fullWidth={true}
                onClick={handleViewStrategy}
              >
                View strategy
              </Button>
            </div>
          </Card>

          {/* Build Your Own Strategy Card */}
          <Card className="strategy-card build-your-own">
            <div className="card-header">
              <div className="strategy-card-icon">🛠️</div>
              <h3 className="card-title">
                Build Your Own Strategy
              </h3>
            </div>
            <div className="card-body">
              <p className="strategy-card-description">
                Create a custom financial strategy tailored to your specific goals and risk tolerance.
              </p>
            </div>
            <div className="card-footer">
              <Button 
                variant={ButtonVariants.outline}
                color={ButtonColors.secondary}
                fullWidth={true}
                onClick={handleBuildStrategy}
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
            highestAPR,
            monthlyExpenses: 3000 // Default estimate, could be made dynamic
          }}
        />

        {/* Footer */}
        <div className="text-center text-muted text-xs">
        </div>
      </div>
    </div>
  );
}
