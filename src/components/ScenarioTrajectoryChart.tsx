import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { Card } from './Card';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Icon, IconNames } from './Icon';
import { Chip } from './ChipGroup';
import {
  monthsFor,
  futureValueMonthly,
  monthsToReach,
  formatCurrency,
  humanizeMonths
} from '../strategy/tradeoffMath';
import { Account } from '../state/AppStateContext';
import { Goal } from '../app/types';
import './ScenarioTrajectoryChart.css';

type Scope = 'all' | 'debts' | 'savings' | 'investing';
type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';
type Timeframe = '1yr' | '2yr' | '3yr' | '5yr' | '10yr' | 'custom';

interface ScenarioTrajectoryChartProps {
  accounts: Account[];
  goals: Goal[];
  strategy: Strategy;
  timeframe: Timeframe;
  scope: Scope;
  extraMonthly?: number;
  allocation?: { debt: number; savings: number; investing: number };
  onTimelineChange?: (timeframe: Timeframe | number) => void;
  onExtraMonthlyChange?: (amount: number) => void;
  showTimelineControls?: boolean;
  className?: string;
}

interface ChartDataPoint {
  month: number;
  checking: number;
  savings: number;
  investments: number;
  totalAssets: number;
  debts: number;
  netWorth: number;
  netWorthWithExtra: number;
  milestone?: string;
  milestoneDate?: string;
  actualDate?: string;
  displayDate?: string;
}

interface KPIData {
  monthlyTarget: number;
  goalDate: string;
  percentToGoal: number;
  timelineMonths: number;
  goalAmount: number;
  currentSavings: number;
}

const TIMELINE_PRESETS = [
  { id: '1yr' as Timeframe, label: '1YR', months: 12 },
  { id: '2yr' as Timeframe, label: '2YR', months: 24 },
  { id: '3yr' as Timeframe, label: '3YR', months: 36 },
  { id: '5yr' as Timeframe, label: '5YR', months: 60 },
  { id: '10yr' as Timeframe, label: '10YR', months: 120 },
  { id: 'custom' as Timeframe, label: 'Custom', months: 24 }
];

