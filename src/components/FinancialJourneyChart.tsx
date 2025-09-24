import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card } from './Card';
import { Icon, IconNames } from './Icon';
import { Account } from '../state/AppStateContext';
import { Goal } from '../app/types';
import { sumByType } from '../state/selectors';
import './FinancialJourneyChart.css';

interface FinancialJourneyChartProps {
  accounts: Account[];
  goals: Goal[];
  userProfile?: {
    timeline?: string;
    topPriority?: string;
  } | null;
  className?: string;
}

interface TimelineConfig {
  id: 'short' | 'mid' | 'long' | 'custom';
  label: string;
  months: number;
  color: string;
}

interface ChartDataPoint {
  month: number;
  monthLabel: string;
  assets: number;
  debts: number;
  netWorth: number;
  goalProgress: number;
}

interface KPIData {
  monthlyNeeded: number;
  timeToGoal: string;
  goalProgressPercent: number;
  targetDate: string;
}

const TIMELINE_PRESETS: TimelineConfig[] = [
  { id: 'short', label: '1-2 years', months: 18, color: '#10b981' },
  { id: 'mid', label: '3-5 years', months: 36, color: '#3b82f6' },
  { id: 'long', label: '5+ years', months: 60, color: '#8b5cf6' },
  { id: 'custom', label: 'Custom', months: 24, color: '#6b7280' }
];

