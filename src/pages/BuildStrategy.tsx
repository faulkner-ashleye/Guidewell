import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../app/components/AppHeader';
import { QuestionBlock } from '../components/QuestionBlock';
import { ChipGroup, Chip } from '../components/ChipGroup';
import { ContributionEditor } from './strategies/components/ContributionEditor';
import { AvatarSelector } from '../components/AvatarSelector';
import { NarrativeAvatar } from '../data/narrativeAvatars';
import { Icon, IconNames } from '../components/Icon';
import { useAppState } from '../state/AppStateContext';
import './BuildStrategy.css';

type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';

type ScopeType = 'all' | 'debts' | 'savings' | 'investing';
type TimeframeType = 'short' | 'mid' | 'long';

export function BuildStrategy() {
  const navigate = useNavigate();
  
  // Get app state
  const { accounts = [], transactions = [], goals = [] } = useAppState();

  // Scroll to top when component mounts
  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const scrollToTop = () => {
      // Scroll the phone content to top
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.scrollTo(0, 0);
      }
      // Also scroll window as fallback
      window.scrollTo(0, 0);
    };
    
    // Immediate scroll
    scrollToTop();
    
    // Delayed scroll as backup
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // State management
  const [scope, setScope] = useState<ScopeType>();
  const [scopeSelection, setScopeSelection] = useState<'all' | 'one'>(); // New: all vs one selection
  const [accountId, setAccountId] = useState<string>();
  const [selectedAvatar, setSelectedAvatar] = useState<NarrativeAvatar | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>();
  const [extra, setExtra] = useState<number>();
  
  // Calculate goals monthly contribution
  const goalsMonthly = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);
  
  // Animation state
  const [animateStep, setAnimateStep] = useState<number>(1);

  // Real accounts organized by type for dropdown
  const accountsByType = {
    debts: accounts.filter(acc => acc.type === 'credit_card' || acc.type === 'loan'),
    savings: accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings'),
    investing: accounts.filter(acc => acc.type === 'investment')
  };

  const handleBack = () => {
    navigate('/strategies');
  };

  const handleScopeSelect = (selectedScope: ScopeType) => {
    setScope(selectedScope);
    setScopeSelection(undefined); // Reset secondary selection
    setAccountId(undefined); // Reset account selection
    
    if (selectedScope === 'all') {
      // If "All accounts" is selected, we can proceed immediately
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleScopeSelectionSelect = (selection: 'all' | 'one') => {
    setScopeSelection(selection);
    setAccountId(undefined); // Reset account selection
    
    if (selection === 'all') {
      // If "all" is selected for the specific scope, we can proceed
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleAccountSelect = (selectedAccountId: string) => {
    setAccountId(selectedAccountId);
    // Once an account is selected, we can proceed to the next step
    setTimeout(() => setAnimateStep(2), 300);
  };

  const handleAvatarSelect = (avatar: NarrativeAvatar) => {
    setSelectedAvatar(avatar);
    
    // Trigger animation for next step
    setTimeout(() => setAnimateStep(3), 300);
  };

  const handleTimeframeSelect = (selectedTimeframe: TimeframeType) => {
    setTimeframe(selectedTimeframe);
    // Trigger animation for next step
    setTimeout(() => setAnimateStep(4), 300);
  };




  const handleViewBreakdown = () => {
    console.log('Build Strategy button clicked!', { scope, selectedAvatar, timeframe, extra });
    // Navigate to custom strategy page with current data
    navigate('/custom-strategy', {
      state: {
        scope,
        strategy: selectedAvatar?.id,
        avatar: selectedAvatar,
        timeframe,
        extra
      }
    });
  };


  // Check if each step is completed
  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1: return scope !== undefined && (scope === 'all' || scopeSelection === 'all' || !!accountId);
      case 2: return selectedAvatar !== null;
      case 3: return timeframe !== undefined;
      case 4: return true; // Extra contribution is optional, always considered "completed"
      default: return false;
    }
  };

  return (
    <div className="build-strategy-page">
      <AppHeader 
        title="Build Your Strategy"
        leftAction={
          <button
            onClick={handleBack}
            className="back-button"
          >
            <Icon name={IconNames.arrow_back} size="lg" />
          </button>
        }
      />

      <div className="build-strategy-content">
        {/* Step 1: Scope Selection */}
        <div 
          className={`strategy-step ${animateStep >= 1 ? 'animate-slide-up' : 'animate-fade-in'}`}
        >
          <QuestionBlock
            title="Step 1: Choose Your Scope"
            description="What financial area would you like to focus on?"
            completed={isStepCompleted(1)}
            locked={isStepCompleted(1)}
          >
          <ChipGroup>
            <Chip 
              label="All accounts" 
              selected={scope === 'all'} 
              onClick={() => handleScopeSelect('all')}
            />
            <Chip 
              label="Debts" 
              selected={scope === 'debts'} 
              onClick={() => handleScopeSelect('debts')}
              variant="warning"
            />
            <Chip 
              label="Savings" 
              selected={scope === 'savings'} 
              onClick={() => handleScopeSelect('savings')}
              variant="success"
            />
            <Chip 
              label="Investing" 
              selected={scope === 'investing'} 
              onClick={() => handleScopeSelect('investing')}
            />
          </ChipGroup>

          {/* Secondary selection for specific scopes */}
          {scope && scope !== 'all' && (
            <div className="scope-secondary-selection">
              <div className="scope-secondary-label">
                Choose scope for {scope}:
              </div>
              <ChipGroup>
                <Chip 
                  label={`All ${scope}`} 
                  selected={scopeSelection === 'all'} 
                  onClick={() => handleScopeSelectionSelect('all')}
                />
                <Chip 
                  label="Just one" 
                  selected={scopeSelection === 'one'} 
                  onClick={() => handleScopeSelectionSelect('one')}
                />
              </ChipGroup>
            </div>
          )}

          {/* Account dropdown for single account selection */}
          {scope && scope !== 'all' && scopeSelection === 'one' && (
            <div className="account-selection">
              <label className="account-selection-label">
                Select Account:
              </label>
              <select
                value={accountId || ''}
                onChange={(e) => handleAccountSelect(e.target.value)}
                className="account-selection-dropdown"
              >
                <option value="">Choose an account...</option>
                {scope && accountsByType[scope]?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} (${account.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}
          </QuestionBlock>
        </div>

        {/* Step 2: Strategy Selection */}
        {scope && (scope === 'all' || scopeSelection === 'all' || accountId) && (
        <div 
          className={`strategy-step ${animateStep >= 2 ? 'animate-slide-up' : 'animate-fade-in'}`}
        >
            <QuestionBlock
              title="Step 2: Choose Your Strategy"
              description="Select a strategy that aligns with your goals"
              completed={isStepCompleted(2)}
              locked={isStepCompleted(2)}
            >
            <AvatarSelector
              accountTypes={accounts.map(account => account.type)}
              focusCategory={scope === 'debts' ? 'debt' : scope === 'savings' ? 'savings' : scope === 'investing' ? 'investment' : undefined}
              selectedAvatar={selectedAvatar?.id}
              onAvatarSelect={handleAvatarSelect}
            />
            </QuestionBlock>
          </div>
        )}

        {/* Step 3: Timeframe Selection */}
        {selectedAvatar && (
        <div 
          className={`strategy-step ${animateStep >= 3 ? 'animate-slide-up' : 'animate-fade-in'}`}
        >
            <QuestionBlock
              title="Step 3: Set Your Timeline"
              description="How long do you want to follow this strategy?"
              completed={isStepCompleted(3)}
              locked={isStepCompleted(3)}
            >
            <ChipGroup>
              <Chip 
                label="Short (6-12 months)" 
                selected={timeframe === 'short'} 
                onClick={() => handleTimeframeSelect('short')}
              />
              <Chip 
                label="Mid (1-3 years)" 
                selected={timeframe === 'mid'} 
                onClick={() => handleTimeframeSelect('mid')}
              />
              <Chip 
                label="Long (3+ years)" 
                selected={timeframe === 'long'} 
                onClick={() => handleTimeframeSelect('long')}
              />
            </ChipGroup>
            </QuestionBlock>
          </div>
        )}

        {/* Step 4: Extra Contribution Input */}
        {timeframe && (
        <div 
          className={`strategy-step ${animateStep >= 4 ? 'animate-slide-up' : 'animate-fade-in'}`}
        >
            <QuestionBlock
              title="Step 4: Extra Contribution (Optional)"
              description="How much extra can you contribute monthly? Leave blank if you don't want to specify."
              completed={isStepCompleted(4)}
              locked={false}
            >
            <ContributionEditor
              extra={extra}
              strategy={(selectedAvatar?.id || 'debt_crusher') as Strategy}
              scope={scope || 'all'}
              accounts={accounts}
              transactions={transactions}
              goalsMonthly={goalsMonthly}
              onExtraChange={setExtra}
            />
            
            {/* Debug Info */}
            <div className="debug-info">
              <strong>Debug Info:</strong><br/>
              Scope: {scope || 'undefined'}<br/>
              Strategy: {selectedAvatar?.name || 'undefined'}<br/>
              Timeframe: {timeframe || 'undefined'}<br/>
              Extra: {extra || 'undefined'}<br/>
              Button disabled: {(!scope || !selectedAvatar || !timeframe).toString()}
            </div>

            {/* Build Strategy Button */}
            <div className="build-strategy-button-container">
              <button
                onClick={(e) => {
                  console.log('Button clicked!', e);
                  console.log('Current state:', { scope, selectedAvatar, timeframe, extra });
                  handleViewBreakdown();
                }}
                disabled={!scope || !selectedAvatar || !timeframe}
                className={`build-strategy-button ${
                  (!scope || !selectedAvatar || !timeframe) 
                    ? 'build-strategy-button-disabled' 
                    : 'build-strategy-button-enabled'
                }`}
                onMouseEnter={(e) => {
                  if (!(!scope || !selectedAvatar || !timeframe)) {
                    e.currentTarget.style.background = '#059669';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!scope || !selectedAvatar || !timeframe)) {
                    e.currentTarget.style.background = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                Build Strategy
              </button>
            </div>
            </QuestionBlock>
          </div>
        )}


        {/* Footer */}
        <div className="build-strategy-footer">
        </div>
      </div>
    </div>
  );
}
