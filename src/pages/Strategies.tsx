import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import AppHeader from '../app/components/AppHeader';
import { useAppState } from '../state/AppStateContext';
import { sumByType } from '../state/selectors';
import './Strategies.css';

export function Strategies() {
  const navigate = useNavigate();
  
  // Get real account data
  const { accounts = [], userProfile } = useAppState();
  
  // Calculate financial summary
  const savingsTotal = sumByType(accounts, ['checking', 'savings']);
  const debtTotal = sumByType(accounts, ['credit_card', 'loan']);
  const investmentTotal = sumByType(accounts, ['investment']);
  
  const hasData = accounts.length > 0;
  const hasDebt = debtTotal > 0;
  const hasSavings = savingsTotal > 0;
  const hasInvestments = investmentTotal > 0;

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
        {/* Intro Card */}
        <Card className="intro-card">
          <h2 className="intro-title">
            Your starting line
          </h2>
          <p className="intro-description">
            Choose a strategy that fits your financial goals and timeline.
          </p>
        </Card>

        {/* Strategy Cards */}
        <div className="grid-auto mb-lg">
          {/* Recommended Strategy Card */}
          <Card className="strategy-card recommended">
            <div className="strategy-card-header">
              <div className="strategy-card-icon">⭐</div>
              <h3 className="strategy-card-title">
                Recommended Strategy
              </h3>
            </div>
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
            <button 
              onClick={handleViewStrategy}
              className="strategy-button strategy-button--primary"
            >
              View strategy
            </button>
          </Card>

          {/* Build Your Own Strategy Card */}
          <Card className="strategy-card build-your-own">
            <div className="strategy-card-header">
              <div className="strategy-card-icon">🛠️</div>
              <h3 className="strategy-card-title">
                Build Your Own Strategy
              </h3>
            </div>
            <p className="strategy-card-description">
              Create a custom financial strategy tailored to your specific goals and risk tolerance.
            </p>
            <button 
              onClick={handleBuildStrategy}
              className="strategy-button strategy-button--secondary"
            >
              Start building
            </button>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted text-xs">
        </div>
      </div>
    </div>
  );
}
