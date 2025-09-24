import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../app/components/AppHeader';
import { Icon, IconNames } from '../components/Icon';
import { Button, ButtonVariants, ButtonColors } from '../components/Button';
import { useAppState } from '../state/AppStateContext';
import { ScenarioTrajectoryChart } from '../components/ScenarioTrajectoryChart';
import { NarrativeCard } from './strategies/components/NarrativeCard';
import { StrategyCardSelect } from './strategies/components/StrategyCardSelect';
import { TimelineChips } from './strategies/components/TimelineChips';
import { ContributionEditor } from './strategies/components/ContributionEditor';
import { QuestionBlock } from '../components/QuestionBlock';
import { ChipGroup, Chip } from '../components/ChipGroup';
import { AvatarSelector } from '../components/AvatarSelector';
import { BreakdownModal } from '../app/strategies/components/BreakdownModal';
import { AvatarUtils } from '../data/narrativeAvatars';
import './CustomStrategy.css';

type Scope = 'all' | 'debts' | 'savings' | 'investing';
type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';
type Timeframe = 'short' | 'mid' | 'long';

export function CustomStrategy() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get app state
  const { accounts = [], transactions = [], goals = [] } = useAppState();

  // State management
  const [scope, setScope] = useState<Scope>('all');
  const [scopeSelection, setScopeSelection] = useState<'all' | 'one'>('all');
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [strategy, setStrategy] = useState<Strategy>('debt_crusher');
  const [timeframe, setTimeframe] = useState<Timeframe>('mid');
  const [extra, setExtra] = useState<number | undefined>(undefined);

  // Modal state
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [editParametersOpen, setEditParametersOpen] = useState(false);

  // Derived values
  // const maxMonths = timeframe === 'short' ? 12 : timeframe === 'mid' ? 60 : 120;

  // Calculate goals monthly contribution
  const goalsMonthly = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);

  // Real accounts organized by type for dropdown
  const accountsByType = {
    debts: accounts.filter(acc => acc.type === 'credit_card' || acc.type === 'loan'),
    savings: accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings'),
    investing: accounts.filter(acc => acc.type === 'investment')
  };

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

  // Prevent scrolling when edit parameters modal is open
  useEffect(() => {
    if (editParametersOpen) {
      // Prevent scrolling on the phone content area
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.add('modal-open');
      }
    } else {
      // Re-enable scrolling
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('modal-open');
      }
    }
    
    return () => {
      // Cleanup: re-enable scrolling when component unmounts
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('modal-open');
      }
    };
  }, [editParametersOpen]);

  // Initialize from query params or state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const state = location.state;

    if (state) {
      // Initialize from state passed from build strategy
      setScope(state.scope || 'all');
      setStrategy(state.strategy || 'debt_crusher');
      setTimeframe(state.timeframe || 'mid');
      setExtra(state.extra);
    } else if (searchParams.get('scope')) {
      // Initialize from query params
      setScope(searchParams.get('scope') as Scope || 'all');
      setStrategy(searchParams.get('strategy') as Strategy || 'debt_crusher');
      setTimeframe(searchParams.get('timeframe') as Timeframe || 'mid');
      const extraParam = searchParams.get('extra');
      setExtra(extraParam ? parseFloat(extraParam) : undefined);
    }
  }, [location]);

  // Separate effect to handle scroll to top after content is rendered
  useEffect(() => {
    // Disable browser scroll restoration for this page
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force immediate scroll to top using multiple methods
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also use setTimeout to ensure DOM is fully updated
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
    }, 50);

    return () => {
      clearTimeout(timer);
      // Re-enable scroll restoration when leaving
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const handleBack = () => {
    navigate('/strategies');
  };

  const handleRunAgain = () => {
    setEditParametersOpen(true);
  };

  const handleCloseEditParameters = () => {
    setEditParametersOpen(false);
  };

  const handleScopeSelect = (selectedScope: Scope) => {
    setScope(selectedScope);
    setScopeSelection('all'); // Reset to default
    setAccountId(undefined); // Reset account selection
  };

  const handleScopeSelectionSelect = (selection: 'all' | 'one') => {
    setScopeSelection(selection);
    setAccountId(undefined); // Reset account selection
  };

  const handleAccountSelect = (selectedAccountId: string) => {
    setAccountId(selectedAccountId);
  };

  const handleViewBreakdown = () => {
    setBreakdownOpen(true);
  };

  // Generate narrative based on current selections
  const generateNarrative = () => {
    const avatar = AvatarUtils.getAvatarById(strategy);
    if (!avatar) return 'Select a strategy to see your narrative.';

    const timeframeText = {
      short: '3-12 months',
      mid: '1-5 years',
      long: '5+ years'
    };

    const maxTimeText = {
      short: '12 months',
      mid: '5 years',
      long: '10 years'
    };

    const scopeText = scope === 'all' ? 'all accounts' : scope;

    let narrative = `This ${avatar.name} scenario focuses on ${scopeText} over ${timeframeText[timeframe]}. `;

    if (extra === undefined || extra === null || extra === 0) {
      narrative += `With $0/month toward savings, your goals could accelerate. `;
    } else {
      narrative += `With $${extra.toLocaleString()}/month toward savings, your goals could accelerate. `;
    }

    // Add strategy-specific details
    switch (strategy) {
      case 'debt_crusher':
        narrative += `This approach prioritizes paying down high-interest debt while maintaining minimum payments elsewhere.`;
        break;
      case 'goal_keeper':
        narrative += `This balanced approach focuses on building savings goals while managing debt responsibly.`;
        break;
      case 'nest_builder':
        narrative += `This long-term strategy emphasizes wealth building through investments while maintaining financial stability.`;
        break;
    }

    return narrative;
  };

  // Check if we have valid data to show
  const hasValidData = scope && strategy && timeframe;

  if (!hasValidData) {
    return (
      <div className="custom-strategy-page">
        <AppHeader
          title="Custom Strategy"
          leftAction={
            <button
              onClick={handleBack}
              className="back-button"
            >
              <Icon name={IconNames.arrow_back} size="lg" />
            </button>
          }
        />

        <div className="no-strategy-container">
          <h2 className="no-strategy-title">
            No Strategy Found
          </h2>
          <p className="no-strategy-description">
            No strategy data was found. Please build a strategy first.
          </p>
          <button
            onClick={() => navigate('/build-strategy')}
            className="no-strategy-button"
          >
            Build Strategy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-strategy-page">
      <AppHeader
        title="Custom Strategy"
        leftAction={
          <button
            onClick={handleBack}
            className="back-button"
          >
            <Icon name={IconNames.arrow_back} size="lg" />
          </button>
        }
      />

      <div className="custom-strategy-content">
        {/* Scenario Trajectory Chart */}
        <ScenarioTrajectoryChart
          accounts={accounts}
          goals={goals}
          strategy={strategy}
          timeframe={timeframe}
          scope={scope}
          extraMonthly={extra}
          onTimelineChange={(newTimeline) => {
            if (typeof newTimeline === 'string' && newTimeline !== 'custom') {
              setTimeframe(newTimeline as Timeframe);
            }
            // Note: 'custom' timeframe is handled internally by the chart component
          }}
          onExtraMonthlyChange={setExtra}
          className="scenario-chart"
        />

        {/* Narrative Card */}
        <NarrativeCard
          title={strategy === 'debt_crusher' ? 'Debt Crusher' :
                strategy === 'goal_keeper' ? 'Goal Keeper' : 'Nest Builder'}
          narrative={generateNarrative()}
          onViewBreakdown={handleViewBreakdown}
          className="card narrative-card"
        />

        {/* Edit Parameters Modal */}
        {editParametersOpen && (
          <div className="edit-parameters-modal-overlay" onClick={handleCloseEditParameters}>
            <div className="edit-parameters-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="edit-parameters-modal-header">
                <h2 className="edit-parameters-modal-title">
                  Edit Parameters
                </h2>
                <button
                  onClick={handleCloseEditParameters}
                  className="edit-parameters-modal-close-btn"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="edit-parameters-modal-body">
                {/* Step 1: Scope Selection */}
                <QuestionBlock
                  title="Step 1: Choose Your Scope"
                  description="What financial area would you like to focus on?"
                  completed={true}
                  locked={true}
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

                {/* Step 2: Strategy Selection */}
                <QuestionBlock
                  title="Step 2: Choose Your Strategy"
                  description="Select a strategy that aligns with your goals"
                  completed={true}
                  locked={true}
                >
                  <AvatarSelector
                    accountTypes={accounts.map(account => account.type)}
                    focusCategory={scope === 'debts' ? 'debt' : scope === 'savings' ? 'savings' : scope === 'investing' ? 'investment' : undefined}
                    selectedAvatar={strategy}
                    onAvatarSelect={(avatar) => setStrategy(avatar.id as Strategy)}
                  />
                </QuestionBlock>

                {/* Step 3: Timeframe Selection */}
                <QuestionBlock
                  title="Step 3: Set Your Timeline"
                  description="How long do you want to follow this strategy?"
                  completed={true}
                  locked={true}
                >
                  <ChipGroup>
                    <Chip 
                      label="Short (6-12 months)" 
                      selected={timeframe === 'short'} 
                      onClick={() => setTimeframe('short')}
                    />
                    <Chip 
                      label="Mid (1-3 years)" 
                      selected={timeframe === 'mid'} 
                      onClick={() => setTimeframe('mid')}
                    />
                    <Chip 
                      label="Long (3+ years)" 
                      selected={timeframe === 'long'} 
                      onClick={() => setTimeframe('long')}
                    />
                  </ChipGroup>
                </QuestionBlock>

                {/* Step 4: Extra Contribution Input */}
                <QuestionBlock
                  title="Step 4: Extra Contribution (Optional)"
                  description="How much extra can you contribute monthly? Leave blank if you don't want to specify."
                  completed={true}
                  locked={false}
                >
                  <ContributionEditor
                    extra={extra}
                    strategy={strategy}
                    scope={scope}
                    accounts={accounts}
                    transactions={transactions}
                    goalsMonthly={goalsMonthly}
                    onExtraChange={setExtra}
                  />
                </QuestionBlock>
              </div>

              {/* Footer */}
              <div className="edit-parameters-modal-footer">
                <Button
                  onClick={handleCloseEditParameters}
                  variant={ButtonVariants.contained}
                  color={ButtonColors.secondary}
                  fullWidth
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Run Again Button */}
        <Button
          onClick={handleRunAgain}
          variant={ButtonVariants.outline}
          color={ButtonColors.secondary}
          fullWidth
        >
          Run Again
        </Button>

        {/* Footer */}
        <div className="custom-strategy-footer">
        </div>
      </div>

      {/* Breakdown Modal */}
      <BreakdownModal
        open={breakdownOpen}
        onClose={() => setBreakdownOpen(false)}
        scope={scope}
        strategy={strategy}
        timeframe={timeframe}
        extraDollars={extra}
        accounts={accounts}
        goals={goals}
        transactions={transactions}
        assumedAnnualReturn={0.06}
      />
    </div>
  );
}
