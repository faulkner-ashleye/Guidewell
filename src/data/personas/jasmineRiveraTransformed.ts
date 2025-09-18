import { Account } from '../../state/AppStateContext';
import jasmineData from './jasmine-rivera.json';

// Transform Plaid-style data to our Account interface
export function transformJasmineData(): Account[] {
  return jasmineData.override_accounts.map((account, index) => {
    const baseAccount: Account = {
      id: `jasmine-${index}`,
      name: account.official_name,
      balance: 0, // Will be calculated from transactions
      type: mapAccountType(account.type, account.subtype),
      linked: true // Jasmine's accounts are digitally linked
    };

    // Calculate balance from transactions for checking accounts
    if (account.type === 'depository' && account.subtype === 'checking' && account.transactions) {
      baseAccount.balance = account.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      // Update monthly direct deposit to reflect $68K salary with deductions
      baseAccount.monthlyDirectDeposit = calculateNetMonthlyIncome();
    }

    // Add savings goal target
    if (account.type === 'depository' && account.subtype === 'savings') {
      baseAccount.balance = 2000; // Wedding fund current balance
      baseAccount.goalTarget = 15000; // Wedding fund goal
    }

    // Add credit card information
    if (account.type === 'credit' && account.subtype === 'credit card') {
      baseAccount.balance = account.starting_balance || 0;
      baseAccount.apr = account.liability?.purchase_apr;
      baseAccount.minPayment = account.liability?.minimum_payment_amount;
    }

    // Add loan information
    if (account.type === 'loan') {
      // Calculate realistic current balance based on origination date and payments
      const principal = account.liability?.principal || 0;
      const apr = account.liability?.nominal_apr || 0;
      const originationDate = account.liability?.origination_date;
      const gracePeriodMonths = account.liability?.repayment_model?.non_repayment_months || 6;
      
      if (originationDate) {
        // Calculate realistic balance but adjust to maintain $24K total
        const calculatedBalance = calculateStudentLoanBalance(principal, apr, originationDate, gracePeriodMonths);
        
        // Adjust balances proportionally to maintain $23,880 total while reflecting realistic payments
        // Federal Loan A: $9,500 -> ~$8,080 (15% paid off, including recent $120 payment)
        // Federal Loan B: $8,200 -> ~$7,100 (13.4% paid off)  
        // Federal Loan C: $6,300 -> ~$8,700 (38% more due to higher interest)
        const adjustmentFactor = 23880 / (9500 + 8200 + 6300); // 0.995 to maintain $23,880 total
        
        if (principal === 9500) {
          baseAccount.balance = Math.round(8080 * adjustmentFactor); // ~$8,080 (reduced by $120 payment)
        } else if (principal === 8200) {
          baseAccount.balance = Math.round(7100 * adjustmentFactor); // ~$7,100
        } else if (principal === 6300) {
          baseAccount.balance = Math.round(8700 * adjustmentFactor); // ~$8,700
        } else {
          baseAccount.balance = Math.round(calculatedBalance * adjustmentFactor);
        }
      } else {
        baseAccount.balance = principal; // Fallback to original principal
      }
      
      baseAccount.apr = apr;
      
      // Calculate minimum payment based on loan terms
      if (account.liability?.repayment_model) {
        const monthlyPayment = principal / account.liability.repayment_model.repayment_months;
        baseAccount.minPayment = Math.round(monthlyPayment);
      }
    }

    // Add investment account information
    if (account.type === 'investment' && account.holdings) {
      // Calculate total current value from holdings
      baseAccount.balance = account.holdings.reduce((total, holding) => {
        return total + (holding.institution_price * holding.quantity);
      }, 0);
    }

    return baseAccount;
  });
}

function mapAccountType(plaidType: string, plaidSubtype: string): Account['type'] {
  if (plaidType === 'depository') {
    return plaidSubtype === 'checking' ? 'checking' : 'savings';
  }
  if (plaidType === 'credit') {
    return 'credit_card';
  }
  if (plaidType === 'loan') {
    return 'loan';
  }
  if (plaidType === 'investment') {
    return 'investment';
  }
  return 'checking'; // fallback
}

