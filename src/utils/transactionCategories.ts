// Shared utility for transaction categorization and icon mapping
// This ensures consistency between SpendingCard and Recent Activity

export interface Transaction {
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

export interface AccountActivityItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
  source: 'linked' | 'manual';
  category?: string;
  runningBalance?: number;
}

export interface ActivityItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
  source: 'linked' | 'manual';
  category?: string;
}

// Map transaction categories to user-friendly names
export const getCategoryName = (transaction: Transaction): string => {
  let category = transaction.category?.[0] || 'Other';
  
  // Clean up category names
  category = category.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  
  // Map to more user-friendly names
  const categoryMapping: Record<string, string> = {
    'food and drink': 'Eating Out',
    'restaurants': 'Eating Out',
    'groceries': 'Groceries',
    'shops': 'Shopping',
    'shopping': 'Shopping', // Keep both for compatibility
    'retail': 'Shopping',
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
    'payroll': 'Income',
    'income': 'Income',
    'payments': 'Debts',
    'payment': 'Debts',
    'loan payment': 'Debts',
    'credit card payment': 'Debts',
    'student loan': 'Debts',
    'auto loan': 'Debts',
    'personal loan': 'Debts',
    'other': 'Other'
  };
  
  // Check for grocery stores first
  const transactionName = transaction.name.toLowerCase();
  if (transactionName.includes('whole foods') || 
      transactionName.includes('safeway') || 
      transactionName.includes('kroger') || 
      transactionName.includes('trader joe') ||
      transactionName.includes('albertsons') ||
      transactionName.includes('publix') ||
      transactionName.includes('wegmans') ||
      transactionName.includes('costco') ||
      transactionName.includes('walmart') ||
      transactionName.includes('target') ||
      transactionName.includes('grocery') ||
      transaction.category?.includes('Groceries')) {
    return 'Groceries';
  }
  
  // Check for payment-related transactions in the description
  if (transactionName.includes('payment') || 
      transactionName.includes('loan payment') || 
      transactionName.includes('credit card payment') || 
      transactionName.includes('student loan') || 
      transactionName.includes('auto loan') || 
      transactionName.includes('personal loan')) {
    return 'Debts';
  }
  
  return categoryMapping[category] || category.split(' ')[0] || 'Other';
};

// Get Material Design icon for spending category
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    'Debts': 'account_balance',
    'Eating Out': 'restaurant_menu',
    'Groceries': 'shopping_cart',
    'Shopping': 'shopping_bag',
    'Entertainment': 'movie',
    'Transportation': 'directions_car',
    'Gas': 'local_gas_station',
    'Utilities': 'electrical_services',
    'Rent': 'home',
    'Housing': 'home',
    'Healthcare': 'local_hospital',
    'Fitness': 'fitness_center',
    'Education': 'school',
    'Travel': 'flight',
    'Subscriptions': 'subscriptions',
    'Insurance': 'security',
    'Transfer': 'sync_alt',
    'Income': 'savings',
    'Other': 'category'
  };
  
  return iconMap[categoryName] || 'category';
};

// Get category icon directly from transaction
export const getTransactionCategoryIcon = (transaction: Transaction): string => {
  const categoryName = getCategoryName(transaction);
  return getCategoryIcon(categoryName);
};

