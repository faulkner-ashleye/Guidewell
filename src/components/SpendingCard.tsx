import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../state/selectors';
import './SpendingCard.css';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category?: string;
  date: string;
  accountId: string;
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
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#84CC16', // Lime
];

export function SpendingCard({ transactions }: SpendingCardProps) {
  // Process transactions to get spending categories
  const spendingData = useMemo(() => {
    // Filter for spending transactions (negative amounts, exclude transfers and payments)
    const spendingTransactions = transactions.filter(transaction => {
      const isSpending = transaction.amount < 0;
      const isTransfer = transaction.description.toLowerCase().includes('transfer');
      const isPayment = transaction.description.toLowerCase().includes('payment');
      const isInvestment = transaction.description.toLowerCase().includes('401k') || 
                          transaction.description.toLowerCase().includes('investment');
      
      return isSpending && !isTransfer && !isPayment && !isInvestment;
    });

    // Group by category
    const categoryMap = new Map<string, number>();
    
    spendingTransactions.forEach(transaction => {
      // Use category if available, otherwise extract from description
      let category = transaction.category || 'Other';
      
      // If category is an array, use the first one
      if (Array.isArray(category)) {
        category = category[0] || 'Other';
      }
      
      // Clean up category names
      category = category.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      
      // Map to more user-friendly names
      const categoryMapping: Record<string, string> = {
        'food and drink': 'Eating Out',
        'restaurants': 'Eating Out',
        'groceries': 'Groceries',
        'shopping': 'Shopping',
        'entertainment': 'Entertainment',
        'transportation': 'Transportation',
        'gas': 'Gas',
        'utilities': 'Utilities',
        'rent': 'Rent',
        'housing': 'Housing',
        'healthcare': 'Healthcare',
        'fitness': 'Fitness',
        'education': 'Education',
        'travel': 'Travel',
        'subscriptions': 'Subscriptions',
        'insurance': 'Insurance',
        'other': 'Other'
      };
      
      const mappedCategory = categoryMapping[category] || category.split(' ')[0] || 'Other';
      
      const amount = Math.abs(transaction.amount); // Convert to positive for spending
      categoryMap.set(mappedCategory, (categoryMap.get(mappedCategory) || 0) + amount);
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