export function FinancialJourneyChart({
  accounts,
  goals,
  userProfile,
  className
}: FinancialJourneyChartProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineConfig>(
    TIMELINE_PRESETS.find(p => p.id === userProfile?.timeline as 'short' | 'mid' | 'long') || TIMELINE_PRESETS[1]
  );
  const [customMonths, setCustomMonths] = useState<number>(24);
  const [customDate, setCustomDate] = useState<string>('');
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isEditingTimeline) {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.add('modal-open');
      }
    } else {
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('modal-open');
      }
    }

    return () => {
      // Cleanup: re-enable scrolling when component unmounts
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('modal-open');
      }
    };
  }, [isEditingTimeline]);

  // Calculate current financial position
  const currentAssets = sumByType(accounts, ['checking', 'savings', 'investment']);
  const currentDebts = sumByType(accounts, ['credit_card', 'loan']);
  const currentNetWorth = currentAssets - currentDebts;

  // Get primary goal
  const primaryGoal = goals.find(g => g.id === userProfile?.topPriority) || goals[0];
  const goalTarget = primaryGoal?.target || 10000;
  const goalCurrent = 0; // Goals don't track current amount in this interface

  // Calculate timeline months
  const timelineMonths = selectedTimeline.id === 'custom'
    ? (customDate ? Math.ceil((new Date(customDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)) : customMonths)
    : selectedTimeline.months;

  // Generate chart data
  const chartData: ChartDataPoint[] = useMemo(() => {
    const data: ChartDataPoint[] = [];
    const monthlyContribution = 500; // Default monthly contribution
    const assetGrowthRate = 0.004; // 0.4% monthly growth for assets
    const debtPayoffRate = 0.02; // 2% monthly debt reduction

    for (let month = 0; month <= timelineMonths; month++) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() + month);

      // Calculate projected values
      const projectedAssets = currentAssets + (monthlyContribution * month * 0.6) + (currentAssets * assetGrowthRate * month);
      const projectedDebts = Math.max(0, currentDebts - (currentDebts * debtPayoffRate * month));
      const projectedNetWorth = projectedAssets - projectedDebts;

      // Calculate goal progress
      const goalProgress = Math.min(goalCurrent + (monthlyContribution * month * 0.4), goalTarget);

      data.push({
        month,
        monthLabel: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        assets: Math.round(projectedAssets),
        debts: Math.round(projectedDebts),
        netWorth: Math.round(projectedNetWorth),
        goalProgress: Math.round(goalProgress)
      });
    }

    return data;
  }, [currentAssets, currentDebts, timelineMonths, goalCurrent, goalTarget]);

  // Calculate KPIs
  const kpis: KPIData = useMemo(() => {
    const monthlyNeeded = Math.ceil((goalTarget - goalCurrent) / timelineMonths);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + timelineMonths);
    const goalProgressPercent = Math.round((goalCurrent / goalTarget) * 100);

    return {
      monthlyNeeded,
      timeToGoal: `${timelineMonths} months`,
      goalProgressPercent,
      targetDate: targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
  }, [goalTarget, goalCurrent, timelineMonths]);

  const handleTimelineChange = (timeline: TimelineConfig) => {
    setSelectedTimeline(timeline);
    if (timeline.id === 'custom') {
      setIsEditingTimeline(true);
    } else {
      setIsEditingTimeline(false);
    }
  };

  const handleCustomMonthsChange = (months: number) => {
    setCustomMonths(months);
    setSelectedTimeline({ ...TIMELINE_PRESETS[3], months });
  };

  const handleCustomDateChange = (date: string) => {
    setCustomDate(date);
    if (date) {
      const months = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
      setSelectedTimeline({ ...TIMELINE_PRESETS[3], months });
    }
  };

  return (
    <Card className={`financial-journey-chart ${className || ''}`}>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} />
            <XAxis
              dataKey="monthLabel"
              tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              hide
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '320px',
                minWidth: '280px',
                padding: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-base)'
              }}
              formatter={(value: number, name) => [
                `$${Math.round(value).toLocaleString()}`,
                name === 'assets' ? 'Assets' :
                name === 'debts' ? 'Debts' :
                name === 'netWorth' ? 'Net Worth' : 'Goal Progress'
              ]}
            />

            {/* Assets Area */}
            <Area
              type="monotone"
              dataKey="assets"
              fill="var(--color-success)"
              fillOpacity={0.3}
              stroke="var(--color-success)"
              strokeWidth={2}
            />

            {/* Debts Area (negative) */}
            <Area
              type="monotone"
              dataKey="debts"
              fill="var(--color-error)"
              fillOpacity={0.2}
              stroke="var(--color-error)"
              strokeWidth={2}
            />

            {/* Net Worth Line */}
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="var(--color-secondary-light)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: 'var(--color-secondary-light)', strokeWidth: 2 }}
            />

            {/* Goal Progress Line */}
            <Line
              type="monotone"
              dataKey="goalProgress"
              stroke="var(--color-info-main)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Zero line reference */}
            <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="2 2" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Chips */}
      <div className="timeline-chips">
        {TIMELINE_PRESETS.map(preset => (
          <button
            key={preset.id}
            className={`chip ${selectedTimeline.id === preset.id ? 'chip-active' : ''}`}
            onClick={() => handleTimelineChange(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Timeline Modal */}
      {isEditingTimeline && (
        <div className="custom-timeline-modal">
          <div className="modal-backdrop" onClick={() => setIsEditingTimeline(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h4>Custom Timeline</h4>
              <button
                className="modal-close"
                onClick={() => setIsEditingTimeline(false)}
              >
                <Icon name={IconNames.close} size="sm" />
              </button>
            </div>

            <div className="custom-inputs">
              <div className="input-group">
                <label>Months</label>
                <input
                  type="number"
                  placeholder="Enter months"
                  value={customMonths}
                  onChange={(e) => handleCustomMonthsChange(parseInt(e.target.value) || 0)}
                  min="1"
                  max="120"
                />
              </div>

              <div className="input-divider">or</div>

              <div className="input-group">
                <label>Target Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setIsEditingTimeline(false)}
              >
                Cancel
              </button>
              <button
                className="modal-confirm"
                onClick={() => {
                  const customTimeline = { ...TIMELINE_PRESETS[3], months: customMonths };
                  setSelectedTimeline(customTimeline);
                  setIsEditingTimeline(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="card-label">
            <div className="kpi-label">Monthly Needed</div>
            <div className="kpi-value">${kpis.monthlyNeeded.toLocaleString()}</div>
          </div>
          <div className="kpi-progress">
            <div className="progress-bar">
              <div
                className="progress-fill monthly-progress"
                style={{
                  width: `${Math.min((kpis.monthlyNeeded / 1000) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
          <div className="kpi-subtitle">to reach goal</div>
        </div>

        <div className="kpi-card">
          <div className="card-label">
            <div className="kpi-label">Time to Goal</div>
            <div className="kpi-value">{kpis.timeToGoal}</div>
          </div>
          <div className="kpi-progress">
            <div className="progress-bar">
              <div
                className="progress-fill time-progress"
                style={{
                  width: `${Math.max(100 - (timelineMonths / 120) * 100, 5)}%`
                }}
              ></div>
            </div>
          </div>
          <div className="kpi-subtitle">target: {kpis.targetDate}</div>
        </div>

        <div className="kpi-card">
          <div className="card-label">
            <div className="kpi-label">Goal Progress</div>
            <div className="kpi-value">{kpis.goalProgressPercent}%</div>
          </div>
          <div className="kpi-progress">
            <div className="progress-bar">
              <div
                className="progress-fill goal-progress"
                style={{
                  width: `${Math.min(kpis.goalProgressPercent, 100)}%`
                }}
              ></div>
            </div>
          </div>
          <div className="kpi-subtitle">${goalCurrent.toLocaleString()} / ${goalTarget.toLocaleString()}</div>
        </div>
      </div>
    </Card>
  );
}
