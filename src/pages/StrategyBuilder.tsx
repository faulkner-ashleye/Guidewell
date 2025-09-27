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
type Timeframe = '1yr' | '2yr' | '3yr' | '5yr' | '10yr' | 'custom';

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
  const [scope, setScope] = useState<Scope | undefined>(undefined);
  const [scopeSelection, setScopeSelection] = useState<'all' | 'one'>('all');
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [strategy, setStrategy] = useState<Strategy | undefined>(undefined);
  const [timeframe, setTimeframe] = useState<Timeframe | undefined>(undefined);
  const [extra, setExtra] = useState<number | undefined>(undefined);

  // For build mode
  const [selectedAvatar, setSelectedAvatar] = useState<NarrativeAvatar | null>(null);
  const [animateStep, setAnimateStep] = useState<number>(1);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set([1]));

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

  // Reset step visibility when in build mode
  useEffect(() => {
    if (mode === 'build') {
      setVisibleSteps(new Set([1]));
      setAnimateStep(1);
      setSelectedAvatar(null);
      setScope(undefined);
      setScopeSelection('all');
      setAccountId(undefined);
      setStrategy(undefined);
      setTimeframe(undefined);
      setExtra(undefined);
    }
  }, [mode]);

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
        setTimeframe(state.timeframe || '3yr');
        setExtra(state.extra);
      } else if (searchParams.get('scope')) {
        setScope(searchParams.get('scope') as Scope || 'all');
        setStrategy(searchParams.get('strategy') as Strategy || 'debt_crusher');
        setTimeframe(searchParams.get('timeframe') as Timeframe || '3yr');
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
      const avatar = strategy ? AvatarUtils.getAvatarById(strategy) : null;
      if (!avatar) {
        setNarrativeError('Invalid strategy selected');
        return;
      }

      const timeframeText = {
        '1yr': '1 year',
        '2yr': '2 years',
        '3yr': '3 years',
        '5yr': '5 years',
        '10yr': '10 years',
        'custom': 'custom timeline'
      };

      const scopeText = scope === 'all' ? 'all accounts' : scope;
      const extraText = extra === undefined || extra === null || extra === 0 
        ? '$0/month' 
        : `$${extra.toLocaleString()}/month`;

      // Use tradeoff_insights analysis type for comprehensive narrative
      const analysis = await aiIntegrationService.generateAIAnalysisWithAPI(
        enhancedUserProfile,
        accounts,
        convertedGoals,
        'tradeoff_insights'
      );

      if (analysis && analysis.aiResponse && analysis.aiResponse.summary && !analysis.aiResponse.fallback) {
        // Use AI response to create personalized narrative
        let narrative = analysis.aiResponse.summary;
        
        // Add strategy-specific context
        narrative += `\n\nThis ${avatar.name} approach focuses on ${scopeText} over ${timeframe ? timeframeText[timeframe] : 'your timeline'}. `;
        narrative += `With ${extraText} toward savings, ${analysis.aiResponse.nextStep || 'you can make significant progress toward your goals.'}`;
        
        setAiNarrative(narrative);
      } else {
        // Fallback to enhanced rule-based narrative
        console.log('Using fallback narrative - AI analysis failed or returned fallback');
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
    const avatar = strategy ? AvatarUtils.getAvatarById(strategy) : null;
    if (!avatar) return 'Select a strategy to see your narrative.';

    const timeframeText = {
      '1yr': '1 year',
      '2yr': '2 years',
      '3yr': '3 years',
      '5yr': '5 years',
      '10yr': '10 years',
      'custom': 'custom timeline'
    };

    const scopeText = scope === 'all' ? 'all accounts' : scope;
    const timeframeDisplay = timeframe ? timeframeText[timeframe] : 'your timeline';

    // Calculate basic financial metrics for tradeoff analysis
    const totalDebt = accounts.filter(a => ['loan', 'credit_card'].includes(a.type)).reduce((sum, a) => sum + a.balance, 0);
    const totalSavings = accounts.filter(a => ['checking', 'savings'].includes(a.type)).reduce((sum, a) => sum + a.balance, 0);
    const totalInvestment = accounts.filter(a => a.type === 'investment').reduce((sum, a) => sum + a.balance, 0);
    const monthlyExtra = extra || 0;

    let narrative = `This ${avatar.name} scenario focuses on ${scopeText} over ${timeframeDisplay}.\n\n`;

    // Add tradeoff analysis based on strategy
    switch (strategy) {
      case 'debt_crusher':
        narrative += `By prioritizing debt payoff, you'll save significantly on interest costs. `;
        if (totalDebt > 0) {
          narrative += `With your current debt of $${totalDebt.toLocaleString()}, this approach could save you thousands in interest over time.\n\n`;
        }
        narrative += `The tradeoff: while you're building wealth through debt reduction, you're missing out on potential investment growth. `;
        if (totalInvestment === 0) {
          narrative += `Since you don't have investments yet, this debt-first approach makes sense, but consider starting small investments once your highest-interest debt is paid off.\n\n`;
        } else {
          narrative += `\n\n`;
        }
        break;
        
      case 'goal_keeper':
        narrative += `This balanced approach helps you build savings while managing debt responsibly.\n\n`;
        narrative += `The benefit: you maintain financial flexibility and can handle unexpected expenses.\n\n`;
        narrative += `The tradeoff: you may pay more interest on debt and miss some investment opportunities compared to more aggressive strategies.\n\n`;
        break;
        
      case 'nest_builder':
        narrative += `This strategy emphasizes building a strong financial foundation through savings and emergency funds. `;
        if (totalSavings < 10000) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, building a larger emergency fund provides crucial financial security.\n\n`;
        } else {
          narrative += `\n\n`;
        }
        narrative += `The tradeoff: while you're building security, you're missing out on the potential compound growth of investments.\n\n`;
        break;
        
      case 'future_investor':
        narrative += `This growth-oriented strategy focuses on long-term wealth building through investments.\n\n`;
        narrative += `The benefit: you're maximizing the power of compound growth over time.\n\n`;
        narrative += `The tradeoff: you may pay more interest on debt and have less liquid savings for emergencies. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, consider whether your debt interest rates are lower than expected investment returns.\n\n`;
        } else {
          narrative += `\n\n`;
        }
        break;
        
      case 'balanced_builder':
        narrative += `This well-rounded approach balances debt payoff, savings, and investments.\n\n`;
        narrative += `The benefit: you're building wealth in multiple ways while maintaining flexibility.\n\n`;
        narrative += `The tradeoff: you may not optimize any single area as much as specialized strategies would.\n\n`;
        break;
        
      default:
        narrative += `This strategy is designed to help you make progress toward your financial goals.\n\n`;
    }

    // Add goal impact analysis
    if (convertedGoals.length > 0) {
      const goalNames = convertedGoals.map(g => g.name).join(', ');
      narrative += `Your goals (${goalNames}) will be impacted by this strategy's allocation between debt, savings, and investments.\n\n`;
    }

    // Add extra contribution context
    if (monthlyExtra > 0) {
      narrative += `With an extra $${monthlyExtra.toLocaleString()}/month, this strategy becomes more powerful and can accelerate your progress significantly.`;
    } else {
      narrative += `Without additional monthly contributions, this strategy shows potential based on your current financial flow.`;
    }

    return narrative;
  };

  // Generate narrative based on current selections
  const generateNarrative = () => {
    // Always use the enhanced narrative for better tradeoff analysis
    return generateEnhancedNarrative();
  };

  // Check if each step is completed (build mode)
  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1: return scope !== undefined && (scope === 'all' || scopeSelection === 'all' || !!accountId);
      case 2: return selectedAvatar !== null;
      case 3: return timeframe !== undefined;
      case 4: return true; // Step 4 is always considered completed once visible (extra contribution is optional)
      default: return false;
    }
  };

  // Function to reveal the next step with animation
  const revealNextStep = (stepNumber: number) => {
    setTimeout(() => {
      setVisibleSteps(prev => {
        const newSet = new Set(prev);
        newSet.add(stepNumber);
        return newSet;
      });
      setAnimateStep(stepNumber);
    }, 300); // Small delay for smooth transition
  };

  // Function to hide a step with slide down animation
  const hideStep = (stepNumber: number) => {
    // First trigger the slide down animation
    setAnimateStep(stepNumber * -1); // Use negative number to indicate slide down
    
    // Then remove from visible steps after animation completes
    setTimeout(() => {
      setVisibleSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepNumber);
        return newSet;
      });
    }, 400); // Wait for slide down animation to complete
  };

  // Effect to handle step progression
  useEffect(() => {
    if (mode === 'build') {
      // Step 2 should appear when step 1 is completed
      if (isStepCompleted(1) && !visibleSteps.has(2)) {
        revealNextStep(2);
      }
      // Step 3 should appear when step 2 is completed
      if (isStepCompleted(2) && !visibleSteps.has(3)) {
        revealNextStep(3);
      }
      // Step 4 should appear when step 3 is completed
      if (isStepCompleted(3) && !visibleSteps.has(4)) {
        revealNextStep(4);
      }
    }
  }, [scope, scopeSelection, accountId, selectedAvatar, timeframe, visibleSteps, mode]);

  // Check if we have valid data to show (custom mode)
  const hasValidData = scope && strategy && timeframe;

  // Custom mode: Show error if no valid data
  if (mode === 'custom' && !hasValidData) {
    return (
      <div className="custom-strategy-page">
        <AppHeader
          title="Custom Strategy"
          showQuickActions={true}
          onQuickActionsClick={() => {
            if ((window as any).globalSheets) {
              (window as any).globalSheets.openQuickActions();
            }
          }}
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
          showQuickActions={true}
          onQuickActionsClick={() => {
            if ((window as any).globalSheets) {
              (window as any).globalSheets.openQuickActions();
            }
          }}
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
            strategy={strategy || 'debt_crusher'}
            timeframe={timeframe || '3yr'}
            scope={scope || 'all'}
            extraMonthly={extra}
            allocation={strategy ? AvatarUtils.getAvatarById(strategy)?.allocation : undefined}
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
            title="Your path at a glance"
            narrative={generateNarrative()}
            onViewBreakdown={handleRunAgain}
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
                        label="1YR"
                        selected={timeframe === '1yr'}
                        onClick={() => setTimeframe('1yr')}
                      />
                      <Chip
                        label="2YR"
                        selected={timeframe === '2yr'}
                        onClick={() => setTimeframe('2yr')}
                      />
                      <Chip
                        label="3YR"
                        selected={timeframe === '3yr'}
                        onClick={() => setTimeframe('3yr')}
                      />
                      <Chip
                        label="5YR"
                        selected={timeframe === '5yr'}
                        onClick={() => setTimeframe('5yr')}
                      />
                      <Chip
                        label="10YR"
                        selected={timeframe === '10yr'}
                        onClick={() => setTimeframe('10yr')}
                      />
                    </ChipGroup>
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


          {/* Footer */}
          <div className="custom-strategy-footer"></div>
        </div>

        {/* Breakdown Modal */}
        <BreakdownModal
          open={breakdownOpen}
          onClose={() => setBreakdownOpen(false)}
          scope={scope || 'all'}
          strategy={strategy || 'debt_crusher'}
          timeframe={timeframe || '3yr'}
          extraDollars={extra}
          allocation={strategy ? AvatarUtils.getAvatarById(strategy)?.allocation : undefined}
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
        {visibleSteps.has(1) && (
        <div
          className={`strategy-step animate-fade-in ${isStepCompleted(1) ? 'completed' : ''}`}
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
        )}

        {/* Step 2: Strategy Selection */}
        {visibleSteps.has(2) && (
        <div
          className={`strategy-step ${
            animateStep === 2 ? 'animate-slide-up' : 
            animateStep === -2 ? 'animate-slide-down' : 
            'animate-fade-in'
          } ${isStepCompleted(2) ? 'completed' : ''}`}
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
        {visibleSteps.has(3) && (
        <div
          className={`strategy-step ${
            animateStep === 3 ? 'animate-slide-up' : 
            animateStep === -3 ? 'animate-slide-down' : 
            'animate-fade-in'
          } ${isStepCompleted(3) ? 'completed' : ''}`}
        >
            <QuestionBlock
              title="Step 3: Set Your Timeline"
              description="How long do you want to follow this strategy?"
              completed={isStepCompleted(3)}
              locked={isStepCompleted(3)}
            >
            <ChipGroup>
              <Chip
                label="1YR"
                selected={timeframe === '1yr'}
                onClick={() => handleTimeframeSelect('1yr')}
              />
              <Chip
                label="2YR"
                selected={timeframe === '2yr'}
                onClick={() => handleTimeframeSelect('2yr')}
              />
              <Chip
                label="3YR"
                selected={timeframe === '3yr'}
                onClick={() => handleTimeframeSelect('3yr')}
              />
              <Chip
                label="5YR"
                selected={timeframe === '5yr'}
                onClick={() => handleTimeframeSelect('5yr')}
              />
              <Chip
                label="10YR"
                selected={timeframe === '10yr'}
                onClick={() => handleTimeframeSelect('10yr')}
              />
            </ChipGroup>
            </QuestionBlock>
          </div>
        )}

        {/* Step 4: Extra Contribution Input */}
        {visibleSteps.has(4) && (
        <div
          className={`strategy-step ${
            animateStep === 4 ? 'animate-slide-up' : 
            animateStep === -4 ? 'animate-slide-down' : 
            'animate-fade-in'
          } ${isStepCompleted(4) ? 'completed' : ''}`}
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
