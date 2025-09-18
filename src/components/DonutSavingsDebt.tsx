import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { COLORS } from '../ui/colors';
import { formatCurrency } from '../state/selectors';
import './DonutSavingsDebt.css';

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
    <div className="donut-container">
      <div className="donut-chart">
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
        <div className="donut-center">
          <div className="donut-percentage">{savingsPercent}%</div>
          <div className="donut-label">Savings</div>
        </div>
      </div>
      
      <div className="donut-legend">
        <div className="legend-item">
          <div className="legend-dot-color bg-success" />
          <span className="legend-text">Savings: {formatCurrency(savingsTotal)}</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot-color bg-error" />
          <span className="legend-text">Debt: {formatCurrency(debtTotal)}</span>
        </div>
      </div>
    </div>
  );
}





