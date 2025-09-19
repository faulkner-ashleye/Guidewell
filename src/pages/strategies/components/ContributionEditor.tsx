import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { estimateBaselineMonthly, Scope } from '../../../state/baseline';
import { Account } from '../../../state/AppStateContext';
import { Transaction } from '../../../lib/supabase';

type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';

interface ContributionEditorProps {
  extra: number | undefined;
  allocMode: 'preset' | 'custom';
  allocation: {debt: number; savings: number; investing: number} | undefined;
  strategy: Strategy;
  scope: Scope;
  accounts: Account[];
  transactions?: Transaction[];
  goalsMonthly?: number;
  onExtraChange: (extra: number | undefined) => void;
  onAllocModeChange: (mode: 'preset' | 'custom') => void;
  onAllocationChange: (allocation: {debt: number; savings: number; investing: number} | undefined) => void;
}

export function ContributionEditor({
  extra,
  allocMode,
  allocation,
  strategy,
  scope,
  accounts,
  transactions = [],
  goalsMonthly = 0,
  onExtraChange,
  onAllocModeChange,
  onAllocationChange
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

  // Get preset allocation based on strategy
  const getPresetAllocation = (strategy: Strategy) => {
    switch (strategy) {
      // Debt-focused avatars
      case 'debt_crusher':
        return { debt: 80, savings: 10, investing: 10 };
      case 'steady_payer':
        return { debt: 60, savings: 25, investing: 15 };
      case 'juggler':
        return { debt: 50, savings: 30, investing: 20 };
      case 'interest_minimizer':
        return { debt: 70, savings: 20, investing: 10 };
      
      // Savings-focused avatars
      case 'goal_keeper':
        return { debt: 30, savings: 60, investing: 10 };
      case 'safety_builder':
        return { debt: 40, savings: 50, investing: 10 };
      case 'auto_pilot':
        return { debt: 35, savings: 45, investing: 20 };
      case 'opportunistic_saver':
        return { debt: 40, savings: 55, investing: 5 };
      
      // Investment-focused avatars
      case 'nest_builder':
        return { debt: 20, savings: 20, investing: 60 };
      case 'future_investor':
        return { debt: 40, savings: 30, investing: 30 };
      case 'balanced_builder':
        return { debt: 30, savings: 35, investing: 35 };
      case 'risk_taker':
        return { debt: 10, savings: 10, investing: 80 };
      
      default:
        return { debt: 40, savings: 30, investing: 30 };
    }
  };

  const handleAllocationModeChange = (mode: 'preset' | 'custom') => {
    onAllocModeChange(mode);
    if (mode === 'preset') {
      onAllocationChange(getPresetAllocation(strategy));
    }
  };

  const handleAllocationChange = (type: 'debt' | 'savings' | 'investing', value: number) => {
    if (!allocation) return;
    
    const newAlloc = { ...allocation, [type]: value };
    onAllocationChange(newAlloc);
  };

  const totalAllocation = allocation ? allocation.debt + allocation.savings + allocation.investing : 0;
  const isValidAllocation = computedExtra ? Math.abs(totalAllocation - computedExtra) < 0.01 : true;

  // Mock account data for suggestion
  const mockMonthlyInflow = 5000; // Example monthly direct deposit
  const suggestedLow = Math.floor(0.05 * mockMonthlyInflow);
  const suggestedHigh = Math.floor(0.15 * mockMonthlyInflow);

  return (
    <div className="flex flex-col gap-lg">
      {/* Input Mode Toggle */}
      <div className="mb-sm">
        <div className="mb-xs text-sm font-medium text-gray-700">
          Input Mode:
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => setInputMode('dollar')}
            className={`px-md py-xs border-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
              inputMode === 'dollar' 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            $ Dollar Amount
          </button>
          <button
            onClick={() => setInputMode('percent')}
            className={`px-md py-xs border-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
              inputMode === 'percent' 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700'
            }`}
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
          <div className={`mt-xs px-sm py-xs rounded-md text-xs ${
            baselineMonthly > 0 
              ? 'bg-blue-50 border border-blue-200 text-blue-700' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
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
          <div className="mt-xs text-xs text-gray-500 italic">
            If left blank, we'll assume the maximum time for the selected timeline.
          </div>
        )}
        
        {/* Suggested range for dollar mode */}
        {computedExtra === undefined && inputMode === 'dollar' && (
          <div className="mt-xs px-sm py-xs bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
            Suggested range: ${suggestedLow.toLocaleString()}–${suggestedHigh.toLocaleString()} based on recent inflows
          </div>
        )}
      </div>

      {/* Allocation section - only show if extra is provided */}
      {computedExtra !== undefined && (
        <div>
          <div className="mb-sm text-sm font-medium text-gray-700">
            Allocation Method:
          </div>
          
          <div className="flex gap-sm mb-lg">
            <button
              onClick={() => handleAllocationModeChange('preset')}
              className={`px-md py-xs border-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                allocMode === 'preset' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              Use Preset
            </button>
            <button
              onClick={() => handleAllocationModeChange('custom')}
              className={`px-md py-xs border-2 rounded-md text-sm font-medium cursor-pointer transition-all ${
                allocMode === 'custom' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              Custom Split
            </button>
          </div>

          {/* Allocation inputs */}
          {allocMode === 'custom' && (
            <div className="grid gap-md p-md bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block mb-xs text-sm font-medium text-gray-700">
                  Debt Payoff ($):
                </label>
                <input
                  type="number"
                  value={allocation?.debt || 0}
                  onChange={(e) => handleAllocationChange('debt', parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label className="block mb-xs text-sm font-medium text-gray-700">
                  Savings ($):
                </label>
                <input
                  type="number"
                  value={allocation?.savings || 0}
                  onChange={(e) => handleAllocationChange('savings', parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label className="block mb-xs text-sm font-medium text-gray-700">
                  Investing ($):
                </label>
                <input
                  type="number"
                  value={allocation?.investing || 0}
                  onChange={(e) => handleAllocationChange('investing', parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Validation */}
              <div className={`p-sm rounded-md text-sm ${
                isValidAllocation 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                Total: ${totalAllocation.toLocaleString()}
                {computedExtra && (
                  <>
                    {' '}(Target: ${computedExtra.toLocaleString()})
                    {!isValidAllocation && ' - Amounts must sum to extra contribution'}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Preset allocation display */}
          {allocMode === 'preset' && allocation && (
            <div className="p-md bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-700 mb-xs">
                Preset Allocation:
              </div>
              <div className="grid gap-xs text-sm text-blue-700">
                <div>Debt Payoff: ${allocation.debt.toLocaleString()}</div>
                <div>Savings: ${allocation.savings.toLocaleString()}</div>
                <div>Investing: ${allocation.investing.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
