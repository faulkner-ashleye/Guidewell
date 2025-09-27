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
    const currentTimeframe = timeframe || '3yr'; // Default to 3yr if undefined
    const timeframeDisplay = timeframeText[currentTimeframe];

    // Calculate basic financial metrics for tradeoff analysis
    const totalDebt = accounts.filter(a => ['loan', 'credit_card'].includes(a.type)).reduce((sum, a) => sum + a.balance, 0);
    const totalSavings = accounts.filter(a => ['checking', 'savings'].includes(a.type)).reduce((sum, a) => sum + a.balance, 0);
    const totalInvestment = accounts.filter(a => a.type === 'investment').reduce((sum, a) => sum + a.balance, 0);
    const monthlyExtra = extra || 0;

    let narrative = `This ${avatar.name} scenario focuses on ${scopeText} over ${timeframeDisplay}.\n\n`;

    // Add comprehensive tradeoff analysis based on strategy
    switch (strategy) {
      case 'debt_crusher':
        narrative += `By prioritizing debt payoff, you'll save significantly on interest costs. `;
        if (totalDebt > 0) {
          narrative += `With your current debt of $${totalDebt.toLocaleString()}, this approach could save you thousands in interest over time. `;
          narrative += `For example, if your average interest rate is 15%, you're currently paying approximately $${Math.round(totalDebt * 0.15 / 12).toLocaleString()} per month in interest alone.\n\n`;
        }
        
        narrative += `**The Opportunity Cost:** While you're building wealth through debt reduction, you're missing out on potential investment growth. `;
        if (totalInvestment === 0) {
          narrative += `Since you don't have investments yet, this debt-first approach makes sense, but consider this: if you could earn 7% annually in investments versus paying 15% interest on debt, the math clearly favors debt payoff. `;
          narrative += `However, once your highest-interest debt is paid off, starting small investments becomes crucial for long-term wealth building.\n\n`;
        } else {
          narrative += `With your current investment balance of $${totalInvestment.toLocaleString()}, you might consider whether additional debt payments or investment contributions offer better returns.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy will significantly accelerate your debt-free timeline. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month contribution, you could potentially be debt-free ${Math.round(totalDebt / (monthlyExtra + 500))} months sooner than minimum payments alone.\n\n`;
        } else {
          narrative += `Without additional monthly contributions, this strategy relies on your current cash flow, which may extend your debt-free timeline but still provides a clear path forward.\n\n`;
        }
        
        narrative += `**Risk Considerations:** The main risk is opportunity cost - while you're focused on debt, you might miss market upswings or employer 401(k) matching. `;
        narrative += `However, the guaranteed return from eliminating high-interest debt often outweighs uncertain investment returns, especially in volatile markets.\n\n`;
        break;
        
      case 'steady_payer':
        narrative += `This moderate debt-focused strategy allocates 60% of extra funds to debt reduction while maintaining 25% for savings and 15% for investments. `;
        narrative += `It's designed for those who want steady progress without financial strain.\n\n`;
        
        narrative += `**The Steady Progress Approach:** You'll pay more than the minimum on debt while maintaining financial flexibility. `;
        if (totalDebt > 0) {
          narrative += `With your current debt of $${totalDebt.toLocaleString()}, this approach provides consistent progress without overwhelming your budget. `;
          narrative += `This strategy typically results in debt-free status 2-3 years sooner than minimum payments alone.\n\n`;
        }
        
        narrative += `**The Balanced Tradeoff:** Slower debt reduction than the Debt Crusher approach, but you maintain emergency savings and start building investments. `;
        if (totalSavings > 0) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, this strategy builds on your existing security. `;
        }
        narrative += `The 25% savings allocation ensures you can handle unexpected expenses while making debt progress.\n\n`;
        
        narrative += `**Goal Impact:** This strategy provides steady progress across debt and savings goals. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, approximately $${Math.round(monthlyExtra * 0.6).toLocaleString()} goes to debt reduction, $${Math.round(monthlyExtra * 0.25).toLocaleString()} to savings, and $${Math.round(monthlyExtra * 0.15).toLocaleString()} to investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to create steady, manageable progress.\n\n`;
        }
        break;
        
      case 'juggler':
        narrative += `This flexible debt strategy adapts to your monthly financial situation, typically allocating 50% to debt, 30% to savings, and 20% to investments. `;
        narrative += `It's designed for those with variable income or changing financial priorities.\n\n`;
        
        narrative += `**The Flexible Approach:** Some months you'll do more, others you'll scale back based on your financial situation. `;
        if (totalDebt > 0) {
          narrative += `With your current debt of $${totalDebt.toLocaleString()}, this approach provides adaptability when income varies or unexpected expenses arise. `;
          narrative += `The flexible allocation means you can prioritize emergencies when needed without abandoning debt progress entirely.\n\n`;
        }
        
        narrative += `**The Adaptability Tradeoff:** While flexible, debt takes longer to clear than more aggressive approaches. `;
        narrative += `However, this flexibility often leads to better long-term success because you're less likely to abandon the plan during difficult months. `;
        narrative += `The 30% savings allocation provides a buffer for variable income situations.\n\n`;
        
        narrative += `**Goal Impact:** This strategy adapts to your changing financial circumstances. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month (when available), approximately $${Math.round(monthlyExtra * 0.5).toLocaleString()} goes to debt reduction, $${Math.round(monthlyExtra * 0.3).toLocaleString()} to savings, and $${Math.round(monthlyExtra * 0.2).toLocaleString()} to investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow and adapts to your monthly situation.\n\n`;
        }
        break;
        
      case 'interest_minimizer':
        narrative += `This cost-efficient debt strategy focuses on targeting the highest-interest debts first, allocating 70% to debt, 20% to savings, and 10% to investments. `;
        narrative += `It's designed for those who want to minimize interest costs while maintaining some financial flexibility.\n\n`;
        
        narrative += `**The Cost-Efficient Approach:** You'll target the highest-interest debts first to minimize total interest paid over time. `;
        if (totalDebt > 0) {
          narrative += `With your current debt of $${totalDebt.toLocaleString()}, this approach could save you significant money in interest by prioritizing high-rate debts. `;
          narrative += `For example, paying off a 20% credit card before a 5% student loan can save hundreds or thousands in interest.\n\n`;
        }
        
        narrative += `**The Mathematical Tradeoff:** While cost-efficient, progress may feel slower emotionally compared to the Debt Crusher approach since you're not necessarily paying off entire accounts quickly. `;
        narrative += `However, this strategy is mathematically optimal for minimizing total interest paid. `;
        narrative += `The 20% savings allocation ensures you maintain emergency funds while aggressively tackling high-interest debt.\n\n`;
        
        narrative += `**Goal Impact:** This strategy minimizes total interest costs while making steady progress. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, approximately $${Math.round(monthlyExtra * 0.7).toLocaleString()} goes to high-interest debt reduction, $${Math.round(monthlyExtra * 0.2).toLocaleString()} to savings, and $${Math.round(monthlyExtra * 0.1).toLocaleString()} to investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to minimize interest costs efficiently.\n\n`;
        }
        break;
        
      case 'goal_keeper':
        narrative += `This balanced approach helps you build savings while managing debt responsibly. `;
        narrative += `It's designed for those who want steady progress without taking on excessive risk or sacrificing financial flexibility.\n\n`;
        
        narrative += `**The Balanced Benefit:** You maintain financial flexibility and can handle unexpected expenses while still making meaningful progress. `;
        if (totalSavings > 0) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, this strategy builds on your existing foundation. `;
        }
        narrative += `This approach typically allocates 30% of extra funds to debt reduction, 40% to savings goals, and 30% to investments.\n\n`;
        
        narrative += `**The Tradeoff:** You may pay more interest on debt over time and miss some investment opportunities compared to more aggressive strategies. `;
        narrative += `However, this tradeoff provides psychological benefits and financial security that can lead to better long-term outcomes. `;
        narrative += `The steady, consistent approach often results in better adherence to the plan.\n\n`;
        
        narrative += `**Goal Impact:** This strategy balances multiple financial goals simultaneously. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, you'll see progress across all areas: approximately $${Math.round(monthlyExtra * 0.3).toLocaleString()} toward debt, $${Math.round(monthlyExtra * 0.4).toLocaleString()} toward savings, and $${Math.round(monthlyExtra * 0.3).toLocaleString()} toward investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to create a balanced approach to financial growth.\n\n`;
        }
        break;
        
      case 'safety_builder':
        narrative += `This security-focused strategy prioritizes building an emergency fund and financial safety net, allocating 50% of extra funds to savings while maintaining 40% for debt and 10% for investments. `;
        narrative += `It's designed for those who want to build financial security before pursuing other goals.\n\n`;
        
        narrative += `**The Security-First Approach:** You'll focus on building a robust emergency cushion before pursuing other financial goals. `;
        if (totalSavings < 10000) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, this strategy helps you build the financial security needed to handle life's surprises. `;
          narrative += `Most financial experts recommend 3-6 months of expenses in emergency savings, which for many people is $10,000-$20,000.\n\n`;
        } else {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, this strategy builds on your existing security foundation. `;
          narrative += `You may want to consider whether you have enough emergency savings for your situation.\n\n`;
        }
        
        narrative += `**The Conservative Tradeoff:** More conservative than Goal Keeper, this approach builds security before pursuing milestones or aggressive investing. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, this strategy ensures you maintain emergency funds while still making meaningful debt payments. `;
          narrative += `The 40% debt allocation provides steady progress without sacrificing financial security.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus entirely on building comprehensive savings and emergency funds.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy prioritizes financial security and emergency preparedness. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, approximately $${Math.round(monthlyExtra * 0.5).toLocaleString()} goes to emergency savings, $${Math.round(monthlyExtra * 0.4).toLocaleString()} to debt reduction, and $${Math.round(monthlyExtra * 0.1).toLocaleString()} to investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to build financial security systematically.\n\n`;
        }
        
        narrative += `**Risk Considerations:** This is the most conservative savings approach, ideal for those who prioritize financial security over growth. `;
        narrative += `While you may miss some investment opportunities, having a strong emergency fund provides peace of mind and prevents you from going into debt during unexpected situations.\n\n`;
        break;
        
      case 'auto_pilot':
        narrative += `This automated savings strategy focuses on building consistent savings habits, allocating 45% of extra funds to savings while maintaining 35% for debt and 20% for investments. `;
        narrative += `It's designed for those who want reliable, hands-off savings without constant monitoring.\n\n`;
        
        narrative += `**The Automated Approach:** You'll save a set amount each payday and let it run in the background without constant decision-making. `;
        if (totalSavings > 0) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, this strategy builds on your existing automated habits. `;
        }
        narrative += `This approach typically involves setting up automatic transfers from checking to savings accounts, making saving effortless and consistent.\n\n`;
        
        narrative += `**The Reliable Tradeoff:** While slower to hit big goals compared to more aggressive approaches, this strategy builds reliable habits and reduces the mental load of financial management. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, this strategy ensures steady progress on debt while building savings automatically. `;
          narrative += `The 35% debt allocation provides consistent payments without requiring constant attention.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus on automated savings and investments.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy provides steady, predictable progress through automation. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, approximately $${Math.round(monthlyExtra * 0.45).toLocaleString()} goes to automated savings, $${Math.round(monthlyExtra * 0.35).toLocaleString()} to debt reduction, and $${Math.round(monthlyExtra * 0.2).toLocaleString()} to investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to create automated, sustainable progress.\n\n`;
        }
        
        narrative += `**Risk Considerations:** This approach reduces behavioral risk by automating decisions, but may be slower than more aggressive strategies. `;
        narrative += `The key benefit is consistency and reduced stress, which often leads to better long-term outcomes than sporadic, high-effort approaches.\n\n`;
        break;
        
      case 'opportunistic_saver':
        narrative += `This flexible savings strategy capitalizes on unexpected income and opportunities, allocating 55% of extra funds to savings while maintaining 40% for debt and 5% for investments. `;
        narrative += `It's designed for those with variable income or irregular windfalls who want to maximize savings when opportunities arise.\n\n`;
        
        narrative += `**The Opportunistic Approach:** You'll funnel bonuses, refunds, side-hustle income, and other windfalls into savings while maintaining steady progress on debt. `;
        if (totalSavings > 0) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()}, this strategy builds on your existing opportunistic saving habits. `;
        }
        narrative += `This approach works well for freelancers, commission-based workers, or anyone with irregular income patterns.\n\n`;
        
        narrative += `**The Flexible Tradeoff:** While less consistent than automated approaches, this strategy provides bursts of progress when opportunities arise. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, this strategy ensures you maintain steady debt payments while maximizing savings during good months. `;
          narrative += `The 40% debt allocation provides consistent progress regardless of income fluctuations.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus entirely on opportunistic savings and minimal investments.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy adapts to your variable income situation. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month (when available), approximately $${Math.round(monthlyExtra * 0.55).toLocaleString()} goes to savings, $${Math.round(monthlyExtra * 0.4).toLocaleString()} to debt reduction, and $${Math.round(monthlyExtra * 0.05).toLocaleString()} to investments.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow and adapts to income variations.\n\n`;
        }
        
        narrative += `**Risk Considerations:** This approach requires discipline to save during good months rather than increasing spending. `;
        narrative += `The main risk is inconsistency, but for those with variable income, this flexible approach often works better than rigid automated systems.\n\n`;
        break;
        
      case 'nest_builder':
        narrative += `This growth-oriented strategy focuses on long-term wealth building through investments, allocating 60% of extra funds to investments while maintaining some debt payments and savings. `;
        narrative += `It's designed for those who want to maximize the power of compound growth over time.\n\n`;
        
        narrative += `**The Growth Advantage:** You're maximizing the power of compound growth over time. `;
        if (totalInvestment > 0) {
          narrative += `With your current investment balance of $${totalInvestment.toLocaleString()}, this strategy builds on your existing portfolio. `;
        }
        narrative += `At a 7% annual return, your investments could potentially double every 10 years, making this strategy particularly powerful for long-term wealth building.\n\n`;
        
        narrative += `**The Tradeoff:** While you're building wealth through investments, you may pay more interest on debt over time and have less liquid savings for emergencies. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, consider whether your debt interest rates are lower than expected investment returns. `;
          narrative += `If your debt interest rates are below 6-7%, this investment-focused approach can make mathematical sense.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus entirely on wealth building.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy prioritizes long-term wealth accumulation. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, approximately $${Math.round(monthlyExtra * 0.6).toLocaleString()} goes to investments, $${Math.round(monthlyExtra * 0.2).toLocaleString()} to debt reduction, and $${Math.round(monthlyExtra * 0.2).toLocaleString()} to savings.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to prioritize investment growth.\n\n`;
        }
        
        narrative += `**Risk Considerations:** The main risk is market volatility - your portfolio value will fluctuate, sometimes significantly. `;
        narrative += `However, historical data shows that staying invested through market cycles typically leads to strong long-term returns. `;
        narrative += `The key is maintaining discipline and not selling during market downturns.\n\n`;
        break;
        
      case 'future_investor':
        narrative += `This conservative investment strategy focuses on building wealth gradually, allocating 30% of extra funds to investments while maintaining balanced debt payments and savings. `;
        narrative += `It's perfect for those who want to start investing but prefer a more cautious approach.\n\n`;
        
        narrative += `**The Gradual Growth Approach:** You're building investment momentum slowly but steadily, which helps develop the habit and confidence needed for long-term investing. `;
        if (totalInvestment > 0) {
          narrative += `With your current investment balance of $${totalInvestment.toLocaleString()}, this strategy builds on your existing foundation. `;
        }
        narrative += `This approach typically involves starting with index funds or target-date funds, which provide diversification with lower risk.\n\n`;
        
        narrative += `**The Balanced Tradeoff:** You maintain more conservative debt payments (40% allocation) and higher savings (30% allocation) compared to aggressive investment strategies. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, this strategy ensures you're making meaningful debt payments while still building wealth. `;
          narrative += `The key is ensuring your debt interest rates aren't significantly higher than expected investment returns.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus more on building both savings and investments.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy provides steady progress across all areas without taking excessive risk. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, you'll allocate approximately $${Math.round(monthlyExtra * 0.3).toLocaleString()} to investments, $${Math.round(monthlyExtra * 0.4).toLocaleString()} to debt reduction, and $${Math.round(monthlyExtra * 0.3).toLocaleString()} to savings.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to create balanced progress.\n\n`;
        }
        
        narrative += `**Risk Considerations:** This is a lower-risk investment approach that's ideal for beginners or those with lower risk tolerance. `;
        narrative += `While you may see slower growth initially, this strategy helps you stay invested during market volatility and build long-term wealth without the stress of aggressive investing.\n\n`;
        break;
        
      case 'balanced_builder':
        narrative += `This conservative, well-rounded approach balances debt payoff, savings, and investments with equal allocations (35% savings, 35% investing, 30% debt). `;
        narrative += `It's designed for those who want stability and growth together without taking excessive risk.\n\n`;
        
        narrative += `**The Balanced Benefit:** You're building wealth in multiple ways while maintaining maximum flexibility and security. `;
        if (totalSavings > 0 && totalInvestment > 0) {
          narrative += `With your current savings of $${totalSavings.toLocaleString()} and investments of $${totalInvestment.toLocaleString()}, this strategy builds on your existing foundation. `;
        }
        narrative += `This approach provides psychological comfort by ensuring you're making progress across all financial areas simultaneously.\n\n`;
        
        narrative += `**The Conservative Tradeoff:** You may not optimize any single area as much as specialized strategies would, but you avoid the risk of putting all your eggs in one basket. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, this strategy ensures steady debt reduction while building wealth. `;
          narrative += `The 30% debt allocation means you're making meaningful progress without sacrificing your financial security.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus entirely on building savings and investments equally.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy provides steady, predictable progress across all financial goals. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, you'll allocate approximately $${Math.round(monthlyExtra * 0.35).toLocaleString()} to savings, $${Math.round(monthlyExtra * 0.35).toLocaleString()} to investments, and $${Math.round(monthlyExtra * 0.3).toLocaleString()} to debt reduction.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to create balanced, sustainable progress.\n\n`;
        }
        
        narrative += `**Risk Considerations:** This is the lowest-risk approach among investment-focused strategies, making it ideal for conservative investors or those approaching retirement. `;
        narrative += `While growth may be slower, this strategy provides stability and peace of mind, which can lead to better long-term adherence and outcomes.\n\n`;
        break;
        
      case 'risk_taker':
        narrative += `This aggressive investment strategy allocates 80% of extra funds to investments while maintaining minimal debt payments (10%) and savings (10%). `;
        narrative += `It's designed for young investors who can tolerate significant market volatility for potentially higher returns.\n\n`;
        
        narrative += `**The Aggressive Growth Approach:** You're maximizing investment exposure to capture higher potential returns, typically focusing on growth stocks, emerging markets, or sector-specific funds. `;
        if (totalInvestment > 0) {
          narrative += `With your current investment balance of $${totalInvestment.toLocaleString()}, this strategy builds on your existing portfolio with high-growth potential assets. `;
        }
        narrative += `This approach is suitable for those with 20+ year investment horizons who can ride out market volatility.\n\n`;
        
        narrative += `**The High-Risk, High-Reward Tradeoff:** While you have potential for significantly higher returns, you'll experience much greater portfolio volatility and may face substantial losses during market downturns. `;
        if (totalDebt > 0) {
          narrative += `With $${totalDebt.toLocaleString()} in debt, this strategy assumes your debt interest rates are low enough that investment returns will exceed them over the long term. `;
          narrative += `However, if your debt rates are above 8-10%, consider prioritizing debt reduction instead.\n\n`;
        } else {
          narrative += `Without debt, this strategy can focus entirely on aggressive wealth building.\n\n`;
        }
        
        narrative += `**Goal Impact:** This strategy prioritizes long-term wealth maximization over short-term security. `;
        if (monthlyExtra > 0) {
          narrative += `With your additional $${monthlyExtra.toLocaleString()}/month, approximately $${Math.round(monthlyExtra * 0.8).toLocaleString()} goes to investments, $${Math.round(monthlyExtra * 0.1).toLocaleString()} to debt reduction, and $${Math.round(monthlyExtra * 0.1).toLocaleString()} to savings.\n\n`;
        } else {
          narrative += `Without additional contributions, this strategy works with your current cash flow to maximize investment exposure.\n\n`;
        }
        
        narrative += `**Risk Considerations:** This is the highest-risk investment approach, suitable only for those with high risk tolerance and long investment horizons. `;
        narrative += `Portfolio values can drop 30-50% during market downturns, so you must be prepared to hold through volatility without panic selling. `;
        narrative += `This strategy is not recommended for those nearing retirement or with low risk tolerance.\n\n`;
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
