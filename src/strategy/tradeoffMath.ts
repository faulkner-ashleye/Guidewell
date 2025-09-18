// Time helpers
export function monthsFor(timeframe: 'short' | 'mid' | 'long') {
  return timeframe === 'short' ? 12 : timeframe === 'mid' ? 60 : 120;
}

// Basic future value of a monthly contribution at monthly rate r
export function futureValueMonthly(monthly: number, annualReturn = 0.06, months: number) {
  const r = annualReturn / 12;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r);
}

// Delay to reach a savings goal if monthly contribution changes
export function monthsToReach(target: number, current: number, monthly: number) {
  if (monthly <= 0) return Infinity;
  const remaining = Math.max(0, target - current);
  return Math.ceil(remaining / monthly);
}

// Simple "additional principal reduced" approximation
// We assume extra dollars allocated to debt go 1:1 to principal reduction over the period.
// (Interest timing effects ignored for MVP; copy must call this an estimate.)
export function extraPrincipalReduced(extraMonthlyToDebt: number, months: number) {
  return extraMonthlyToDebt * months;
}

// Compute an "opportunity cost" of NOT investing some monthly amount
export function investingOpportunityCost(missedMonthly: number, months: number, annualReturn = 0.06) {
  return futureValueMonthly(missedMonthly, annualReturn, months);
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage for display
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

// Humanize months to readable format
export function humanizeMonths(months: number): string {
  if (months === Infinity) return 'never';
  if (months < 12) return `~${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `~${years} year${years > 1 ? 's' : ''}`;
  return `~${years} year${years > 1 ? 's' : ''} ${remainingMonths} months`;
}



