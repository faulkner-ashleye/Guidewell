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
      <div className="custom-strategy-page">
        <AppHeader 
          title="Custom Strategy"
          leftAction={
            <button
              onClick={handleBack}
              className="back-button"
            >
              ←
            </button>
          }
        />
        
        <div className="no-strategy-container">
          <h2 className="no-strategy-title">
            No Strategy Found
          </h2>
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

  return (
    <div className="custom-strategy-page">
      <AppHeader 
        title="Custom Strategy"
        leftAction={
          <button
            onClick={handleBack}
            className="back-button"
          >
            ←
          </button>
        }
      />

      <div className="custom-strategy-content">
        {/* Chart Placeholder */}
        <ChartPlaceholder 
          data={{ strategy, timeframe, extra }}
          className="chart-placeholder"
        />

        {/* Narrative Card */}
        <NarrativeCard
          title={strategy === 'debt_crusher' ? 'Debt Crusher' : 
                strategy === 'goal_keeper' ? 'Goal Keeper' : 'Nest Builder'}
          narrative={generateNarrative()}
          onViewBreakdown={handleViewBreakdown}
          className="narrative-card"
        />

        {/* Edit Parameters Accordion */}
        <div className="edit-parameters">
          <h3 className="edit-parameters-title">
            Edit Parameters
          </h3>

          {/* Strategy Selection */}
          <div className="parameter-section">
            <h4 className="parameter-section-title">
              Strategy
            </h4>
            <StrategyCardSelect
              selected={strategy}
              onSelect={setStrategy}
            />
          </div>

          {/* Timeline Selection */}
          <div className="parameter-section">
            <h4 className="parameter-section-title">
              Timeline
            </h4>
            <TimelineChips
              selected={timeframe}
              onSelect={setTimeframe}
            />
          </div>

          {/* Contribution Editor */}
          <div className="parameter-section">
            <h4 className="parameter-section-title">
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
          <div className="run-again-container">
            <button
              onClick={handleRunAgain}
              className="run-again-button"
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
        <div className="custom-strategy-footer">
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
