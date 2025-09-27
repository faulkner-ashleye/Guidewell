import React, { useState, useEffect } from 'react';
import { estimateBaselineMonthly, Scope } from '../../../state/baseline';
import { Account } from '../../../state/AppStateContext';
import { Transaction } from '../../../lib/supabase';
import { formatCurrency } from '../../../state/selectors';

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


  // Calculate actual monthly income from transactions
  const calculateMonthlyIncome = (): number => {
    if (!transactions || transactions.length === 0) {
      return 5000; // Fallback to default if no transaction data
    }

    // Filter for positive transactions (income) from the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentIncomeTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= threeMonthsAgo && tx.amount > 0;
    });

    if (recentIncomeTransactions.length === 0) {
      return 5000; // Fallback if no recent income transactions
    }

    // Calculate total income over the period
    const totalIncome = recentIncomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate average monthly income
    const monthsInPeriod = 3;
    const averageMonthlyIncome = totalIncome / monthsInPeriod;
    
    return Math.max(1000, averageMonthlyIncome); // Minimum $1000/month
  };

  // Calculate suggested range based on actual income
  const monthlyIncome = calculateMonthlyIncome();
  const suggestedLow = Math.floor(0.05 * monthlyIncome);
  const suggestedHigh = Math.floor(0.15 * monthlyIncome);

  // Calculate slider range (0 to 2x suggested high, with reasonable max)
  const sliderMax = Math.min(2000, Math.max(suggestedHigh * 2, 1000));
  const sliderValue = extraDollars || 0;

  return (
    <div className="flex flex-col gap-lg">
      {/* Slider Control */}
      <div className="contribution-slider">
        <div className="slider-labels">
          <label className="slider-label">Extra contribution ($)</label>
          <span className="slider-value">{formatCurrency(sliderValue)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={sliderMax}
          step="25"
          value={sliderValue}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            setExtraDollars(newValue);
          }}
          className="contribution-range-slider"
        />
        <div className="slider-range-labels">
          <span>$0</span>
          <span>{formatCurrency(sliderMax)}</span>
        </div>
      </div>

      {/* Suggested range - always show */}
      <div className="alert info text-sm">
        Suggested range: ${suggestedLow.toLocaleString()}–${suggestedHigh.toLocaleString()} 
        {transactions && transactions.length > 0 
          ? ` based on your recent income patterns` 
          : ` based on typical income patterns`}
      </div>

    </div>
  );
}
