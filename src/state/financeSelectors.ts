import { Account } from './AppStateContext';

export type Txn = { id: string; date: string; description: string; amount: number; accountId?: string };

export function sumBalances(accts: Account[], types: Account['type'][]): number {
  return accts.filter(a => types.includes(a.type)).reduce((s, a) => s + (a.balance || 0), 0);
}

export function groupAccountsByType(accts: Account[]) {
  return accts.reduce((g, a) => {
    (g[a.type] ||= []).push(a);
    return g;
  }, {} as Record<Account['type'], Account[]>);
}

export function formatMoney(n: number, maxFrac = 0) {
  return new Intl.NumberFormat(undefined, { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: maxFrac 
  }).format(n || 0);
}

// Create a simple time series for Assets (checking+savings+investments) and Debts (credit_card+loan).
// If you don't have history, synthesize the last 8 weeks from current balances (flat).
export function buildNetWorthSeries(
  accts: Account[],
  txns: Txn[] = [],
  days = 56
): Array<{ date: string; assets: number; debts: number; net: number }> {
  const assetsNow = sumBalances(accts, ['checking', 'savings', 'investment']);
  const debtsNow  = sumBalances(accts, ['credit_card', 'loan']);
  const today = new Date();

  // Generate realistic variation if no transaction history
  const hasTransactionHistory = txns.length > 0;
  
  // Basic daily series (oldest → newest)
  const series: Array<{ date: string; assets: number; debts: number; net: number }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    let assets = assetsNow;
    let debts = debtsNow;
    
    // If no transaction history, generate realistic variation
    if (!hasTransactionHistory && (assetsNow > 0 || debtsNow > 0)) {
      // Create a trend that shows gradual improvement over time
      const progressRatio = i / (days - 1); // 0 = oldest, 1 = newest
      
      // Assets: gradually increase (savings growth, investments)
      if (assetsNow > 0) {
        const assetVariation = assetsNow * 0.15; // ±15% variation
        const trendFactor = 1 + (progressRatio * 0.1); // 10% improvement over time
        const randomFactor = 0.85 + (Math.sin(i * 0.3) * 0.3); // Smooth variation
        assets = Math.max(0, assetsNow * trendFactor * randomFactor);
      }
      
      // Debts: gradually decrease (debt payoff)
      if (debtsNow > 0) {
        const debtVariation = debtsNow * 0.1; // ±10% variation
        const trendFactor = 1 - (progressRatio * 0.15); // 15% reduction over time
        const randomFactor = 0.9 + (Math.sin(i * 0.2) * 0.2); // Smooth variation
        debts = Math.max(0, debtsNow * trendFactor * randomFactor);
      }
    }
    
    series.push({
      date: d.toISOString().slice(0, 10),
      assets: Math.round(assets),
      debts: Math.round(debts),
      net: Math.round(assets - debts),
    });
  }

  // Optional naive adjustment from transactions: apply amounts to assets for rough "drift"
  // (If your data links txns to accounts with type, you can improve this later.)
  const dated = [...txns].sort((a, b) => (a.date > b.date ? 1 : -1));
  for (const t of dated) {
    const idx = series.findIndex(p => p.date >= t.date);
    if (idx >= 0) {
      for (let j = idx; j < series.length; j++) {
        // Treat positive as asset inflow; negative as outflow; keep debts flat (MVP).
        series[j].assets += t.amount;
        series[j].net = series[j].assets - series[j].debts;
      }
    }
  }
  return series;
}

// Mini 7-point sparkline for each account (flat series if no history)
export function buildSparkline(balance: number, points = 7): number[] {
  return Array.from({ length: points }, () => balance);
}

// Simple health flags
export function accountHealth(a: Account): 'ok' | 'warn' | 'alert' {
  if (a.type === 'credit_card' && a.apr && a.apr > 20) return 'warn';
  if (a.type === 'checking' && a.balance < 100) return 'warn';
  if (a.type === 'loan' && a.minPayment === 0) return 'warn';
  return 'ok';
}







