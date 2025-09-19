import React from 'react';
import { Area, AreaChart, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { COLORS } from '../ui/colors';

interface NetWorthStackedAreaProps {
  data: Array<{ date: string; assets: number; debts: number; net: number }>;
}

export function NetWorthStackedArea({ data }: NetWorthStackedAreaProps) {
  if (!data || data.length === 0) return null;
  
  return (
    <div style={{ 
      background: COLORS.card, 
      border: `1px solid ${COLORS.border}`, 
      borderRadius: 12, 
      padding: 12 
    }}>
      <div style={{ marginBottom: 8, color: COLORS.text }}>
        Assets vs Debts (last ~8 weeks)
      </div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <AreaChart 
            data={data} 
            stackOffset="none" 
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gAssets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.savings} stopOpacity={0.7}/>
                <stop offset="100%" stopColor={COLORS.savings} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="gDebts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.debt} stopOpacity={0.7}/>
                <stop offset="100%" stopColor={COLORS.debt} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ 
                background: COLORS.card, 
                border: `1px solid ${COLORS.border}`, 
                color: COLORS.text 
              }}
              labelFormatter={(v) => `Date: ${v}`}
              formatter={(v: number, k) => [`$${Math.round(v).toLocaleString()}`, k]}
            />
            <Area 
              type="monotone" 
              dataKey="assets" 
              name="Assets" 
              stroke={COLORS.savings} 
              fill="url(#gAssets)" 
            />
            <Area 
              type="monotone" 
              dataKey="debts"  
              name="Debts"  
              stroke={COLORS.debt}    
              fill="url(#gDebts)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}