// Calculate realistic student loan balances based on origination dates, payments, and interest
function calculateStudentLoanBalance(
  principal: number,
  apr: number,
  originationDate: string,
  gracePeriodMonths: number = 6,
  monthlyPayment?: number
): number {
  const origDate = new Date(originationDate);
  const repaymentStartDate = new Date(origDate);
  repaymentStartDate.setMonth(repaymentStartDate.getMonth() + gracePeriodMonths);
  
  const currentDate = new Date('2025-01-15'); // Current date
  const monthsInRepayment = Math.max(0, 
    (currentDate.getFullYear() - repaymentStartDate.getFullYear()) * 12 + 
    (currentDate.getMonth() - repaymentStartDate.getMonth())
  );
  
  // If no monthly payment provided, calculate minimum payment for 120-month term
  const effectiveMonthlyPayment = monthlyPayment || (principal / 120);
  
  // Calculate balance using compound interest formula
  // Balance = Principal * (1 + monthly_rate)^months - Payment * ((1 + monthly_rate)^months - 1) / monthly_rate
  const monthlyRate = apr / 100 / 12;
  
  if (monthlyRate === 0) {
    // No interest case
    return Math.max(0, principal - (effectiveMonthlyPayment * monthsInRepayment));
  }
  
  const balance = principal * Math.pow(1 + monthlyRate, monthsInRepayment) - 
    effectiveMonthlyPayment * (Math.pow(1 + monthlyRate, monthsInRepayment) - 1) / monthlyRate;
  
  return Math.max(0, balance);
}

// Calculate Jasmine's net monthly income from $68K salary
function calculateNetMonthlyIncome(): number {
  const annualSalary = 68000;
  const monthlyGross = annualSalary / 12; // $5,666.67
  
  // Federal taxes (22% bracket for $68K)
  const federalTax = monthlyGross * 0.22; // ~$1,246.67
  
  // State taxes (Minnesota ~5.35%)
  const stateTax = monthlyGross * 0.0535; // ~$303.17
  
  // FICA (Social Security + Medicare)
  const fica = monthlyGross * 0.0765; // ~$433.50
  
  // Health insurance (employer-sponsored, ~$200/month)
  const healthInsurance = 200;
  
  // 401K contribution (6% of salary)
  const retirement401k = monthlyGross * 0.06; // ~$340
  
  // Calculate net monthly income
  const netMonthly = monthlyGross - federalTax - stateTax - fica - healthInsurance - retirement401k;
  
  return Math.round(netMonthly); // ~$3,143
}

// Jasmine's user profile based on the data
export const jasmineProfile = {
  ageRange: '25-34',
  mainGoals: ['pay_down_debt', 'save_big_goal'],
  topPriority: 'pay_down_debt',
  timeline: 'mid',
  comfortLevel: 'moderate',
  primaryGoalAccountId: 'jasmine-1' // Link to the Wedding Fund savings account
};

// Get Jasmine's transactions for analysis
export function getJasmineTransactions() {
  const checkingAccount = jasmineData.override_accounts.find(
    account => account.type === 'depository' && account.subtype === 'checking'
  );
  return checkingAccount?.transactions || [];
}

// Transform Jasmine's transactions to our Transaction interface
export function transformJasmineTransactions() {
  const checkingAccount = jasmineData.override_accounts.find(
    account => account.type === 'depository' && account.subtype === 'checking'
  );
  
  if (!checkingAccount?.transactions) return [];
  
  return checkingAccount.transactions.map((transaction, index) => ({
    id: `jasmine-tx-${index}`,
    account_id: 'jasmine-0', // Jasmine's checking account ID
    plaid_transaction_id: `plaid-${index}`,
    amount: transaction.amount,
    date: transaction.date_transacted,
    name: transaction.description,
    merchant_name: transaction.description,
    category: ['food_and_drink'], // Default category
    created_at: new Date().toISOString()
  }));
}

// Jasmine's financial summary for display
export const jasmineFinancialSummary = {
  annualSalary: 68000,
  monthlyGross: 5667,
  monthlyNet: calculateNetMonthlyIncome(),
  deductions: {
    federalTax: 1247,
    stateTax: 303,
    fica: 434,
    healthInsurance: 200,
    retirement401k: 340
  },
  totalDeductions: 2524
};
