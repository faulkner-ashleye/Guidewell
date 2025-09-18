import { Account } from './AppStateContext';
import { Transaction } from '../lib/supabase';

// Strategy scope
export type Scope = 'all' | 'debts' | 'savings' | 'investing';
export type Strat = 'debt_crusher' | 'goal_keeper' | 'nest_builder';

type Inputs = {
  accounts: Account[];
  transactions?: Transaction[];        // optional, improves estimate
  goalsMonthly?: number;       // optional sum of goal monthly contributions user set
  lookbackDays?: number;       // default 60
};

/** Main entry: infer baseline for current scope/strategy */
export function estimateBaselineMonthly(
  scope: Scope,
  strategy: Strat,
  { accounts, transactions = [], goalsMonthly = 0, lookbackDays = 60 }: Inputs
): number {
  // 1) Quick path by scope
  if (scope === 'debts')   return estimateDebtsMonthly(accounts, transactions, lookbackDays);
  if (scope === 'savings') return estimateSavingsMonthly(accounts, transactions, goalsMonthly, lookbackDays);
  if (scope === 'investing') return estimateInvestingMonthly(accounts, transactions, goalsMonthly, lookbackDays);

  // 2) 'all' → weighted by chosen strategy focus
  // MVP: use debts baseline if strategy is debt_crusher; savings if goal_keeper; investing if nest_builder
  switch (strategy) {
    case 'debt_crusher':  return estimateDebtsMonthly(accounts, transactions, lookbackDays);
    case 'goal_keeper':   return estimateSavingsMonthly(accounts, transactions, goalsMonthly, lookbackDays);
    case 'nest_builder':  return estimateInvestingMonthly(accounts, transactions, goalsMonthly, lookbackDays);
  }
}

/** Debt: min payments + recent observed payments (credit_card + loan) */
function estimateDebtsMonthly(accounts: Account[], txns: Transaction[], lookbackDays: number) {
  const minSum = accounts
    .filter(a => a.type === 'loan' || a.type === 'credit_card')
    .reduce((s, a) => s + (a.minPayment ?? 0), 0);

  const observed = sumMonthlyOutflow(txns, ['loan', 'credit_card'], accounts, lookbackDays);
  // prefer observed if we have it, else min payments
  return round2(observed > 0 ? observed : minSum);
}

/** Savings: goal monthly + recent transfers into savings/checking earmarked for goals */
function estimateSavingsMonthly(accounts: Account[], txns: Transaction[], goalsMonthly: number, lookbackDays: number) {
  const observed = sumMonthlyInflow(txns, ['savings'], accounts, lookbackDays);
  // prefer explicit goals monthly if provided; otherwise observed inflows
  return round2(goalsMonthly > 0 ? goalsMonthly : observed);
}

/** Investing: goal monthly + recent inflows to investment accounts */
function estimateInvestingMonthly(accounts: Account[], txns: Transaction[], goalsMonthly: number, lookbackDays: number) {
  const observed = sumMonthlyInflow(txns, ['investment'], accounts, lookbackDays);
  return round2(goalsMonthly > 0 ? goalsMonthly : observed);
}

/** Helpers */
function sumMonthlyOutflow(txns: Transaction[], accountTypes: Account['type'][], accounts: Account[], lookbackDays: number) {
  const cutoff = dayOffset(-lookbackDays);
  const set = new Set(accounts.filter(a => accountTypes.includes(a.type)).map(a => a.id));
  const recent = txns.filter(t => t.date >= cutoff && (t.account_id ? set.has(t.account_id) : true));
  const total = recent.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  // scale to per-month (assume 30-day month)
  const days = Math.max(1, daysBetween(cutoff, todayISO()));
  return (total / days) * 30;
}

function sumMonthlyInflow(txns: Transaction[], accountTypes: Account['type'][], accounts: Account[], lookbackDays: number) {
  const cutoff = dayOffset(-lookbackDays);
  const set = new Set(accounts.filter(a => accountTypes.includes(a.type)).map(a => a.id));
  const recent = txns.filter(t => t.date >= cutoff && (t.account_id ? set.has(t.account_id) : true));
  const total = recent.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const days = Math.max(1, daysBetween(cutoff, todayISO()));
  return (total / days) * 30;
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function dayOffset(delta: number) { const d = new Date(); d.setDate(d.getDate() + delta); return d.toISOString().slice(0, 10); }
function daysBetween(a: string, b: string) { return Math.ceil((+new Date(b) - +new Date(a)) / (1000 * 60 * 60 * 24)); }
function round2(n: number) { return Math.round((n + Number.EPSILON) * 100) / 100; }
