import { AccountType } from '../app/types';

/**
 * Maps Plaid account types to our internal account types
 * Handles the conversion from Plaid's type/subtype structure to our simplified types
 */
export function mapPlaidAccountType(plaidType: string, plaidSubtype?: string): AccountType {
  // Handle direct account type mappings first (for simplified Plaid responses)
  switch (plaidType.toLowerCase()) {
    case 'checking':
      return 'checking';
    case 'savings':
      return 'savings';
    case 'credit_card':
      return 'credit_card';
    case 'investment':
      return 'investment';
    case 'loan':
      return 'loan';
    case 'mortgage':
      return 'mortgage';
    case 'auto':
      return 'auto';
    case 'student':
      return 'student';
    case 'brokerage':
      return 'brokerage';
    case 'ira':
      return 'ira';
    case '401k':
      return '401k';
    case 'roth_ira':
      return 'roth_ira';
  }

  // Handle standard Plaid account types
  switch (plaidType.toLowerCase()) {
    case 'depository':
      return mapDepositorySubtype(plaidSubtype);
    case 'credit':
      return mapCreditSubtype(plaidSubtype);
    case 'investment':
      return mapInvestmentSubtype(plaidSubtype);
    case 'loan':
      return mapLoanSubtype(plaidSubtype);
    default:
      // Fallback for unknown types
      console.warn(`Unknown Plaid account type: ${plaidType}, subtype: ${plaidSubtype}`);
      return 'savings'; // Default fallback
  }
}

function mapDepositorySubtype(subtype?: string): AccountType {
  if (!subtype) return 'checking'; // Default for depository
  
  switch (subtype.toLowerCase()) {
    case 'checking':
      return 'checking';
    case 'savings':
      return 'savings';
    case 'money market':
    case 'money_market':
      return 'money_market';
    case 'cd':
      return 'cd';
    case 'cash management':
    case 'cash_management':
      return 'cash_management';
    case 'prepaid':
      return 'prepaid';
    case 'hsa':
      return 'hsa';
    case 'gic':
      return 'gic';
    default:
      return 'checking'; // Default for depository
  }
}

function mapCreditSubtype(subtype?: string): AccountType {
  if (!subtype) return 'credit_card'; // Default for credit
  
  switch (subtype.toLowerCase()) {
    case 'credit card':
    case 'credit_card':
      return 'credit_card';
    case 'line of credit':
    case 'line_of_credit':
      return 'line_of_credit';
    case 'overdraft':
      return 'overdraft';
    default:
      return 'credit_card'; // Default for credit
  }
}

function mapInvestmentSubtype(subtype?: string): AccountType {
  if (!subtype) return 'investment'; // Default for investment
  
  switch (subtype.toLowerCase()) {
    case '401a':
      return '401a';
    case '401k':
      return '401k';
    case '403b':
      return '403b';
    case '457b':
      return '457b';
    case '529':
      return '529';
    case 'brokerage':
      return 'brokerage';
    case 'esa':
      return 'esa';
    case 'ira':
      return 'ira';
    case 'isa':
      return 'isa';
    case 'lira':
      return 'lira';
    case 'rif':
      return 'rif';
    case 'rsp':
      return 'rsp';
    case 'pension':
      return 'pension';
    case 'profit sharing':
    case 'profit_sharing':
      return 'profit_sharing';
    case 'roth ira':
    case 'roth_ira':
      return 'roth_ira';
    case 'roth 401k':
    case 'roth_401k':
      return 'roth_401k';
    case 'sep ira':
    case 'sep_ira':
      return 'sep_ira';
    case 'simple ira':
    case 'simple_ira':
      return 'simple_ira';
    case 'sipp':
      return 'sipp';
    case 'stock plan':
    case 'stock_plan':
      return 'stock_plan';
    case 'tsp':
      return 'tsp';
    case 'tfsa':
      return 'tfsa';
    case 'custodial':
      return 'custodial';
    case 'variable annuity':
    case 'variable_annuity':
      return 'variable_annuity';
    default:
      return 'investment'; // Default for investment
  }
}

