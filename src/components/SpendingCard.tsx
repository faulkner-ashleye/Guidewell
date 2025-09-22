import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../state/selectors';
import { COLORS } from '../ui/colors';
import { Icon } from './Icon';
import { getCategoryName, getCategoryIcon } from '../utils/transactionCategories';
import './SpendingCard.css';

interface Transaction {
  id: string;
  account_id: string;
  plaid_transaction_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category?: string[];
  created_at: string;
}

interface SpendingCardProps {
  transactions: Transaction[];
}

interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

const SPENDING_COLORS = [
  COLORS.primary,   // Primary blue
  COLORS.savings,   // Green for savings-related spending
  COLORS.investing, // Teal for investing-related spending
  COLORS.debt,      // Red for debt-related spending
  COLORS.textMuted, // Muted text color
  '#F59E0B',        // Orange (keeping one additional color)
  '#8B5CF6',        // Purple (keeping one additional color)
  '#EC4899',        // Pink (keeping one additional color)
];


export function SpendingCard({ transactions }: SpendingCardProps) {
  // Process transactions to get spending categories
  const spendingData = useMemo(() => {
    // Filter for spending transactions (negative amounts, exclude transfers and payments)
    const spendingTransactions = transactions.filter(transaction => {
      const isSpending = transaction.amount < 0;
      const isTransfer = transaction.name.toLowerCase().includes('transfer');
      const isPayment = transaction.name.toLowerCase().includes('payment');
      const isInvestment = transaction.name.toLowerCase().includes('401k') || 
                          transaction.name.toLowerCase().includes('investment');
      
      return isSpending && !isTransfer && !isPayment && !isInvestment;
    });

    // Group by category
    const categoryMap = new Map<string, number>();
    
    spendingTransactions.forEach(transaction => {
      const categoryName = getCategoryName(transaction);
      const amount = Math.abs(transaction.amount); // Convert to positive for spending
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
    });

    // Convert to array and sort by amount
    const categories = Array.from(categoryMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories

    const totalSpending = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return categories.map((category, index) => ({
      name: category.name,
      amount: category.amount,
      percentage: totalSpending > 0 ? Math.round((category.amount / totalSpending) * 100) : 0,
      color: SPENDING_COLORS[index % SPENDING_COLORS.length]
    }));
  }, [transactions]);

  const totalSpending = spendingData.reduce((sum, cat) => sum + cat.amount, 0);

  if (spendingData.length === 0) {
    return (
      <div className="spending-card">
        <div className="card-header">
          <h3>Top Spending</h3>
        </div>
        <div className="no-spending">
          <p>No spending data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-card">
      <div className="card-header">
        <h3>Top Spending</h3>
      </div>
      
      <div className="spending-content">
        <div className="spending-chart">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="spending-list">
          {spendingData.map((category, index) => (
            <div key={category.name} className="spending-item">
              <div className="spending-item-info">
                <div 
                  className="spending-color-bar" 
                  style={{ backgroundColor: category.color }}
                />
                <Icon 
                  name={getCategoryIcon(category.name)} 
                  size="sm"
                  style={{ fontSize: '16px', marginRight: '8px' }}
                />
                <span className="spending-category">{category.name}</span>
              </div>
              <span className="spending-amount">{formatCurrency(category.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
