import React, { useState, useEffect } from 'react';
import { Account } from '../../../state/AppStateContext';
import { Goal } from '../../../app/types';
import { Transaction } from '../../../lib/supabase';
import {
  monthsFor,
  futureValueMonthly,
  monthsToReach,
  extraPrincipalReduced,
  investingOpportunityCost,
  formatCurrency,
  formatPercentage,
  humanizeMonths
} from '../../../strategy/tradeoffMath';
import { aiIntegrationService, AIPromptContext } from '../../../services/aiIntegrationService';
import { AvatarUtils, NarrativeAvatar } from '../../../data/narrativeAvatars';
import { EnhancedUserProfile } from '../../../data/enhancedUserProfile';
import { marketDataService } from '../../../services/marketDataService';
import './BreakdownModal.css';

type Scope = 'all' | 'debts' | 'savings' | 'investing';
type Strat = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';
type Timeframe = 'short' | 'mid' | 'long';

type Props = {
  open: boolean;
  onClose: () => void;

  // scenario selections
  scope: Scope;
  strategy: Strat;
  timeframe: Timeframe;
  extraDollars?: number;
  allocation?: { debt: number; savings: number; investing: number };

  // data context
  accounts: Account[];
  goals: Goal[];
  transactions?: Transaction[];
  userProfile?: EnhancedUserProfile;

  // knobs (optional)
  assumedAnnualReturn?: number;
};

