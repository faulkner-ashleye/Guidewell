import { Transaction } from '../lib/supabase';

/**
 * Converts text to title case (first letter of each word capitalized)
 */
export function toTitleCase(text: string): string {
  if (!text) return '';

  // Handle special cases for common terms
  const specialCases: { [key: string]: string } = {
    'CHARLES SCHWAB': 'Charles Schwab',
    'ROTH IRA': 'Roth IRA',
    '401K': '401K',
    '529': '529',
    'DEPOSIT': 'Deposit'
  };

  let result = text;

  // Apply special cases first
  for (const [key, value] of Object.entries(specialCases)) {
    if (result.toUpperCase().includes(key)) {
      result = result.replace(new RegExp(key, 'gi'), value);
    }
  }

  // Convert to title case
  const words = result.split(' ');
  const titleWords = words.map(word => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return titleWords.join(' ');
}

/**
 * Converts text to sentence case (first letter capitalized, rest lowercase)
 */
export function toSentenceCase(text: string): string {
  if (!text) return '';

  // Handle special cases for common transaction types
  const specialCases: { [key: string]: string } = {
    'STARBUCKS': 'Starbucks',
    'WALMART': 'Walmart',
    'TARGET': 'Target',
    'COSTCO': 'Costco',
    'WHOLE FOODS': 'Whole Foods',
    'TRADER JOE\'S': "Trader Joe's",
    'TRADER JOES': "Trader Joe's",
    'UBER': 'Uber',
    'LYFT': 'Lyft',
    'NETFLIX': 'Netflix',
    'SPOTIFY': 'Spotify',
    'AMAZON': 'Amazon',
    'PAYPAL': 'PayPal',
    'VENMO': 'Venmo',
    'ZELLE': 'Zelle',
    'ADOBE': 'Adobe',
    'ADOBE CREATIVE SUITE': 'Adobe Creative Suite',
    'DAVID\'S BRIDAL': 'David\'s Bridal',
    'UBER EATS': 'Uber Eats',
    'CAPITAL ONE': 'Capital One',
    'PAYROLL': 'Payroll',
    'RENT': 'Rent',
    '401K': '401k',
    'ROTH IRA': 'Roth IRA',
    '529': '529'
  };

  // Handle financial terms that should be lowercase
  const financialTerms = [
    'CONTRIBUTION', 'PAYMENT', 'TRANSFER', 'DEPOSIT', 'WITHDRAWAL',
    'LOAN', 'CREDIT', 'DEBIT', 'REFUND', 'FEE', 'CHARGE',
    'SUBSCRIPTION', 'RENEWAL', 'BILL', 'INVOICE', 'RECEIPT'
  ];

  let result = text;

  // Remove location numbers from merchant names (e.g., "Starbucks #12345" → "Starbucks")
  result = result.replace(/\s*#\d+\s*$/gi, '');

  // Handle Trader Joe's specifically first (apostrophe can cause regex issues)
  if (result.toUpperCase().includes('TRADER JOE')) {
    result = result.replace(/TRADER JOE['\u2019]?S?/gi, "Trader Joe's");
  }

  // Apply special cases first
  for (const [key, value] of Object.entries(specialCases)) {
    if (result.toUpperCase().includes(key)) {
      result = result.replace(new RegExp(key, 'gi'), value);
    }
  }

  // Convert financial terms to lowercase (unless they're the first word)
  for (const term of financialTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    result = result.replace(regex, (match, offset) => {
      // If this is the first word in the string, capitalize it
      if (offset === 0) {
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      }
      // Otherwise, make it all lowercase
      return match.toLowerCase();
    });
  }

  // Convert remaining text to proper sentence case
  // Split into words and process each one
  const words = result.split(' ');
  const processedWords = words.map((word, index) => {
    // Skip if word is empty
    if (!word) {
      return word;
    }

    // First word should always be capitalized
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    // Other words should be lowercase
    return word.toLowerCase();
  });

  result = processedWords.join(' ');

  return result;
}

/**
 * Removes redundant terms from description that match the category
 */
export function removeRedundantCategoryTerms(description: string, category: string): string {
  if (!description || !category) return description;

  let result = description;

  // Special handling for housing payments - keep "rent payment" or "mortgage payment" intact
  if (category === 'Housing') {
    // Don't remove "payment" if it's part of "rent payment" or "mortgage payment"
    if (result.toLowerCase().includes('rent payment') || result.toLowerCase().includes('mortgage payment')) {
      return result; // Keep the full phrase
    }
    // Remove other housing-related terms but keep "payment"
    const housingTerms = ['housing', 'rental'];
    for (const term of housingTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, '').replace(/\s+/g, ' ').trim();
    }
    return result;
  }

  // Special handling for transportation - simplify Uber and Lyft to just brand names
  if (category === 'Transportation') {
    if (result.toLowerCase().includes('uber')) {
      return 'Uber';
    }
    if (result.toLowerCase().includes('lyft')) {
      return 'Lyft';
    }
    // Remove other transportation terms
    const transportationTerms = ['transportation', 'transport', 'trip', 'ride'];
    for (const term of transportationTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, '').replace(/\s+/g, ' ').trim();
    }
    return result;
  }

  // Special handling for grocery - simplify Whole Foods to just brand name
  if (category === 'Grocery') {
    if (result.toLowerCase().includes('whole foods')) {
      return 'Whole Foods';
    }
    // Remove other grocery terms
    const groceryTerms = ['grocery', 'groceries', 'market'];
    for (const term of groceryTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, '').replace(/\s+/g, ' ').trim();
    }
    return result;
  }

  // Special handling for childcare - keep descriptive terms like "payment"
  if (category === 'Childcare') {
    // Don't remove "payment" for childcare - keep it descriptive
    const childcareTerms = ['childcare', 'child care'];
    for (const term of childcareTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, '').replace(/\s+/g, ' ').trim();
    }
    return result;
  }

  // Map other categories to their redundant terms
  const categoryToTerms: { [key: string]: string[] } = {
    'Transfer': ['transfer', 'transfers'],
    'Payment': ['payment', 'payments'],
    'Investment': ['contribution', 'contributions'],
    'Grocery': ['grocery', 'groceries'],
    'Food & Dining': ['dining', 'restaurant', 'restaurants'],
    'Retail': ['retail', 'shopping', 'store'],
    'Transportation': ['transportation', 'transport'],
    'Entertainment': ['entertainment'],
    'Utilities': ['utilities', 'utility'],
    'Healthcare': ['healthcare', 'medical', 'health'],
    'Business': ['business'],
    'Income': ['income', 'payroll', 'salary']
  };

  const redundantTerms = categoryToTerms[category];
  if (!redundantTerms) return description;

  // Remove redundant terms (case insensitive)
  for (const term of redundantTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    result = result.replace(regex, '').replace(/\s+/g, ' ').trim();
  }

  return result;
}

