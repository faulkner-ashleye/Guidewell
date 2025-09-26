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
import { Select } from '../components/Inputs';
import { BreakdownModal } from '../app/strategies/components/BreakdownModal';
import { AvatarUtils } from '../data/narrativeAvatars';
import { NarrativeAvatar } from '../data/narrativeAvatars';
import { aiIntegrationService } from '../services/aiIntegrationService';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { UserProfileUtils } from '../data/enhancedUserProfile';
import { Goal as AppGoal } from '../app/types';
import './StrategyBuilder.css';

type Scope = 'all' | 'debts' | 'savings' | 'investing';
type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';
type Timeframe = 'short' | 'mid' | 'long';

type StrategyBuilderMode = 'build' | 'custom';

interface StrategyBuilderProps {
  mode?: StrategyBuilderMode;
}

export function StrategyBuilder({ mode = 'build' }: StrategyBuilderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get app state
  const { accounts = [], transactions = [], goals = [], userProfile } = useAppState();

  // State management
  const [scope, setScope] = useState<Scope>('all');
  const [scopeSelection, setScopeSelection] = useState<'all' | 'one'>('all');
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [strategy, setStrategy] = useState<Strategy>('debt_crusher');
  const [timeframe, setTimeframe] = useState<Timeframe>('mid');
  const [extra, setExtra] = useState<number | undefined>(undefined);

  // For build mode
  const [selectedAvatar, setSelectedAvatar] = useState<NarrativeAvatar | null>(null);
  const [animateStep, setAnimateStep] = useState<number>(1);

  // AI-powered narrative state
  const [aiNarrative, setAiNarrative] = useState<string>('');
  const [narrativeLoading, setNarrativeLoading] = useState<boolean>(false);
  const [narrativeError, setNarrativeError] = useState<string | null>(null);

  // Modal state (for custom mode)
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [editParametersOpen, setEditParametersOpen] = useState(false);

  // Derived values
  const goalsMonthly = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);

  // Real accounts organized by type for dropdown
  const accountsByType = {
    debts: accounts.filter(acc => acc.type === 'credit_card' || acc.type === 'loan'),
    savings: accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings'),
    investing: accounts.filter(acc => acc.type === 'investment')
  };

  // Scroll to top when component mounts
  useEffect(() => {
    const scrollToTop = () => {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.scrollTo(0, 0);
      }
      window.scrollTo(0, 0);
    };

    scrollToTop();
    const timeoutId = setTimeout(scrollToTop, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Prevent scrolling when edit parameters modal is open (custom mode only)
  useEffect(() => {
    if (mode === 'custom' && editParametersOpen) {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.add('modal-open');
      }
    } else {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('modal-open');
      }
    }

    return () => {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('modal-open');
      }
    };
  }, [editParametersOpen, mode]);

  // Trigger AI narrative generation when strategy parameters change
  useEffect(() => {
    if (strategy && accounts.length > 0) {
      generateAINarrative();
    }
  }, [strategy, scope, timeframe, extra, accounts.length]);

  // Initialize from query params or state (custom mode)
  useEffect(() => {
    if (mode === 'custom') {
      const searchParams = new URLSearchParams(location.search);
      const state = location.state;

      if (state) {
        setScope(state.scope || 'all');
        setStrategy(state.strategy || 'debt_crusher');
        setTimeframe(state.timeframe || 'mid');
        setExtra(state.extra);
      } else if (searchParams.get('scope')) {
        setScope(searchParams.get('scope') as Scope || 'all');
        setStrategy(searchParams.get('strategy') as Strategy || 'debt_crusher');
        setTimeframe(searchParams.get('timeframe') as Timeframe || 'mid');
        const extraParam = searchParams.get('extra');
        setExtra(extraParam ? parseFloat(extraParam) : undefined);
      }
    }
  }, [location, mode]);

  // Separate effect to handle scroll to top after content is rendered (custom mode)
  useEffect(() => {
    if (mode === 'custom') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
      }, 50);

      return () => {
        clearTimeout(timer);
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'auto';
        }
      };
    }
  }, [mode]);

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
    setScopeSelection('all');
    setAccountId(undefined);

    if (mode === 'build') {
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleScopeSelectionSelect = (selection: 'all' | 'one') => {
    setScopeSelection(selection);
    setAccountId(undefined);

    if (mode === 'build' && selection === 'all') {
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleAccountSelect = (selectedAccountId: string) => {
    setAccountId(selectedAccountId);

    if (mode === 'build') {
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleAvatarSelect = (avatar: NarrativeAvatar) => {
    setSelectedAvatar(avatar);
    setStrategy(avatar.id as Strategy);

    if (mode === 'build') {
      setTimeout(() => setAnimateStep(3), 300);
    }
  };

  const handleTimeframeSelect = (selectedTimeframe: Timeframe) => {
    setTimeframe(selectedTimeframe);

    if (mode === 'build') {
      setTimeout(() => setAnimateStep(4), 300);
    }
  };

  const handleViewBreakdown = () => {
    if (mode === 'build') {
      navigate('/custom-strategy', {
        state: {
          scope,
          strategy: selectedAvatar?.id,
          avatar: selectedAvatar,
          timeframe,
          extra
        }
      });
    } else {
      setBreakdownOpen(true);
    }
  };

  // Convert AppGoal to data Goal type for AI
  const convertedGoals = React.useMemo(() => {
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

  // Create enhanced user profile for AI
  const enhancedUserProfile = React.useMemo((): EnhancedUserProfile => {
    return UserProfileUtils.createEnhancedProfile(userProfile, accounts, convertedGoals);
  }, [userProfile, accounts, convertedGoals]);

  // Generate AI-powered narrative
  const generateAINarrative = async () => {
    if (!enhancedUserProfile || accounts.length === 0) {
      setNarrativeError('Please connect accounts and complete your profile first');
      return;
    }

    setNarrativeLoading(true);
    setNarrativeError(null);

    try {
      const avatar = AvatarUtils.getAvatarById(strategy);
      if (!avatar) {
        setNarrativeError('Invalid strategy selected');
        return;
      }

      const timeframeText = {
        short: '3-12 months',
        mid: '1-5 years',
        long: '5+ years'
      };

      const scopeText = scope === 'all' ? 'all accounts' : scope;
      const extraText = extra === undefined || extra === null || extra === 0 
        ? '$0/month' 
        : `$${extra.toLocaleString()}/month`;

      // Create a custom analysis type for strategy narratives
      const analysisType = `strategy_narrative_${strategy}`;
      
      const analysis = await aiIntegrationService.generateAIAnalysisWithAPI(
        enhancedUserProfile,
        accounts,
        convertedGoals,
        analysisType
      );

      if (analysis.aiResponse) {
        // Use AI response to create personalized narrative
        let narrative = analysis.aiResponse.summary;
        
        // Add strategy-specific context
        narrative += `\n\nThis ${avatar.name} approach focuses on ${scopeText} over ${timeframeText[timeframe]}. `;
        narrative += `With ${extraText} toward savings, ${analysis.aiResponse.nextStep}`;
        
        setAiNarrative(narrative);
      } else {
        // Fallback to enhanced rule-based narrative
        setAiNarrative(generateEnhancedNarrative());
      }
    } catch (error) {
      console.error('AI Narrative generation failed:', error);
      setNarrativeError('Failed to generate AI narrative. Using fallback.');
      setAiNarrative(generateEnhancedNarrative());
    } finally {
      setNarrativeLoading(false);
    }
  };

  // Enhanced fallback narrative generation
  const generateEnhancedNarrative = () => {
    const avatar = AvatarUtils.getAvatarById(strategy);
    if (!avatar) return 'Select a strategy to see your narrative.';

    const timeframeText = {
      short: '3-12 months',
      mid: '1-5 years',
      long: '5+ years'
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
      case 'safety_builder':
        narrative += `This conservative approach prioritizes building a strong financial foundation with low-risk strategies.`;
        break;
      case 'future_investor':
        narrative += `This growth-focused strategy emphasizes long-term wealth building through strategic investments.`;
        break;
      case 'balanced_builder':
        narrative += `This well-rounded approach balances debt management, savings, and investments for steady progress.`;
        break;
      default:
        narrative += `This strategy is tailored to your specific financial goals and risk tolerance.`;
    }

    return narrative;
  };

  // Generate narrative based on current selections
  const generateNarrative = () => {
    // Use AI narrative if available, otherwise fallback
    return aiNarrative || generateEnhancedNarrative();
  };

  // Check if each step is completed (build mode)
  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1: return scope !== undefined && (scope === 'all' || scopeSelection === 'all' || !!accountId);
      case 2: return selectedAvatar !== null;
      case 3: return timeframe !== undefined;
      case 4: return true; // Extra contribution is optional, always considered "completed"
      default: return false;
    }
  };

  // Check if we have valid data to show (custom mode)
  const hasValidData = scope && strategy && timeframe;

  // Custom mode: Show error if no valid data
  if (mode === 'custom' && !hasValidData) {
    return (
      <div className="custom-strategy-page">
        <AppHeader
          title="Custom Strategy"
          leftAction={
            <button onClick={handleBack} className="back-button">
              <Icon name={IconNames.arrow_back} size="lg" />
            </button>
          }
        />

        <div className="no-strategy-container">
          <h2 className="no-strategy-title">No Strategy Found</h2>
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

  // Custom mode: Show results (using CustomStrategy as base)
  if (mode === 'custom') {
    return (
      <div className="custom-strategy-page">
        <AppHeader
          title="Custom Strategy"
          leftAction={
            <button onClick={handleBack} className="back-button">
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
            allocation={AvatarUtils.getAvatarById(strategy)?.allocation}
            onTimelineChange={(newTimeline) => {
              if (typeof newTimeline === 'string' && newTimeline !== 'custom') {
                setTimeframe(newTimeline as Timeframe);
              }
            }}
            onExtraMonthlyChange={setExtra}
            className="scenario-chart"
          />

          {/* Narrative Card */}
          <NarrativeCard
            title={strategy === 'debt_crusher' ? 'Debt Crusher' :
                  strategy === 'goal_keeper' ? 'Goal Keeper' : 
                  strategy === 'nest_builder' ? 'Nest Builder' :
                  strategy === 'safety_builder' ? 'Safety Builder' :
                  strategy === 'future_investor' ? 'Future Investor' :
                  strategy === 'balanced_builder' ? 'Balanced Builder' :
                  AvatarUtils.getAvatarById(strategy)?.name || 'Strategy'}
            narrative={generateNarrative()}
            onViewBreakdown={handleViewBreakdown}
            className="card narrative-card"
            loading={narrativeLoading}
            error={narrativeError}
          />

          {/* Edit Parameters Modal */}
          {editParametersOpen && (
            <div className="edit-parameters-modal-overlay" onClick={handleCloseEditParameters}>
              <div className="edit-parameters-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="edit-parameters-modal-header">
                  <h2 className="edit-parameters-modal-title">Build a strategy</h2>
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
                        <Select
                          label="Select Account:"
                          value={accountId || ''}
                          onChange={(e) => handleAccountSelect(e.target.value)}
                          options={[
                            { value: '', label: 'Choose an account...' },
                            ...(scope && accountsByType[scope]?.map(account => ({
                              value: account.id,
                              label: `${account.name} ($${account.balance.toLocaleString()})`
                            })) || [])
                          ]}
                        />
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
                      hideShowAllButton={scope === 'all'}
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
                        label="Short (1–2 years)"
                        selected={timeframe === 'short'}
                        onClick={() => setTimeframe('short')}
                      />
                      <Chip
                        label="Mid (3–5 years)"
                        selected={timeframe === 'mid'}
                        onClick={() => setTimeframe('mid')}
                      />
                      <Chip
                        label="Long (5+ years)"
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
          <div className="custom-strategy-footer"></div>
        </div>

        {/* Breakdown Modal */}
        <BreakdownModal
          open={breakdownOpen}
          onClose={() => setBreakdownOpen(false)}
          scope={scope}
          strategy={strategy}
          timeframe={timeframe}
          extraDollars={extra}
          allocation={AvatarUtils.getAvatarById(strategy)?.allocation}
          accounts={accounts}
          goals={goals}
          transactions={transactions}
          assumedAnnualReturn={0.06}
        />
      </div>
    );
  }

  // Build mode: Show step-by-step builder
  return (
    <div className="build-strategy-page">
      <AppHeader
        title="Build Your Strategy"
        leftAction={
          <button onClick={handleBack} className="back-button">
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
              <Select
                label="Select Account:"
                value={accountId || ''}
                onChange={(e) => handleAccountSelect(e.target.value)}
                options={[
                  { value: '', label: 'Choose an account...' },
                  ...(scope && accountsByType[scope]?.map(account => ({
                    value: account.id,
                    label: `${account.name} ($${account.balance.toLocaleString()})`
                  })) || [])
                ]}
              />
            </div>
          )}
          </QuestionBlock>
        </div>

        {/* Step 2: Strategy Selection */}
        {scope && (
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
                label="Short (1–2 years)"
                selected={timeframe === 'short'}
                onClick={() => handleTimeframeSelect('short')}
              />
              <Chip
                label="Mid (3–5 years)"
                selected={timeframe === 'mid'}
                onClick={() => handleTimeframeSelect('mid')}
              />
              <Chip
                label="Long (5+ years)"
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

            {/* Build Strategy Button */}
            <Button
              onClick={handleViewBreakdown}
              disabled={!scope || !selectedAvatar || !timeframe}
              variant={ButtonVariants.contained}
              color={ButtonColors.secondary}
              fullWidth
            >
              Build Strategy
            </Button>
            </QuestionBlock>
          </div>
        )}

      </div>
    </div>
  );
}