export function BreakdownModal({
  open,
  onClose,
  scope,
  strategy,
  timeframe,
  extraDollars,
  allocation,
  accounts,
  goals,
  transactions = [],
  userProfile,
  assumedAnnualReturn = 0.06
}: Props) {
  // State for AI-powered narrative and market insights (must be called before any early returns)
  const [narrative, setNarrative] = useState<string>('Generating personalized insights...');
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(true);
  const [marketInsights, setMarketInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  const months = monthsFor(timeframe);

  // Derive effective allocation
  const effectiveAllocation = allocation || getDefaultAllocation(strategy);
  // Use a default amount for educational purposes when no specific amount is provided
  const extraMonthlyTotal = extraDollars !== undefined ? extraDollars : 500;
  const extraMonthlyToDebt = (extraMonthlyTotal * effectiveAllocation.debt) / 100;
  const extraMonthlyToSavings = (extraMonthlyTotal * effectiveAllocation.savings) / 100;
  const extraMonthlyToInvesting = (extraMonthlyTotal * effectiveAllocation.investing) / 100;

  // Get savings goals
  const savingsGoals = goals.filter(goal => goal.type === 'savings');

  // Get debt accounts
  const debtAccounts = accounts.filter(acc => acc.type === 'loan' || acc.type === 'credit_card');

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (open) {
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
  }, [open]);

  // Generate AI-powered narrative and market insights
  useEffect(() => {
    const generateContent = async () => {
      setIsLoadingNarrative(true);
      setIsLoadingInsights(true);

      try {
        // Generate narrative
        const aiNarrative = await generateAINarrative(
          scope,
          strategy,
          timeframe,
          months,
          extraDollars,
          accounts,
          goals,
          userProfile,
          effectiveAllocation
        );
        setNarrative(aiNarrative);

        // Generate market insights
        const insights = await generateMarketInsights(accounts, userProfile, strategy);
        setMarketInsights(insights);

      } catch (error) {
        console.error('Error generating content:', error);
        setNarrative(generateFallbackNarrative(scope, strategy, timeframe, months, extraDollars));
        setMarketInsights(['Market insights temporarily unavailable.']);
      } finally {
        setIsLoadingNarrative(false);
        setIsLoadingInsights(false);
      }
    };

    if (open) {
      generateContent();
    }
  }, [open, scope, strategy, timeframe, months, extraDollars, accounts, goals, userProfile, effectiveAllocation]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="breakdown-modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="breakdown-modal-content"
      >
        {/* Header */}
        <div className="breakdown-modal-header">
          <h2 className="breakdown-modal-title">
            Full breakdown
          </h2>
          <button
            onClick={onClose}
            className="breakdown-modal-close-btn"
          >
            ×
          </button>
        </div>

        {/* Compliance Notice */}
        <div className="breakdown-modal-compliance-notice">
          {extraDollars === undefined && (
            <div style={{ marginTop: '8px', fontSize: '11px' }}>
              💡 Using $500/month for educational calculations since no specific amount was provided.
            </div>
          )}
        </div>

        <div className="breakdown-modal-body">
          {/* Overview */}
          <div className="breakdown-modal-section breakdown-modal-overview">
            <h3 className="breakdown-modal-section-title breakdown-modal-overview-title">
              Scenario Overview
            </h3>
            <p className="breakdown-modal-text">
              {narrative}
            </p>
          </div>

          {/* Debt Impact */}
          {extraMonthlyToDebt > 0 && debtAccounts.length > 0 && (
            <div className="breakdown-modal-section breakdown-modal-debt-impact">
              <h3 className="breakdown-modal-section-title breakdown-modal-debt-title">
                Debt Impact
              </h3>
              <div className="breakdown-modal-text">
                Directing {formatCurrency(extraMonthlyToDebt)}/mo extra to debt for ~{humanizeMonths(months)} could reduce principal by ≈ {formatCurrency(extraPrincipalReduced(extraMonthlyToDebt, months))}
              </div>
              <div>
                Figures are estimates; interest timing and fees are not modeled.
              </div>
            </div>
          )}

          {/* Savings Trade-off */}
          {savingsGoals.length > 0 && (
            <div className="breakdown-modal-section breakdown-modal-savings-tradeoff">
              <h3 className="breakdown-modal-section-title breakdown-modal-savings-title">
                Savings Trade-off
              </h3>
              {savingsGoals.map(goal => {
                const currentBalance = goal.accountId
                  ? accounts.find(acc => acc.id === goal.accountId)?.balance || 0
                  : 0;
                const currentMonthly = goal.monthlyContribution || 0;
                const baselineMonths = monthsToReach(goal.target, currentBalance, currentMonthly);
                const scenarioMonths = monthsToReach(goal.target, currentBalance, currentMonthly + extraMonthlyToSavings);
                const delay = Math.max(0, scenarioMonths - baselineMonths);

                return (
                  <div key={goal.id} className="breakdown-modal-savings-goal">
                    <strong>{goal.name}</strong> — {delay > 0
                      ? `delaying target by ~${humanizeMonths(delay)} if ${formatCurrency(extraMonthlyToSavings)}/mo is diverted to this goal during the period`
                      : `no delay expected with current allocation`
                    }
                  </div>
                );
              })}
            </div>
          )}

          {/* Investing Opportunity Cost */}
          <div className="breakdown-modal-section breakdown-modal-investing-opportunity">
            <h3 className="breakdown-modal-section-title breakdown-modal-investing-title">
              Investing Opportunity Cost
            </h3>
            {extraMonthlyToInvesting > 0 ? (
              <div className="breakdown-modal-text">
                Not allocating {formatCurrency(extraMonthlyToInvesting)}/mo to investing for ~{humanizeMonths(months)} could forgo ≈ {formatCurrency(investingOpportunityCost(extraMonthlyToInvesting, months, assumedAnnualReturn))} at an assumed {formatPercentage(assumedAnnualReturn)} annual rate (hypothetical).
              </div>
            ) : (
              <div className="breakdown-modal-text">
                If invested, a comparable amount could have grown to ≈ {formatCurrency(futureValueMonthly(extraMonthlyTotal, assumedAnnualReturn, months))} over ~{humanizeMonths(months)} at an assumed {formatPercentage(assumedAnnualReturn)} annual rate (hypothetical).
              </div>
            )}
            <div className="text-xs text-muted">
              Historical performance is not a guarantee of future returns.
            </div>
          </div>

          {/* Market Insights */}
          {marketInsights.length > 0 && (
            <div className="breakdown-modal-section breakdown-modal-market-insights">
              <h3 className="breakdown-modal-section-title breakdown-modal-market-title">
                Market Insights
              </h3>
              <ul className="breakdown-modal-market-list">
                {marketInsights.map((insight, index) => (
                  <li key={index} className={`breakdown-modal-market-item ${isLoadingInsights ? 'breakdown-modal-market-item-loading' : ''}`}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Assumptions & Caveats */}
          <div className="breakdown-modal-section breakdown-modal-assumptions">
            <h3 className="breakdown-modal-section-title breakdown-modal-assumptions-title">
              Assumptions & Caveats
            </h3>
            <ul className="breakdown-modal-assumptions-list">
              <li>Assumed annual return: {formatPercentage(assumedAnnualReturn)}</li>
              <li>Monthly compounding assumed</li>
              <li>Constant monthly contributions assumed</li>
              <li>Interest timing effects not modeled for debt calculations</li>
              <li>Market volatility and fees not included</li>
              <li>Actual outcomes will vary significantly</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="breakdown-modal-footer">
          This is an educational scenario, not financial, legal, or investment advice. Actual outcomes vary.
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultAllocation(strategy: Strat): { debt: number; savings: number; investing: number } {
  // Use the narrative avatars system for consistent allocations
  const avatar = AvatarUtils.getAvatarById(strategy);
  if (avatar) {
    return avatar.allocation;
  }

  // Fallback to original logic
  switch (strategy) {
    case 'debt_crusher':
      return { debt: 80, savings: 15, investing: 5 };
    case 'goal_keeper':
      return { debt: 30, savings: 50, investing: 20 };
    case 'nest_builder':
      return { debt: 20, savings: 30, investing: 50 };
    default:
      return { debt: 40, savings: 30, investing: 30 };
  }
}

async function generateAINarrative(
  scope: Scope,
  strategy: Strat,
  timeframe: Timeframe,
  months: number,
  extraDollars: number | undefined,
  accounts: Account[],
  goals: Goal[],
  userProfile: EnhancedUserProfile | undefined,
  allocation: { debt: number; savings: number; investing: number }
): Promise<string> {
  try {
    // Get the narrative avatar for this strategy
    const avatar = AvatarUtils.getAvatarById(strategy);
    if (!avatar) {
      return generateFallbackNarrative(scope, strategy, timeframe, months, extraDollars);
    }

    // Calculate user context
    const totalDebt = accounts
      .filter(a => ['loan', 'credit_card'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);

    const totalSavings = accounts
      .filter(a => ['checking', 'savings'].includes(a.type))
      .reduce((sum, a) => sum + a.balance, 0);

    const totalInvestment = accounts
      .filter(a => a.type === 'investment')
      .reduce((sum, a) => sum + a.balance, 0);

    const monthlyContribution = extraDollars || 500; // Use default for educational purposes

    // Generate avatar-based narrative with user context
    let narrative = AvatarUtils.generateAvatarNarrative(avatar, {
      totalDebt,
      totalSavings,
      totalInvestment,
      monthlyContribution
    });

    // Add personalized insights if user profile is available
    if (userProfile) {
      narrative = addPersonalizedInsights(narrative, userProfile, avatar, allocation, months, extraDollars);
    }

    // Add timeframe and scope context
    const timeframeText = {
      short: '3-12 months',
      mid: '1-5 years',
      long: '5+ years'
    };

    const scopeText = scope === 'all' ? 'all accounts' : scope;

    narrative += ` This ${avatar.name} scenario focuses on ${scopeText} over ${timeframeText[timeframe]}.`;


    return narrative;
  } catch (error) {
    console.error('Error generating AI narrative:', error);
    return generateFallbackNarrative(scope, strategy, timeframe, months, extraDollars);
  }
}

function generateFallbackNarrative(scope: Scope, strategy: Strat, timeframe: Timeframe, months: number, extraDollars?: number): string {
  const strategyNames = {
    debt_crusher: 'Debt Crusher',
    steady_payer: 'Steady Payer',
    juggler: 'Juggler',
    interest_minimizer: 'Interest Minimizer',
    goal_keeper: 'Goal Keeper',
    safety_builder: 'Safety Builder',
    auto_pilot: 'Auto-Pilot',
    opportunistic_saver: 'Opportunistic Saver',
    nest_builder: 'Nest Builder',
    future_investor: 'Future Investor',
    balanced_builder: 'Balanced Builder',
    risk_taker: 'Risk Taker'
  };

  const timeframeText = {
    short: '3-12 months',
    mid: '1-5 years',
    long: '5+ years'
  };

  const scopeText = scope === 'all' ? 'all accounts' : scope;

  let narrative = `This ${strategyNames[strategy]} scenario focuses on ${scopeText} over ${timeframeText[timeframe]}. `;

  if (extraDollars === undefined) {
    const emphasisCategory =
      ['debt_crusher', 'steady_payer', 'juggler', 'interest_minimizer'].includes(strategy) ? 'debt' :
      ['goal_keeper', 'safety_builder', 'auto_pilot', 'opportunistic_saver'].includes(strategy) ? 'savings' :
      'investing';

    narrative += `Since no extra contribution was specified, we assume the maximum of ${months} months for this timeline and show how emphasizing ${emphasisCategory} may affect your other goals. `;
  } else {
    const primaryFocus =
      ['debt_crusher', 'steady_payer', 'juggler', 'interest_minimizer'].includes(strategy) ? 'higher-interest debt' :
      ['goal_keeper', 'safety_builder', 'auto_pilot', 'opportunistic_saver'].includes(strategy) ? 'savings goals' :
      'investments';

    narrative += `With an extra ${formatCurrency(extraDollars)}/mo directed primarily to ${primaryFocus}, you could accelerate progress while maintaining minimum payments elsewhere. `;
  }


  return narrative;
}

async function generateMarketInsights(
  accounts: Account[],
  userProfile: EnhancedUserProfile | undefined,
  strategy: Strat
): Promise<string[]> {
  try {
    const insights: string[] = [];

    // Get market data
    const marketData = await marketDataService.getMarketData();

    // Analyze current rates vs market rates
    const savingsAccounts = accounts.filter(a => a.type === 'savings');
    const creditCards = accounts.filter(a => a.type === 'credit_card');

    // Savings rate insights
    if (savingsAccounts.length > 0) {
      const avgSavingsRate = savingsAccounts.reduce((sum, acc) => sum + (acc.apr || 0), 0) / savingsAccounts.length;
      const highYieldRate = marketData.savingsAccounts.highYield;

      if (avgSavingsRate < highYieldRate - 0.5) {
        insights.push(`Your savings accounts earn ${formatPercentage(avgSavingsRate)}, but high-yield accounts currently offer ${formatPercentage(highYieldRate)}.`);
      }
    }

    // Credit card insights
    if (creditCards.length > 0) {
      const highInterestCards = creditCards.filter(card => (card.apr || 0) > 20);
      if (highInterestCards.length > 0) {
        const avgBalanceTransferRate = marketData.creditCards.balanceTransfer;
        insights.push(`You have ${highInterestCards.length} high-interest credit card${highInterestCards.length > 1 ? 's' : ''}. Balance transfer cards currently offer rates as low as ${formatPercentage(avgBalanceTransferRate)}.`);
      }
    }

    // Investment insights
    const investmentAccounts = accounts.filter(a => a.type === 'investment');
    if (investmentAccounts.length === 0 && userProfile?.mainGoals.includes('start_investing')) {
      insights.push(`Market conditions are favorable for starting to invest. Consider low-cost index funds for long-term growth.`);
    }

    // Strategy-specific insights
    const avatar = AvatarUtils.getAvatarById(strategy);
    if (avatar) {
      if (avatar.category === 'debt' && userProfile?.riskTolerance === 'conservative') {
        insights.push(`Your conservative approach to debt payoff aligns well with current market conditions.`);
      } else if (avatar.category === 'investment' && userProfile?.riskTolerance === 'aggressive') {
        insights.push(`Current market volatility could present opportunities for your aggressive investment strategy.`);
      }
    }

    // Add general market context based on current rates
    const sp500Return = marketData.investments.sp500AverageReturn;
    const inflationRate = marketData.investments.inflationRate;

    if (sp500Return > inflationRate + 5) {
      insights.push(`Market conditions are favorable for long-term investment strategies, with S&P 500 averaging ${formatPercentage(sp500Return)} returns.`);
    } else if (sp500Return < inflationRate + 2) {
      insights.push(`Current market conditions may favor conservative approaches and debt reduction strategies.`);
    }

    return insights.length > 0 ? insights : ['Market conditions are stable. Your current strategy appears well-suited to the environment.'];

  } catch (error) {
    console.error('Error generating market insights:', error);
    return ['Market insights temporarily unavailable due to data connectivity issues.'];
  }
}

function addPersonalizedInsights(
  baseNarrative: string,
  userProfile: EnhancedUserProfile,
  avatar: NarrativeAvatar,
  allocation: { debt: number; savings: number; investing: number },
  months: number,
  extraDollars: number | undefined
): string {
  let personalizedNarrative = baseNarrative;

  // Add personalization based on AI personality
  if (userProfile.aiPersonality === 'encouraging') {
    personalizedNarrative = `You're doing great! ${personalizedNarrative}`;
  } else if (userProfile.aiPersonality === 'analytical') {
    personalizedNarrative = `Based on your financial profile: ${personalizedNarrative}`;
  } else if (userProfile.aiPersonality === 'casual') {
    personalizedNarrative = `Here's the deal: ${personalizedNarrative}`;
  }

  // Add detail level adjustments
  if (userProfile.detailLevel === 'low') {
    // Keep it simple - already done by avatar selection
  } else if (userProfile.detailLevel === 'high') {
    personalizedNarrative += ` This approach considers your risk tolerance (${userProfile.riskTolerance}) and aligns with your main goals: ${userProfile.mainGoals.join(', ')}.`;
  }

  // Add communication style adjustments
  if (userProfile.communicationStyle === 'visual') {
    personalizedNarrative += ` 📊 Visual breakdowns below show the impact.`;
  }

  // Add specific allocation insights
  const debtAllocation = allocation.debt;
  const savingsAllocation = allocation.savings;
  const investingAllocation = allocation.investing;

  if (extraDollars === undefined) {
    personalizedNarrative += ` This educational scenario shows potential impact without specific contribution amounts.`;
  } else if (debtAllocation > 50) {
    personalizedNarrative += ` With ${debtAllocation}% going to debt, you're prioritizing financial freedom.`;
  } else if (savingsAllocation > 50) {
    personalizedNarrative += ` With ${savingsAllocation}% going to savings, you're building security first.`;
  } else if (investingAllocation > 50) {
    personalizedNarrative += ` With ${investingAllocation}% going to investments, you're focused on long-term growth.`;
  }

  return personalizedNarrative;
}