// Map account activity item categories to user-friendly names
export const getAccountActivityCategoryName = (activityItem: AccountActivityItem): string => {
  let category = activityItem.category || 'Other';
  
  // Clean up category names
  category = category.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  
  // Map to more user-friendly names
  const categoryMapping: Record<string, string> = {
    'food and drink': 'Eating Out',
    'restaurants': 'Eating Out',
    'groceries': 'Groceries',
    'shops': 'Shopping',
    'shopping': 'Shopping', // Keep both for compatibility
    'retail': 'Shopping',
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
    'payroll': 'Income',
    'income': 'Income',
    'payments': 'Debts',
    'payment': 'Debts',
    'loan payment': 'Debts',
    'credit card payment': 'Debts',
    'student loan': 'Debts',
    'auto loan': 'Debts',
    'personal loan': 'Debts',
    'transfer': 'Transfer',
    'other': 'Other'
  };
  
  // Check for grocery stores first
  const transactionDescription = activityItem.description.toLowerCase();
  if (transactionDescription.includes('whole foods') || 
      transactionDescription.includes('safeway') || 
      transactionDescription.includes('kroger') || 
      transactionDescription.includes('trader joe') ||
      transactionDescription.includes('albertsons') ||
      transactionDescription.includes('publix') ||
      transactionDescription.includes('wegmans') ||
      transactionDescription.includes('costco') ||
      transactionDescription.includes('walmart') ||
      transactionDescription.includes('target') ||
      transactionDescription.includes('grocery') ||
      activityItem.category?.includes('Groceries')) {
    return 'Groceries';
  }
  
  // Check for payment-related transactions in the description
  if (transactionDescription.includes('payment') || 
      transactionDescription.includes('loan payment') || 
      transactionDescription.includes('credit card payment') || 
      transactionDescription.includes('student loan') || 
      transactionDescription.includes('auto loan') || 
      transactionDescription.includes('personal loan')) {
    return 'Debts';
  }
  
  return categoryMapping[category] || category.split(' ')[0] || 'Other';
};

// Get category icon directly from account activity item
export const getAccountActivityCategoryIcon = (activityItem: AccountActivityItem): string => {
  const categoryName = getAccountActivityCategoryName(activityItem);
  return getCategoryIcon(categoryName);
};

// Map activity item categories to user-friendly names (for ActivityItem)
export const getActivityItemCategoryName = (activityItem: ActivityItem): string => {
  let category = activityItem.category || 'Other';
  
  // Clean up category names
  category = category.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  
  // Map to more user-friendly names
  const categoryMapping: Record<string, string> = {
    'food and drink': 'Eating Out',
    'restaurants': 'Eating Out',
    'groceries': 'Groceries',
    'shops': 'Shopping',
    'shopping': 'Shopping', // Keep both for compatibility
    'retail': 'Shopping',
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
    'payroll': 'Income',
    'income': 'Income',
    'payments': 'Debts',
    'payment': 'Debts',
    'loan payment': 'Debts',
    'credit card payment': 'Debts',
    'student loan': 'Debts',
    'auto loan': 'Debts',
    'personal loan': 'Debts',
    'transfer': 'Transfer',
    'other': 'Other'
  };
  
  // Check for grocery stores first
  const transactionDescription = activityItem.description.toLowerCase();
  if (transactionDescription.includes('whole foods') || 
      transactionDescription.includes('safeway') || 
      transactionDescription.includes('kroger') || 
      transactionDescription.includes('trader joe') ||
      transactionDescription.includes('albertsons') ||
      transactionDescription.includes('publix') ||
      transactionDescription.includes('wegmans') ||
      transactionDescription.includes('costco') ||
      transactionDescription.includes('walmart') ||
      transactionDescription.includes('target') ||
      transactionDescription.includes('grocery') ||
      activityItem.category?.includes('Groceries')) {
    return 'Groceries';
  }
  
  // Check for payment-related transactions in the description
  if (transactionDescription.includes('payment') || 
      transactionDescription.includes('loan payment') || 
      transactionDescription.includes('credit card payment') || 
      transactionDescription.includes('student loan') || 
      transactionDescription.includes('auto loan') || 
      transactionDescription.includes('personal loan')) {
    return 'Debts';
  }
  
  return categoryMapping[category] || category.split(' ')[0] || 'Other';
};

// Get category icon directly from activity item
export const getActivityItemCategoryIcon = (activityItem: ActivityItem): string => {
  const categoryName = getActivityItemCategoryName(activityItem);
  return getCategoryIcon(categoryName);
};
