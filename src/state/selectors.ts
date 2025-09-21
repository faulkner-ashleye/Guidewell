import { Account } from './AppStateContext';

/** totals */
export function sumByType(accts: Account[], include: Account['type'][]): number {
  return accts.filter(a => include.includes(a.type)).reduce((s,a)=>s+(a.balance||0),0);
}

export function getPrimaryGoal(accts: Account[], userProfile?: { primaryGoalAccountId?: string }){
  // First try to find the account linked to primary goal
  let goal = null;
  if (userProfile?.primaryGoalAccountId) {
    goal = accts.find(a => a.id === userProfile.primaryGoalAccountId);
  }
  
  // Fallback to first savings account with goalTarget
  if (!goal) {
    goal = accts.find(a => a.type==='savings' && typeof a.goalTarget==='number' && a.goalTarget!>0);
  }
  
  if(!goal) return null;
  const pct = Math.max(0, Math.min(100, Math.floor((goal.balance/goal.goalTarget!)*100)));
  return { 
    id: goal.id,
    name: goal.name, 
    current: goal.balance, 
    target: goal.goalTarget!, 
    percent: pct 
  };
}

export function getRecentTransactions(tx: any[] = [], n=5){
  return [...tx].sort((a,b)=> (b.date?.localeCompare?.(a.date) ?? 0)).slice(0,n);
}

export function getHighestAPR(accts: Account[]): number | null {
  const creditCards = accts.filter(a => a.type === 'credit_card' && a.apr);
  if (creditCards.length === 0) return null;
  return Math.max(...creditCards.map(a => a.apr!));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function inferGoalsFromAccounts(accounts: Account[]): string[] {
  const goals: string[] = [];
  
  // Check for debt (credit cards or loans)
  const hasDebt = accounts.some(a => a.type === 'credit_card' || a.type === 'loan');
  if (hasDebt) {
    goals.push('pay_down_debt');
  }
  
  // Check for savings accounts
  const hasSavings = accounts.some(a => a.type === 'savings');
  if (hasSavings) {
    goals.push('save_big_goal');
  }
  
  // Check for checking accounts (emergency fund potential)
  const hasChecking = accounts.some(a => a.type === 'checking');
  if (hasChecking) {
    goals.push('build_emergency');
  }
  
  // Check for investment accounts
  const hasInvestment = accounts.some(a => a.type === 'investment');
  if (hasInvestment) {
    goals.push('start_investing');
  }
  
  return goals;
}