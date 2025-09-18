import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { COLORS } from '../ui/colors';
import { formatCurrency } from '../state/selectors';

interface DonutSavingsDebtProps {
  savingsTotal: number;
  debtTotal: number;
}

export function DonutSavingsDebt({ savingsTotal, debtTotal }: DonutSavingsDebtProps) {
  const data = [
    { name: 'Savings', value: savingsTotal, color: COLORS.savings },
    { name: 'Debt', value: debtTotal, color: COLORS.debt }
  ];

  const total = savingsTotal + debtTotal;
  const savingsPercent = total > 0 ? Math.round((savingsTotal / total) * 100) : 0;
  const debtPercent = total > 0 ? Math.round((debtTotal / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-50 h-50">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-2xl font-bold text-white leading-none">{savingsPercent}%</div>
          <div className="text-xs text-[#B6B6B6] mt-1">Savings</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-white font-medium">Savings: {formatCurrency(savingsTotal)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error" />
          <span className="text-sm text-white font-medium">Debt: {formatCurrency(debtTotal)}</span>
        </div>
      </div>
    </div>
  );
}





