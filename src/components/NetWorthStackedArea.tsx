import React from 'react';
import { Area, AreaChart, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { COLORS } from '../ui/colors';

interface NetWorthStackedAreaProps {
  data: Array<{ date: string; assets: number; debts: number; net: number }>;
}

export function NetWorthStackedArea({ data }: NetWorthStackedAreaProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="chartFull">
      <div className="chartTitle">
        Assets vs Debts (last ~8 weeks)
      </div>
      <div className="chartSize">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
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
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text,
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '320px',
                minWidth: '280px',
                padding: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-base)'
              }}
              labelFormatter={(v) => `Date: ${v}`}
              formatter={(v: number, k) => [`$${Math.round(v).toLocaleString()}`, k]}
            />
            <Area
              type="monotone"
              dataKey="assets"
              name="Assets"
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
              name="Debts"
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
    </div>
  );
}
