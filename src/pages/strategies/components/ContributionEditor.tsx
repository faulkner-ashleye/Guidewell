import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { estimateBaselineMonthly, Scope, Strat } from '../../../state/baseline';
import { Account } from '../../../state/AppStateContext';
import { Transaction } from '../../../lib/supabase';

type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder';

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
      case 'debt_crusher':
        return { debt: 70, savings: 20, investing: 10 };
      case 'goal_keeper':
        return { debt: 30, savings: 50, investing: 20 };
      case 'nest_builder':
        return { debt: 20, savings: 30, investing: 50 };
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Input Mode Toggle */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          Input Mode:
        </div>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setInputMode('dollar')}
            style={{
              padding: '8px 16px',
              border: inputMode === 'dollar' ? '2px solid #3b82f6' : '2px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: inputMode === 'dollar' ? '#eff6ff' : 'white',
              color: inputMode === 'dollar' ? '#1d4ed8' : '#374151',
              transition: 'all 0.2s ease'
            }}
          >
            $ Dollar Amount
          </button>
          <button
            onClick={() => setInputMode('percent')}
            style={{
              padding: '8px 16px',
              border: inputMode === 'percent' ? '2px solid #3b82f6' : '2px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: inputMode === 'percent' ? '#eff6ff' : 'white',
              color: inputMode === 'percent' ? '#1d4ed8' : '#374151',
              transition: 'all 0.2s ease'
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
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: baselineMonthly > 0 ? '#f0f9ff' : '#fef2f2',
            border: `1px solid ${baselineMonthly > 0 ? '#bae6fd' : '#fecaca'}`,
            borderRadius: '6px',
            fontSize: '12px',
            color: baselineMonthly > 0 ? '#0369a1' : '#dc2626'
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
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            If left blank, we'll assume the maximum time for the selected timeline.
          </div>
        )}
        
        {/* Suggested range for dollar mode */}
        {computedExtra === undefined && inputMode === 'dollar' && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#0369a1'
          }}>
            Suggested range: ${suggestedLow.toLocaleString()}–${suggestedHigh.toLocaleString()} based on recent inflows
          </div>
        )}
      </div>

      {/* Allocation section - only show if extra is provided */}
      {computedExtra !== undefined && (
        <div>
          <div style={{
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}>
            Allocation Method:
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => handleAllocationModeChange('preset')}
              style={{
                padding: '8px 16px',
                border: allocMode === 'preset' ? '2px solid #3b82f6' : '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: allocMode === 'preset' ? '#eff6ff' : 'white',
                color: allocMode === 'preset' ? '#1d4ed8' : '#374151',
                transition: 'all 0.2s ease'
              }}
            >
              Use Preset
            </button>
            <button
              onClick={() => handleAllocationModeChange('custom')}
              style={{
                padding: '8px 16px',
                border: allocMode === 'custom' ? '2px solid #3b82f6' : '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: allocMode === 'custom' ? '#eff6ff' : 'white',
                color: allocMode === 'custom' ? '#1d4ed8' : '#374151',
                transition: 'all 0.2s ease'
              }}
            >
              Custom Split
            </button>
          </div>

          {/* Allocation inputs */}
          {allocMode === 'custom' && (
            <div style={{
              display: 'grid',
              gap: '16px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
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
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
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
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
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
              <div style={{
                padding: '12px',
                background: isValidAllocation ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isValidAllocation ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: '6px',
                fontSize: '14px',
                color: isValidAllocation ? '#166534' : '#dc2626'
              }}>
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
            <div style={{
              padding: '16px',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#0369a1',
                marginBottom: '8px'
              }}>
                Preset Allocation:
              </div>
              <div style={{ display: 'grid', gap: '4px', fontSize: '14px', color: '#0369a1' }}>
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
