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
  const [extraDollars, setExtraDollars] = useState<number | undefined>(extra);

  // Calculate baseline monthly contribution
  const baselineMonthly = estimateBaselineMonthly(scope, strategy, {
    accounts,
    transactions,
    goalsMonthly
  });

  // Update parent component when extra dollars changes
  useEffect(() => {
    onExtraChange(extraDollars);
  }, [extraDollars, onExtraChange]);


  // Mock account data for suggestion
  const mockMonthlyInflow = 5000; // Example monthly direct deposit
  const suggestedLow = Math.floor(0.05 * mockMonthlyInflow);
  const suggestedHigh = Math.floor(0.15 * mockMonthlyInflow);

  return (
    <div className="flex flex-col gap-lg">
      {/* Currency Input */}
      <div>
        <CurrencyInput
          value={extraDollars}
          onChange={(value) => {
            setExtraDollars(value);
          }}
          placeholder="500.00"
          label="Extra contribution ($)"
        />

        {/* Helper text when empty */}
        {extraDollars === undefined && (
          <div className="m-sm text-xs text-grey-500 italic">
            If left blank, we'll assume the maximum time for the selected timeline.
          </div>
        )}

        {/* Suggested range */}
        {extraDollars === undefined && (
          <div className="alert info text-sm">
            Suggested range: ${suggestedLow.toLocaleString()}–${suggestedHigh.toLocaleString()} based on recent inflows
          </div>
        )}
      </div>

    </div>
  );
}
