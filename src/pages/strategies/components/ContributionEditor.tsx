import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { estimateBaselineMonthly, Scope } from '../../../state/baseline';
import { Account } from '../../../state/AppStateContext';
import { Transaction } from '../../../lib/supabase';

type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';

interface ContributionEditorProps {
  extra: number | undefined;
  strategy: Strategy;
  scope: Scope;
  accounts: Account[];
  transactions?: Transaction[];
  goalsMonthly?: number;
  onExtraChange: (extra: number | undefined) => void;
}

export function ContributionEditor({
  extra,
  strategy,
  scope,
  accounts,
  transactions = [],
  goalsMonthly = 0,
  onExtraChange
}: ContributionEditorProps) {
  const [inputMode, setInputMode] = useState<'dollar' | 'percent'>('dollar');
  const [extraDollars, setExtraDollars] = useState<number | undefined>(extra);
  const [extraPercent, setExtraPercent] = useState<number | undefined>(undefined);
  
  // Calculate baseline monthly contribution
  const baselineMonthly = estimateBaselineMonthly(scope, strategy, { 
    accounts, 
    transactions, 
    goalsMonthly 
  });
  
  // Calculate computed extra when in percent mode
  const computedExtra = inputMode === 'percent' && extraPercent 
    ? Math.round(baselineMonthly * (extraPercent / 100))
    : extraDollars;

  // Update parent component when computed extra changes
  useEffect(() => {
    onExtraChange(computedExtra);
  }, [computedExtra, onExtraChange]);


  // Mock account data for suggestion
  const mockMonthlyInflow = 5000; // Example monthly direct deposit
  const suggestedLow = Math.floor(0.05 * mockMonthlyInflow);
  const suggestedHigh = Math.floor(0.15 * mockMonthlyInflow);

  return (
    <div className="flex flex-col gap-lg">
      {/* Input Mode Toggle */}
      <div className="m-md">
        <div className="m-sm text-sm font-medium text-grey-700">
          Input Mode:
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => setInputMode('dollar')}
            className={`p-sm rounded-md text-sm font-medium cursor-pointer transition-all ${
              inputMode === 'dollar' 
                ? 'bg-primary-subtle text-primary-dark' 
                : 'bg-paper text-grey-700'
            }`}
            style={{
              border: `2px solid ${inputMode === 'dollar' ? 'var(--color-primary-main)' : 'var(--color-grey-300)'}`
            }}
          >
            $ Dollar Amount
          </button>
          <button
            onClick={() => setInputMode('percent')}
            className={`p-sm rounded-md text-sm font-medium cursor-pointer transition-all ${
              inputMode === 'percent' 
                ? 'bg-primary-subtle text-primary-dark' 
                : 'bg-paper text-grey-700'
            }`}
            style={{
              border: `2px solid ${inputMode === 'percent' ? 'var(--color-primary-main)' : 'var(--color-grey-300)'}`
            }}
          >
            % Percentage
          </button>
        </div>
      </div>

      {/* Currency Input */}
      <div>
        <CurrencyInput
          value={inputMode === 'dollar' ? extraDollars : extraPercent}
          onChange={(value) => {
            if (inputMode === 'dollar') {
              setExtraDollars(value);
            } else {
              // Clamp percentage to 0-100
              const clampedValue = value ? Math.max(0, Math.min(100, value)) : undefined;
              setExtraPercent(clampedValue);
            }
          }}
          placeholder={inputMode === 'dollar' ? "500.00" : "20"}
          label={`Extra contribution ${inputMode === 'dollar' ? '($)' : '(%)'}`}
        />
        
        {/* Baseline estimation helper */}
        {inputMode === 'percent' && (
          <div className={`m-sm p-sm rounded-md text-xs ${
            baselineMonthly > 0 
              ? 'bg-info-subtle text-info-dark' 
              : 'bg-error-subtle text-error-dark'
          }`} style={{
            border: `1px solid ${baselineMonthly > 0 ? 'var(--color-info-light)' : 'var(--color-error-light)'}`
          }}>
            {baselineMonthly > 0 ? (
              <>
                Estimated baseline: ${baselineMonthly.toLocaleString()}/mo → {extraPercent || 0}% ≈ ${computedExtra?.toLocaleString() || 0} extra
              </>
            ) : (
              'Not enough data to estimate. Enter a $ amount instead.'
            )}
          </div>
        )}
        
        {/* Helper text when empty */}
        {computedExtra === undefined && inputMode === 'dollar' && (
          <div className="m-sm text-xs text-grey-500 italic">
            If left blank, we'll assume the maximum time for the selected timeline.
          </div>
        )}
        
        {/* Suggested range for dollar mode */}
        {computedExtra === undefined && inputMode === 'dollar' && (
          <div className="m-sm p-sm bg-info-subtle rounded-md text-xs text-info-dark" style={{ border: '1px solid var(--color-info-light)' }}>
            Suggested range: ${suggestedLow.toLocaleString()}–${suggestedHigh.toLocaleString()} based on recent inflows
          </div>
        )}
      </div>

    </div>
  );
}