function mapLoanSubtype(subtype?: string): AccountType {
  if (!subtype) return 'loan'; // Default for loan
  
  switch (subtype.toLowerCase()) {
    case 'auto':
      return 'auto';
    case 'commercial':
      return 'commercial';
    case 'construction':
      return 'construction';
    case 'consumer':
      return 'consumer';
    case 'home equity':
    case 'home_equity':
      return 'home_equity';
    case 'mortgage':
      return 'mortgage';
    case 'student':
      return 'student';
    default:
      return 'loan'; // Default for loan
  }
}

/**
 * Gets a human-readable display name for account types
 */
export function getAccountTypeDisplayName(accountType: AccountType): string {
  switch (accountType) {
    // Depository
    case 'checking': return 'Checking';
    case 'savings': return 'Savings';
    case 'money_market': return 'Money Market';
    case 'cd': return 'Certificate of Deposit';
    case 'cash_management': return 'Cash Management';
    case 'prepaid': return 'Prepaid Card';
    case 'hsa': return 'Health Savings Account';
    case 'gic': return 'Guaranteed Investment Certificate';
    
    // Credit
    case 'credit_card': return 'Credit Card';
    case 'line_of_credit': return 'Line of Credit';
    case 'overdraft': return 'Overdraft';
    
    // Investment
    case '401a': return '401(a) Plan';
    case '401k': return '401(k) Plan';
    case '403b': return '403(b) Plan';
    case '457b': return '457(b) Plan';
    case '529': return '529 Education Savings';
    case 'brokerage': return 'Brokerage Account';
    case 'esa': return 'Education Savings Account';
    case 'ira': return 'Traditional IRA';
    case 'isa': return 'Individual Savings Account';
    case 'lira': return 'Locked-In Retirement Account';
    case 'rif': return 'Retirement Income Fund';
    case 'rsp': return 'Registered Savings Plan';
    case 'pension': return 'Pension Plan';
    case 'profit_sharing': return 'Profit Sharing Plan';
    case 'roth_ira': return 'Roth IRA';
    case 'roth_401k': return 'Roth 401(k)';
    case 'sep_ira': return 'SEP IRA';
    case 'simple_ira': return 'SIMPLE IRA';
    case 'sipp': return 'Self-Invested Personal Pension';
    case 'stock_plan': return 'Employee Stock Plan';
    case 'tsp': return 'Thrift Savings Plan';
    case 'tfsa': return 'Tax-Free Savings Account';
    case 'custodial': return 'Custodial Account';
    case 'variable_annuity': return 'Variable Annuity';
    
    // Loan
    case 'auto': return 'Auto Loan';
    case 'commercial': return 'Commercial Loan';
    case 'construction': return 'Construction Loan';
    case 'consumer': return 'Consumer Loan';
    case 'home_equity': return 'Home Equity Loan';
    case 'mortgage': return 'Mortgage';
    case 'student': return 'Student Loan';
    
    // Legacy
    case 'loan': return 'Loan';
    case 'investment': return 'Investment Account';
    case 'debt': return 'Debt Account';
    
    default: return 'Account';
  }
}

/**
 * Categorizes account types into broader categories for UI grouping
 */
export function getAccountCategory(accountType: AccountType): 'depository' | 'credit' | 'investment' | 'loan' {
  switch (accountType) {
    case 'checking':
    case 'savings':
    case 'money_market':
    case 'cd':
    case 'cash_management':
    case 'prepaid':
    case 'hsa':
    case 'gic':
      return 'depository';
      
    case 'credit_card':
    case 'line_of_credit':
    case 'overdraft':
      return 'credit';
      
    case '401a':
    case '401k':
    case '403b':
    case '457b':
    case '529':
    case 'brokerage':
    case 'esa':
    case 'ira':
    case 'isa':
    case 'lira':
    case 'rif':
    case 'rsp':
    case 'pension':
    case 'profit_sharing':
    case 'roth_ira':
    case 'roth_401k':
    case 'sep_ira':
    case 'simple_ira':
    case 'sipp':
    case 'stock_plan':
    case 'tsp':
    case 'tfsa':
    case 'custodial':
    case 'variable_annuity':
    case 'investment':
      return 'investment';
      
    case 'auto':
    case 'commercial':
    case 'construction':
    case 'consumer':
    case 'home_equity':
    case 'mortgage':
    case 'student':
    case 'loan':
    case 'debt':
      return 'loan';
      
    default:
      return 'depository';
  }
}

