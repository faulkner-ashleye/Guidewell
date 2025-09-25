import React, { useState, useMemo } from 'react';
import { Area, AreaChart, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { COLORS } from '../ui/colors';
import './NetWorthChartWithTimeline.css';

interface NetWorthChartWithTimelineProps {
  data: Array<{ date: string; assets: number; debts: number; net: number }>;
  title?: string;
}

type TimeRange = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL';

const TIME_RANGES: { key: TimeRange; label: string; months: number }[] = [
  { key: '1M', label: '1M', months: 1 },
  { key: '3M', label: '3M', months: 3 },
  { key: '6M', label: '6M', months: 6 },
  { key: 'YTD', label: 'YTD', months: 0 }, // Special case for year to date
  { key: '1Y', label: '1Y', months: 12 },
  { key: 'ALL', label: 'ALL', months: -1 } // -1 means all data
];

export function NetWorthChartWithTimeline({ data, title = "Assets vs Debts" }: NetWorthChartWithTimelineProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1M');

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    let startDate: Date;

    if (selectedTimeRange === 'YTD') {
      // Year to date
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (selectedTimeRange === 'ALL') {
      // All data
      return data;
    } else {
      // Months back
      const months = TIME_RANGES.find(range => range.key === selectedTimeRange)?.months || 1;
      startDate = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
    }

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [data, selectedTimeRange]);

  // Format date for X-axis display
  const formatXAxisDate = (tickItem: string) => {
    const date = new Date(tickItem);
    if (selectedTimeRange === '1M' || selectedTimeRange === '3M') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (selectedTimeRange === '6M' || selectedTimeRange === 'YTD') {
      return date.toLocaleDateString('en-US', { month: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="networth-chart-with-timeline">
      <div className="chart-header">
        <div className="chart-title">
          {title}
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredData}
            margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.border}
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="date"
              hide
            />
            <YAxis
              hide
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-background-paper)',
                border: `1px solid ${COLORS.border}`,
                color: 'var(--color-text-primary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '320px',
                minWidth: '280px',
                padding: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-base)'
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
              }}
              formatter={(value: number, name) => [
                `$${Math.round(value).toLocaleString()}`,
                name === 'assets' ? 'Assets' : name === 'debts' ? 'Debts' : 'Net Worth'
              ]}
            />
            <Area
              type="monotone"
              dataKey="assets"
              name="assets"
              stroke={COLORS.savings}
              fill={COLORS.savings}
              fillOpacity={0.3}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: COLORS.savings, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="debts"
              name="debts"
              stroke={COLORS.debt}
              fill={COLORS.debt}
              fillOpacity={0.3}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: COLORS.debt, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="timeline-controls">
        {TIME_RANGES.map((range) => (
          <button
            key={range.key}
            className={`time-range-button timeline-chip ${selectedTimeRange === range.key ? 'active' : ''}`}
            onClick={() => setSelectedTimeRange(range.key)}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
