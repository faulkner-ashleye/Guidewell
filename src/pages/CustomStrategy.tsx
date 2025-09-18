import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../app/components/AppHeader';
import { useAppState } from '../state/AppStateContext';
import { ChartPlaceholder } from './strategies/components/ChartPlaceholder';
import { NarrativeCard } from './strategies/components/NarrativeCard';
import { StrategyCardSelect } from './strategies/components/StrategyCardSelect';
import { TimelineChips } from './strategies/components/TimelineChips';
import { ContributionEditor } from './strategies/components/ContributionEditor';
import { BreakdownModal } from '../app/strategies/components/BreakdownModal';
import './CustomStrategy.css';

type Scope = 'all' | 'debts' | 'savings' | 'investing';
type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder';
type Timeframe = 'short' | 'mid' | 'long';

export function CustomStrategy() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get app state
  const { accounts = [], transactions = [], goals = [] } = useAppState();
  
  // State management
  const [scope, setScope] = useState<Scope>('all');
  const [strategy, setStrategy] = useState<Strategy>('debt_crusher');
  const [timeframe, setTimeframe] = useState<Timeframe>('mid');
  const [extra, setExtra] = useState<number | undefined>(undefined);
  const [allocMode, setAllocMode] = useState<'preset' | 'custom'>('preset');
  const [allocation, setAllocation] = useState<{debt: number; savings: number; investing: number} | undefined>(undefined);
  
  // Modal state
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  
  // Derived values
  const maxMonths = timeframe === 'short' ? 12 : timeframe === 'mid' ? 60 : 120;
  
  // Calculate goals monthly contribution
  const goalsMonthly = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0);
  
  // Initialize from query params or state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const state = location.state;
    
    if (state) {
      // Initialize from state passed from build strategy
      setScope(state.scope || 'all');
      setStrategy(state.strategy || 'debt_crusher');
      setTimeframe(state.timeframe || 'mid');
      setExtra(state.extra);
      setAllocation(state.allocation);
    } else if (searchParams.get('scope')) {
      // Initialize from query params
      setScope(searchParams.get('scope') as Scope || 'all');
      setStrategy(searchParams.get('strategy') as Strategy || 'debt_crusher');
      setTimeframe(searchParams.get('timeframe') as Timeframe || 'mid');
      const extraParam = searchParams.get('extra');
      setExtra(extraParam ? parseFloat(extraParam) : undefined);
    }
  }, [location]);

  const handleBack = () => {
    navigate('/strategies');
  };

  const handleRunAgain = () => {
    // Re-compute scenario (for now, just scroll to top)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewBreakdown = () => {
    setBreakdownOpen(true);
  };

  // Generate narrative based on current selections
  const generateNarrative = () => {
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

    const maxTimeText = {
      short: '12 months',
      mid: '5 years', 
      long: '10 years'
    };

    const scopeText = scope === 'all' ? 'all accounts' : scope;

    let narrative = `This ${strategyNames[strategy]} scenario focuses on ${scopeText} over ${timeframeText[timeframe]}. `;
    
    if (extra === undefined) {
      narrative += `Since no extra contribution was specified, we'll assume the maximum timeline of ${maxTimeText[timeframe]} for this educational scenario. `;
    } else {
      narrative += `With a monthly extra contribution of $${extra.toLocaleString()}, this strategy can help accelerate your progress. `;
    }

    // Add strategy-specific details
    switch (strategy) {
      case 'debt_crusher':
        narrative += `This approach prioritizes paying down high-interest debt while maintaining minimum payments elsewhere.`;
        break;
      case 'goal_keeper':
        narrative += `This balanced approach focuses on building savings goals while managing debt responsibly.`;
        break;
      case 'nest_builder':
        narrative += `This long-term strategy emphasizes wealth building through investments while maintaining financial stability.`;
        break;
    }

    return narrative;
  };

  // Check if we have valid data to show
  const hasValidData = scope && strategy && timeframe;

  if (!hasValidData) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
        <AppHeader 
          title="Custom Strategy"
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
        
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '600' }}>
            No Strategy Found
          </h2>
          <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '16px' }}>
            No strategy data was found. Please build a strategy first.
          </p>
          <button
            onClick={() => navigate('/build-strategy')}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Build Strategy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <AppHeader 
        title="Custom Strategy"
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
        {/* Chart Placeholder */}
        <ChartPlaceholder 
          data={{ strategy, timeframe, extra }}
          style={{ marginBottom: '24px' }}
        />

        {/* Narrative Card */}
        <NarrativeCard
          title={strategy === 'debt_crusher' ? 'Debt Crusher' : 
                strategy === 'goal_keeper' ? 'Goal Keeper' : 'Nest Builder'}
          narrative={generateNarrative()}
          onViewBreakdown={handleViewBreakdown}
          style={{ marginBottom: '24px' }}
        />

        {/* Edit Parameters Accordion */}
        <div className="edit-parameters">
          <h3 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#111827'
          }}>
            Edit Parameters
          </h3>

          {/* Strategy Selection */}
          <div className="parameter-section">
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Strategy
            </h4>
            <StrategyCardSelect
              selected={strategy}
              onSelect={setStrategy}
            />
          </div>

          {/* Timeline Selection */}
          <div className="parameter-section">
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Timeline
            </h4>
            <TimelineChips
              selected={timeframe}
              onSelect={setTimeframe}
            />
          </div>

          {/* Contribution Editor */}
          <div className="parameter-section">
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Contribution
            </h4>
            <ContributionEditor
              extra={extra}
              allocMode={allocMode}
              allocation={allocation}
              strategy={strategy}
              scope={scope}
              accounts={accounts}
              transactions={transactions}
              goalsMonthly={goalsMonthly}
              onExtraChange={setExtra}
              onAllocModeChange={setAllocMode}
              onAllocationChange={setAllocation}
            />
          </div>

          {/* Run Again Button */}
          <div style={{ marginTop: '32px' }}>
            <button
              onClick={handleRunAgain}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Run Again
            </button>
          </div>
        </div>

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

      {/* Breakdown Modal */}
      <BreakdownModal
        open={breakdownOpen}
        onClose={() => setBreakdownOpen(false)}
        scope={scope}
        strategy={strategy}
        timeframe={timeframe}
        extraDollars={extra}
        allocation={allocation}
        accounts={accounts}
        goals={goals}
        transactions={transactions}
        assumedAnnualReturn={0.06}
      />
    </div>
  );
}