export function ScenarioTrajectoryChart({
  accounts,
  goals,
  strategy,
  timeframe,
  scope,
  extraMonthly = 0,
  allocation,
  onTimelineChange,
  onExtraMonthlyChange,
  showTimelineControls = true,
  className
}: ScenarioTrajectoryChartProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<Timeframe>(timeframe);
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    // Default to 2 years from now
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    return futureDate.toISOString().split('T')[0];
  });
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);

  // Calculate current financial state
  const currentState = useMemo(() => {
    const checking = accounts.filter(a => a.type === 'checking').reduce((sum, a) => sum + a.balance, 0);
    const savings = accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0);
    const investments = accounts.filter(a => a.type === 'investment').reduce((sum, a) => sum + a.balance, 0);
    const debts = accounts.filter(a => a.type === 'credit_card' || a.type === 'loan').reduce((sum, a) => sum + Math.abs(a.balance), 0);

    return {
      checking,
      savings,
      investments,
      totalAssets: checking + savings + investments,
      debts,
      netWorth: checking + savings + investments - debts
    };
  }, [accounts]);

  // Get main goal
  const mainGoal = useMemo(() => {
    return goals.find(g => g.priority === 'high') || goals[0] || {
      target: 10000,
      targetDate: '2029-12-31'
    };
  }, [goals]);

  // Calculate timeline months based on selected timeframe
  const timelineMonths = useMemo(() => {
    if (selectedTimeline === 'custom') {
      const startDate = new Date();
      const endDate = new Date(customEndDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
      return Math.max(1, diffMonths); // Ensure at least 1 month
    }
    const preset = TIMELINE_PRESETS.find(p => p.id === selectedTimeline);
    return preset?.months || 24;
  }, [selectedTimeline, customEndDate]);

  // Helper function for use in other places (like the preview)
  const getMonthsForTimeframe = (timeframe: Timeframe): number => {
    if (timeframe === 'custom') {
      const startDate = new Date();
      const endDate = new Date(customEndDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
      return Math.max(1, diffMonths); // Ensure at least 1 month
    }
    const preset = TIMELINE_PRESETS.find(p => p.id === timeframe);
    return preset?.months || 24;
  };

  // Calculate KPIs
  const kpis = useMemo((): KPIData => {
    const goalAmount = mainGoal.target;
    const currentSavings = currentState.savings;
    const remaining = Math.max(0, goalAmount - currentSavings);
    const monthlyTarget = remaining > 0 ? remaining / timelineMonths : 0;
    const percentToGoal = (currentSavings / goalAmount) * 100;

    // Calculate goal date
    const targetDate = new Date(mainGoal.targetDate || '2029-12-31');
    const goalDate = targetDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });

    return {
      monthlyTarget,
      goalDate,
      percentToGoal: Math.min(percentToGoal, 100),
      timelineMonths,
      goalAmount,
      currentSavings
    };
  }, [mainGoal, currentState.savings, timelineMonths]);

  // Generate chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const monthlyReturn = 0.06 / 12; // 6% annual return

    // Use avatar-specific allocations or fallback to default
    const avatarAllocation = allocation || { debt: 30, savings: 50, investing: 20 };

    // Calculate start date for the timeline
    const startDate = new Date();
    if (selectedTimeline === 'custom') {
      // For custom timeline, work backwards from the end date
      const endDate = new Date(customEndDate);
      startDate.setTime(endDate.getTime() - (timelineMonths * 30.44 * 24 * 60 * 60 * 1000));
    }

    for (let month = 0; month <= timelineMonths; month++) {
      // Base contributions
      const baseMonthly = 0; // No default contribution - use actual user data
      const totalMonthly = baseMonthly + extraMonthly;

      // Calculate accumulated amounts with compound growth using avatar allocations
      const checkingGrowth = currentState.checking * Math.pow(1 + monthlyReturn * 0.1, month); // Low growth for checking
      const savingsGrowth = (currentState.savings + (totalMonthly * (avatarAllocation.savings / 100) * month)) * Math.pow(1 + monthlyReturn * 0.3, month);
      const investmentsGrowth = (currentState.investments + (totalMonthly * (avatarAllocation.investing / 100) * month)) * Math.pow(1 + monthlyReturn, month);

      // Debt reduction using avatar allocation
      const debtReduction = Math.max(0, currentState.debts - (totalMonthly * (avatarAllocation.debt / 100) * month));

      const totalAssets = checkingGrowth + savingsGrowth + investmentsGrowth;
      const netWorth = totalAssets - debtReduction;
      const netWorthWithExtra = netWorth + (extraMonthly * month * 0.1); // Extra contribution effect

      // Check for milestones
      let milestone: string | undefined;
      let milestoneDate: string | undefined;

      if (netWorth >= mainGoal.target && !data.find(d => d.milestone)) {
        milestone = 'Goal Reached';
        milestoneDate = new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
      }

      // Calculate the actual date for this month
      const currentDate = new Date(startDate);
      currentDate.setMonth(currentDate.getMonth() + month);

      data.push({
        month,
        checking: checkingGrowth,
        savings: savingsGrowth,
        investments: investmentsGrowth,
        totalAssets,
        debts: debtReduction,
        netWorth,
        netWorthWithExtra,
        milestone,
        milestoneDate,
        actualDate: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
        displayDate: currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      });
    }

    return data;
  }, [currentState, timelineMonths, extraMonthly, mainGoal.target, allocation, selectedTimeline, customEndDate]);

  // Handle timeline changes
  const handleTimelineChange = (timeline: typeof TIMELINE_PRESETS[0]) => {
    setSelectedTimeline(timeline.id);
    if (timeline.id === 'custom') {
      setIsEditingTimeline(true);
    } else {
      onTimelineChange?.(timeline.id);
    }
  };

  const handleCustomTimelineSave = () => {
    const months = getMonthsForTimeframe('custom');
    onTimelineChange?.(months);
    setIsEditingTimeline(false);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="scenario-tooltip">
          <div className="tooltip-header">
            {data.displayDate || `Month ${data.month}`}
          </div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">Checking:</span>
              <span className="tooltip-value">{formatCurrency(data.checking)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Savings:</span>
              <span className="tooltip-value">{formatCurrency(data.savings)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Investments:</span>
              <span className="tooltip-value">{formatCurrency(data.investments)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Debts:</span>
              <span className="tooltip-value debt">{formatCurrency(data.debts)}</span>
            </div>
            <div className="tooltip-row net-worth">
              <span className="tooltip-label">Net Worth:</span>
              <span className="tooltip-value">{formatCurrency(data.netWorth)}</span>
            </div>
            {data.milestone && (
              <div className="tooltip-milestone">
                🎯 {data.milestone} ({data.milestoneDate})
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`scenario-trajectory-container ${className || ''}`}>
      {/* Header - Outside the card */}
      <div className="scenario-header">
        <div className="scenario-title">
          <h1 className="typography-h1">Scenario Trajectory</h1>
        </div>
      </div>

      <Card className="scenario-trajectory-chart">
        {/* Timeline Controls */}
        {showTimelineControls && (
          <div className="timeline-controls">
            <div className="timeline-chips">
              {TIMELINE_PRESETS.slice(0, 5).map(preset => (
                <Chip
                  key={preset.id}
                  label={preset.label}
                  selected={selectedTimeline === preset.id}
                  onClick={() => handleTimelineChange(preset)}
                />
              ))}
            </div>
            <Button
              variant={ButtonVariants.text}
              size="small"
              onClick={() => handleTimelineChange(TIMELINE_PRESETS[5])} // Custom option
              aria-label="Custom timeline"
              className="custom-timeline-button"
            >
              <Icon name={IconNames.calendar_today} size="sm" />
            </Button>
          </div>
        )}

        {/* Chart Area */}
        <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="displayDate"
              stroke="var(--color-text-muted)"
              interval={Math.ceil(timelineMonths / 8)}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference line for goal */}
            <ReferenceLine
              y={mainGoal.target}
              stroke="var(--color-success-main)"
              strokeDasharray="5 5"
            />

            {/* Stacked areas for assets */}
            <Area
              type="monotone"
              dataKey="checking"
              stackId="assets"
              fill="var(--color-secondary-subtle)"
              stroke="var(--color-secondary-main)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stackId="assets"
              fill="var(--color-savings)"
              stroke="var(--color-success-main)"
              strokeWidth={2}
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="investments"
              stackId="assets"
              fill="var(--color-investing)"
              stroke="var(--color-info-main)"
              strokeWidth={2}
              fillOpacity={0.3}
            />

            {/* Debt area (negative) */}
            <Area
              type="monotone"
              dataKey="debts"
              stackId="debts"
              fill="var(--color-debt)"
              stroke="var(--color-error-main)"
              strokeWidth={2}
              fillOpacity={0.3}
            />

            {/* Net worth line */}
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="var(--color-text-primary)"
              strokeWidth={3}
              dot={false}
            />

            {/* Extra scenario line */}
            {extraMonthly > 0 && (
              <Line
                type="monotone"
                dataKey="netWorthWithExtra"
                stroke="var(--color-warning-main)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}

            {/* Milestone markers */}
            {chartData.map((point, index) =>
              point.milestone ? (
                <ReferenceDot
                  key={index}
                  x={point.month}
                  y={point.netWorth}
                  r={6}
                  fill="var(--color-success-main)"
                  stroke="white"
                  strokeWidth={2}
                />
              ) : null
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Extra Monthly Control */}
      {showTimelineControls && (
        <div className="extra-monthly-control">
          <div className="extra-labels">
            <label className="control-label">Extra Monthly</label>
            <span className="slider-value">{formatCurrency(extraMonthly)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={extraMonthly}
            onChange={(e) => onExtraMonthlyChange?.(parseInt(e.target.value))}
            className="extra-slider"
          />
        </div>
      )}

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-section">
          <h5>Assets</h5>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--color-secondary-main)' }} />
              <span>Checking</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--color-savings)' }} />
              <span>Savings</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--color-investing)' }} />
              <span>Investments</span>
            </div>
          </div>
        </div>

        <div className="legend-section">
          <h5>Other</h5>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--color-debt)' }} />
              <span>Debts</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--color-text-primary)' }} />
              <span>Net Worth</span>
            </div>
            {extraMonthly > 0 && (
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'var(--color-warning-main)', borderStyle: 'dashed' }} />
                <span>Extra ${extraMonthly}/mo</span>
              </div>
            )}
          </div>
        </div>

        <div className="legend-section x-axis-label">
          <div className="x-axis-legend">
            X-Axis defined in months
          </div>
        </div>
      </div>


      {/* Custom Timeline Modal */}
      {isEditingTimeline && (
        <div className="custom-timeline-modal">
          <div className="modal-backdrop" onClick={() => setIsEditingTimeline(false)} />
          <div className="modal-content">
            <h4>Custom Timeline</h4>
            <div className="timeline-input-group">
              <label>Target Date:</label>
              <input
                type="date"
                value={customEndDate}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 30 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 30 years from now
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
              <div className="timeline-preview">
                {(() => {
                  const months = timelineMonths;
                  const years = Math.floor(months / 12);
                  const remainingMonths = months % 12;
                  if (years > 0 && remainingMonths > 0) {
                    return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
                  } else if (years > 0) {
                    return `${years} year${years > 1 ? 's' : ''}`;
                  } else {
                    return `${months} month${months > 1 ? 's' : ''}`;
                  }
                })()}
              </div>
            </div>
            <div className="modal-actions">
              <Button
                variant={ButtonVariants.text}
                color={ButtonColors.secondary}
                onClick={() => setIsEditingTimeline(false)}
              >
                Cancel
              </Button>
              <Button
                variant={ButtonVariants.contained}
                color={ButtonColors.secondary}
                onClick={handleCustomTimelineSave}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      </Card>
    </div>
  );
}