/**
 * Simplifies complex category arrays to single primary categories
 */
export function simplifyCategory(categories: string[]): string {
  if (!categories || categories.length === 0) return '';

  // Check all categories for priority mappings first
  const allCategories = categories.join(' ').toLowerCase();

  // Priority mappings - check these first
  if (allCategories.includes('groceries')) {
    return 'Grocery';
  }
  if (allCategories.includes('investment') || allCategories.includes('retirement') || allCategories.includes('education')) {
    return 'Investment';
  }
  if (allCategories.includes('transfer') || allCategories.includes('savings')) {
    return 'Transfer';
  }
  if (allCategories.includes('payment') || allCategories.includes('student loan') || allCategories.includes('credit card') || allCategories.includes('auto loan') || allCategories.includes('personal loan')) {
    return 'Payment';
  }
  if (allCategories.includes('transportation') || allCategories.includes('rideshare') || allCategories.includes('gas')) {
    return 'Transportation';
  }
  if (allCategories.includes('entertainment') || allCategories.includes('streaming') || allCategories.includes('music') || allCategories.includes('subscription')) {
    return 'Entertainment';
  }
  if (allCategories.includes('utilities')) {
    return 'Utilities';
  }
  if (allCategories.includes('medical') || allCategories.includes('healthcare')) {
    return 'Healthcare';
  }
  if (allCategories.includes('childcare')) {
    return 'Childcare';
  }
  if (allCategories.includes('business') || allCategories.includes('office') || allCategories.includes('software')) {
    return 'Business';
  }
  if (allCategories.includes('income') || allCategories.includes('payroll') || allCategories.includes('freelance')) {
    return 'Income';
  }
  if (allCategories.includes('rent')) {
    return 'Housing';
  }

  // Fallback to first category for remaining cases
  const category = categories[0].toLowerCase();

  if (category.includes('food and drink') || category.includes('restaurants') || category.includes('coffee')) {
    return 'Food & Dining';
  }
  if (category.includes('shops') || category.includes('clothing') || category.includes('baby') || category.includes('general')) {
    return 'Retail';
  }
  if (category.includes('investment') || category.includes('retirement') || category.includes('education')) {
    return 'Investment';
  }
  if (category.includes('transfer') || category.includes('savings')) {
    return 'Transfer';
  }
  if (category.includes('payment') || category.includes('student loan') || category.includes('credit card') || category.includes('auto loan') || category.includes('personal loan')) {
    return 'Payment';
  }
  if (category.includes('transportation') || category.includes('rideshare') || category.includes('gas')) {
    return 'Transportation';
  }
  if (category.includes('entertainment') || category.includes('streaming') || category.includes('music') || category.includes('subscription')) {
    return 'Entertainment';
  }
  if (category.includes('utilities')) {
    return 'Utilities';
  }
  if (category.includes('medical') || category.includes('healthcare')) {
    return 'Healthcare';
  }
  if (category.includes('childcare')) {
    return 'Childcare';
  }
  if (category.includes('business') || category.includes('office') || category.includes('software')) {
    return 'Business';
  }
  if (category.includes('income') || category.includes('payroll') || category.includes('freelance')) {
    return 'Income';
  }
  if (category.includes('rent')) {
    return 'Housing';
  }

  // Default fallback - capitalize first word
  return categories[0].charAt(0).toUpperCase() + categories[0].slice(1);
}

