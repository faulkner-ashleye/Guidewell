import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../app/components/AppHeader';
import { QuestionBlock } from '../components/QuestionBlock';
import { ChipGroup, Chip } from '../components/ChipGroup';
import { CardSelect, SelectCard } from '../components/CardSelect';
import { ContributionEditor } from './strategies/components/ContributionEditor';
import { useAppState } from '../state/AppStateContext';
import './BuildStrategy.css';

type ScopeType = 'all' | 'debts' | 'savings' | 'investing';
type StrategyType = 'debt_crusher' | 'goal_keeper' | 'nest_builder';
type TimeframeType = 'short' | 'mid' | 'long';
type AllocationMode = 'preset' | 'custom';

export function BuildStrategy() {
  const navigate = useNavigate();
  
  // Get app state
  const { accounts = [], transactions = [], goals = [] } = useAppState();
  
  // State management
  const [scope, setScope] = useState<ScopeType>();
  const [scopeSelection, setScopeSelection] = useState<'all' | 'one'>(); // New: all vs one selection
  const [accountId, setAccountId] = useState<string>();
  const [strategy, setStrategy] = useState<StrategyType>();
  const [timeframe, setTimeframe] = useState<TimeframeType>();
  const [extra, setExtra] = useState<number>();
  const [allocMode, setAllocMode] = useState<AllocationMode>('preset');
  const [alloc, setAlloc] = useState<{debt: number; savings: number; investing: number}>();
  
  // Calculate goals monthly contribution
  const goalsMonthly = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);
  
  // Animation state
  const [animateStep, setAnimateStep] = useState<number>(1);

  // Mock accounts for dropdown
  const mockAccounts = {
    debts: [
      { id: 'debt1', name: 'Credit Card #1', balance: 2500 },
      { id: 'debt2', name: 'Student Loan', balance: 15000 },
      { id: 'debt3', name: 'Car Loan', balance: 8000 }
    ],
    savings: [
      { id: 'sav1', name: 'Emergency Fund', balance: 5000 },
      { id: 'sav2', name: 'Vacation Fund', balance: 1200 },
      { id: 'sav3', name: 'Wedding Fund', balance: 3000 }
    ],
    investing: [
      { id: 'inv1', name: '401(k)', balance: 25000 },
      { id: 'inv2', name: 'Roth IRA', balance: 8000 },
      { id: 'inv3', name: 'Brokerage Account', balance: 5000 }
    ]
  };

  const handleBack = () => {
    navigate('/strategies');
  };

  const handleScopeSelect = (selectedScope: ScopeType) => {
    setScope(selectedScope);
    setScopeSelection(undefined); // Reset secondary selection
    setAccountId(undefined); // Reset account selection
    
    if (selectedScope === 'all') {
      // If "All accounts" is selected, we can proceed immediately
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleScopeSelectionSelect = (selection: 'all' | 'one') => {
    setScopeSelection(selection);
    setAccountId(undefined); // Reset account selection
    
    if (selection === 'all') {
      // If "all" is selected for the specific scope, we can proceed
      setTimeout(() => setAnimateStep(2), 300);
    }
  };

  const handleAccountSelect = (selectedAccountId: string) => {
    setAccountId(selectedAccountId);
    // Once an account is selected, we can proceed to the next step
    setTimeout(() => setAnimateStep(2), 300);
  };

  const handleStrategySelect = (selectedStrategy: StrategyType) => {
    setStrategy(selectedStrategy);
    
    // Set preset allocation based on strategy
    switch (selectedStrategy) {
      case 'debt_crusher':
        setAlloc({ debt: 70, savings: 20, investing: 10 });
        break;
      case 'goal_keeper':
        setAlloc({ debt: 30, savings: 50, investing: 20 });
        break;
      case 'nest_builder':
        setAlloc({ debt: 20, savings: 30, investing: 50 });
        break;
    }
    // Trigger animation for next step
    setTimeout(() => setAnimateStep(3), 300);
  };

  const handleTimeframeSelect = (selectedTimeframe: TimeframeType) => {
    setTimeframe(selectedTimeframe);
    // Trigger animation for next step
    setTimeout(() => setAnimateStep(4), 300);
  };


  const handleAllocationModeChange = (mode: AllocationMode) => {
    setAllocMode(mode);
  };

  const handleAllocationChange = (type: 'debt' | 'savings' | 'investing', value: number) => {
    if (!alloc) return;
    
    const newAlloc = { ...alloc, [type]: value };
    setAlloc(newAlloc);
  };


  const handleViewBreakdown = () => {
    console.log('Build Strategy button clicked!', { scope, strategy, timeframe, extra, alloc });
    // Navigate to custom strategy page with current data
    navigate('/custom-strategy', {
      state: {
        scope,
        strategy,
        timeframe,
        extra,
        allocation: alloc
      }
    });
  };


  // Check if each step is completed
  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1: return scope !== undefined && (scope === 'all' || scopeSelection === 'all' || !!accountId);
      case 2: return strategy !== undefined;
      case 3: return timeframe !== undefined;
      case 4: return true; // Extra contribution is optional, always considered "completed"
      default: return false;
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <AppHeader 
        title="Build Your Strategy"
        leftAction={
          <button
            onClick={handleBack}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '24px', 
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            ←
          </button>
        }
      />

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Step 1: Scope Selection */}
        <div 
          className={`strategy-step ${animateStep >= 1 ? 'animate-in' : 'animate-out'}`}
          style={{
            transform: animateStep >= 1 ? 'translateX(0)' : 'translateX(100%)',
            opacity: animateStep >= 1 ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
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
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                marginBottom: '12px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151'
              }}>
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
            <div style={{ marginTop: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Select Account:
              </label>
              <select
                value={accountId || ''}
                onChange={(e) => handleAccountSelect(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Choose an account...</option>
                {scope && mockAccounts[scope]?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} (${account.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}
          </QuestionBlock>
        </div>

        {/* Step 2: Strategy Selection */}
        {scope && (scope === 'all' || scopeSelection === 'all' || accountId) && (
          <div 
            className={`strategy-step ${animateStep >= 2 ? 'animate-in' : 'animate-out'}`}
            style={{
              transform: animateStep >= 2 ? 'translateX(0)' : 'translateX(100%)',
              opacity: animateStep >= 2 ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <QuestionBlock
              title="Step 2: Choose Your Strategy"
              description="Select a strategy that aligns with your goals"
              completed={isStepCompleted(2)}
              locked={isStepCompleted(2)}
            >
            <CardSelect>
              <SelectCard
                title="Debt Crusher"
                description="Aggressively pay down debt while maintaining minimal savings"
                selected={strategy === 'debt_crusher'}
                onClick={() => handleStrategySelect('debt_crusher')}
                icon="💪"
              />
              <SelectCard
                title="Goal Keeper"
                description="Balanced approach focusing on savings goals and debt management"
                selected={strategy === 'goal_keeper'}
                onClick={() => handleStrategySelect('goal_keeper')}
                icon="🎯"
              />
              <SelectCard
                title="Nest Builder"
                description="Long-term wealth building with emphasis on investments"
                selected={strategy === 'nest_builder'}
                onClick={() => handleStrategySelect('nest_builder')}
                icon="🏗️"
              />
            </CardSelect>
            </QuestionBlock>
          </div>
        )}

        {/* Step 3: Timeframe Selection */}
        {strategy && (
          <div 
            className={`strategy-step ${animateStep >= 3 ? 'animate-in' : 'animate-out'}`}
            style={{
              transform: animateStep >= 3 ? 'translateX(0)' : 'translateX(100%)',
              opacity: animateStep >= 3 ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <QuestionBlock
              title="Step 3: Set Your Timeline"
              description="How long do you want to follow this strategy?"
              completed={isStepCompleted(3)}
              locked={isStepCompleted(3)}
            >
            <ChipGroup>
              <Chip 
                label="Short (6-12 months)" 
                selected={timeframe === 'short'} 
                onClick={() => handleTimeframeSelect('short')}
              />
              <Chip 
                label="Mid (1-3 years)" 
                selected={timeframe === 'mid'} 
                onClick={() => handleTimeframeSelect('mid')}
              />
              <Chip 
                label="Long (3+ years)" 
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
            className={`strategy-step ${animateStep >= 4 ? 'animate-in' : 'animate-out'}`}
            style={{
              transform: animateStep >= 4 ? 'translateX(0)' : 'translateX(100%)',
              opacity: animateStep >= 4 ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <QuestionBlock
              title="Step 4: Extra Contribution (Optional)"
              description="How much extra can you contribute monthly? Leave blank if you don't want to specify."
              completed={isStepCompleted(4)}
              locked={false}
            >
            <ContributionEditor
              extra={extra}
              allocMode={allocMode}
              allocation={alloc}
              strategy={strategy || 'debt_crusher'}
              scope={scope || 'all'}
              accounts={accounts}
              transactions={transactions}
              goalsMonthly={goalsMonthly}
              onExtraChange={setExtra}
              onAllocModeChange={setAllocMode}
              onAllocationChange={setAlloc}
            />
            
            {/* Debug Info */}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f3f4f6', 
              borderRadius: '8px',
              fontSize: '12px',
              color: '#374151'
            }}>
              <strong>Debug Info:</strong><br/>
              Scope: {scope || 'undefined'}<br/>
              Strategy: {strategy || 'undefined'}<br/>
              Timeframe: {timeframe || 'undefined'}<br/>
              Extra: {extra || 'undefined'}<br/>
              Button disabled: {(!scope || !strategy || !timeframe).toString()}
            </div>

            {/* Build Strategy Button */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                onClick={(e) => {
                  console.log('Button clicked!', e);
                  console.log('Current state:', { scope, strategy, timeframe, extra, alloc });
                  handleViewBreakdown();
                }}
                disabled={!scope || !strategy || !timeframe}
                style={{
                  padding: '16px 32px',
                  background: (!scope || !strategy || !timeframe) ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (!scope || !strategy || !timeframe) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: (!scope || !strategy || !timeframe) ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!(!scope || !strategy || !timeframe)) {
                    e.currentTarget.style.background = '#059669';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!scope || !strategy || !timeframe)) {
                    e.currentTarget.style.background = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                Build Strategy
              </button>
            </div>
            </QuestionBlock>
          </div>
        )}


        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          color: '#999', 
          fontSize: '12px',
          marginTop: '40px',
          padding: '20px 0'
        }}>
          Educational scenarios only — not financial advice.
        </div>
      </div>
    </div>
  );
}
