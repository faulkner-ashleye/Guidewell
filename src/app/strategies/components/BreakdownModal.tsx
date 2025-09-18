import React from 'react';
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

type Scope = 'all' | 'debts' | 'savings' | 'investing';
type Strat = 'debt_crusher' | 'goal_keeper' | 'nest_builder';
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
  assumedAnnualReturn = 0.06
}: Props) {
  if (!open) return null;

  const months = monthsFor(timeframe);
  const timeframeText = {
    short: '3-12 months',
    mid: '1-5 years',
    long: '5+ years'
  };

  // Derive effective allocation
  const effectiveAllocation = allocation || getDefaultAllocation(strategy);
  const extraMonthlyTotal = extraDollars || 0;
  const extraMonthlyToDebt = (extraMonthlyTotal * effectiveAllocation.debt) / 100;
  const extraMonthlyToSavings = (extraMonthlyTotal * effectiveAllocation.savings) / 100;
  const extraMonthlyToInvesting = (extraMonthlyTotal * effectiveAllocation.investing) / 100;

  // Get savings goals
  const savingsGoals = goals.filter(goal => goal.type === 'savings');
  
  // Get debt accounts
  const debtAccounts = accounts.filter(acc => acc.type === 'loan' || acc.type === 'credit_card');

  // Generate narrative
  const narrative = generateNarrative(scope, strategy, timeframe, months, extraDollars);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Full breakdown (educational scenario)
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Compliance Notice */}
        <div style={{
          padding: '12px 24px',
          background: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          fontSize: '12px',
          color: '#dc2626',
          fontWeight: '500'
        }}>
          Educational scenario only — not financial, legal, or investment advice. Actual results vary.
        </div>

        <div style={{ padding: '24px' }}>
          {/* Overview */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827'
            }}>
              Scenario Overview
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#374151'
            }}>
              {narrative}
            </p>
          </div>

          {/* Debt Impact */}
          {extraMonthlyToDebt > 0 && debtAccounts.length > 0 && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#dc2626'
              }}>
                Debt Impact
              </h3>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Directing {formatCurrency(extraMonthlyToDebt)}/mo extra to debt for ~{humanizeMonths(months)} could reduce principal by ≈ {formatCurrency(extraPrincipalReduced(extraMonthlyToDebt, months))}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#dc2626',
                fontStyle: 'italic'
              }}>
                Figures are estimates; interest timing and fees are not modeled.
              </div>
            </div>
          )}

          {/* Savings Trade-off */}
          {savingsGoals.length > 0 && (
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#0369a1'
              }}>
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
                  <div key={goal.id} style={{
                    fontSize: '14px',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
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
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#166534'
            }}>
              Investing Opportunity Cost
            </h3>
            {extraMonthlyToInvesting > 0 ? (
              <div style={{
                fontSize: '14px',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Not allocating {formatCurrency(extraMonthlyToInvesting)}/mo to investing for ~{humanizeMonths(months)} could forgo ≈ {formatCurrency(investingOpportunityCost(extraMonthlyToInvesting, months, assumedAnnualReturn))} at an assumed {formatPercentage(assumedAnnualReturn)} annual rate (hypothetical).
              </div>
            ) : (
              <div style={{
                fontSize: '14px',
                color: '#374151',
                marginBottom: '8px'
              }}>
                If invested, a comparable amount could have grown to ≈ {formatCurrency(futureValueMonthly(extraMonthlyTotal, assumedAnnualReturn, months))} over ~{humanizeMonths(months)} at an assumed {formatPercentage(assumedAnnualReturn)} annual rate (hypothetical).
              </div>
            )}
            <div style={{
              fontSize: '12px',
              color: '#166534',
              fontStyle: 'italic'
            }}>
              Historical performance is not a guarantee of future returns.
            </div>
          </div>

          {/* Assumptions & Caveats */}
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827'
            }}>
              Assumptions & Caveats
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6'
            }}>
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
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          This is an educational scenario, not financial, legal, or investment advice. Actual outcomes vary.
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultAllocation(strategy: Strat): { debt: number; savings: number; investing: number } {
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

function generateNarrative(scope: Scope, strategy: Strat, timeframe: Timeframe, months: number, extraDollars?: number): string {
  const strategyNames = {
    debt_crusher: 'Debt Crusher',
    goal_keeper: 'Goal Keeper',
    nest_builder: 'Nest Builder'
  };

  const timeframeText = {
    short: '3-12 months',
    mid: '1-5 years',
    long: '5+ years'
  };

  const scopeText = scope === 'all' ? 'all accounts' : scope;

  let narrative = `This ${strategyNames[strategy]} scenario focuses on ${scopeText} over ${timeframeText[timeframe]}. `;

  if (extraDollars === undefined) {
    narrative += `Since no extra contribution was specified, we assume the maximum of ${months} months for this timeline and show how emphasizing ${strategy === 'debt_crusher' ? 'debt' : strategy === 'goal_keeper' ? 'savings' : 'investing'} may affect your other goals. `;
  } else {
    narrative += `With an extra ${formatCurrency(extraDollars)}/mo directed primarily to ${strategy === 'debt_crusher' ? 'higher-interest debt' : strategy === 'goal_keeper' ? 'savings goals' : 'investments'}, you could accelerate progress while maintaining minimum payments elsewhere. `;
  }

  narrative += `This is an educational scenario, not financial advice.`;

  return narrative;
}