// Manual contribution interface (for user-entered contributions)
export interface Contribution {
  id: string;
  accountId: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  description: string;
  goalId?: string; // Optional goal this contribution is for
  createdAt: string; // ISO timestamp
}

// Normalized activity item for the feed
export interface ActivityItem {
  id: string;
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
  source: 'linked' | 'manual';
  category?: string; // Simplified single transaction category
}

/**
 * Merges transactions and contributions into a unified activity feed
 * @param transactions Array of linked account transactions
 * @param contributions Array of manual contributions
 * @param accounts Array of accounts for name lookup
 * @returns Sorted array of activity items (newest first)
 */
export function mergeActivity(
  transactions: Transaction[] = [],
  contributions: Contribution[] = [],
  accounts: any[] = []
): ActivityItem[] {
  const activityItems: ActivityItem[] = [];

  // Add transactions (linked accounts)
  transactions.forEach(transaction => {
    const account = accounts.find(acc => acc.id === transaction.account_id);
    const category = simplifyCategory(transaction.category || []);

    // For 401K and Roth IRA contributions, use the account name instead of generic transaction name
    let description;
    if (transaction.name && (transaction.name.toLowerCase().includes('401k') || transaction.name.toLowerCase().includes('roth ira')) && account?.name) {
      description = toTitleCase(account.name);
    } else {
      // Check if this is a goal-related transaction that should use title case
      const goalKeywords = ['emergency fund', 'college fund', 'house', 'wedding', 'vacation', '529', 'deposit'];
      const transactionName = (transaction.name || '').toLowerCase();
      const isGoalRelated = goalKeywords.some(keyword => transactionName.includes(keyword));

      if (isGoalRelated) {
        description = toTitleCase(transaction.name || transaction.merchant_name || 'Transaction');
      } else {
        description = toSentenceCase(transaction.name || transaction.merchant_name || 'Transaction');
      }
    }

    // Remove redundant terms that match the category
    description = removeRedundantCategoryTerms(description, category);

    activityItems.push({
      id: `transaction-${transaction.id}`,
      date: transaction.date,
      description: description,
      amount: transaction.amount,
      accountId: transaction.account_id,
      accountName: account?.name || 'Unknown Account',
      source: 'linked',
      category: category
    });
  });

  // Add contributions (manual entries)
  contributions.forEach(contribution => {
    const account = accounts.find(acc => acc.id === contribution.accountId);
    activityItems.push({
      id: `contribution-${contribution.id}`,
      date: contribution.date,
      description: contribution.description,
      amount: contribution.amount,
      accountId: contribution.accountId,
      accountName: account?.name || 'Unknown Account',
      source: 'manual'
    });
  });

  // Sort by date (newest first)
  return activityItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Gets the most recent activity items (up to limit)
 * @param transactions Array of linked account transactions
 * @param contributions Array of manual contributions
 * @param accounts Array of accounts for name lookup
 * @param limit Maximum number of items to return (default: 10)
 * @returns Limited array of recent activity items
 */
export function getRecentActivity(
  transactions: Transaction[] = [],
  contributions: Contribution[] = [],
  accounts: any[] = [],
  limit: number = 10
): ActivityItem[] {
  const allActivity = mergeActivity(transactions, contributions, accounts);
  return allActivity.slice(0, limit);
}
