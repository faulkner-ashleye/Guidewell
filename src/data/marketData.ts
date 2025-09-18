// Market benchmarks and current rates for opportunity detection
export interface MarketBenchmarks {
  savingsAccounts: {
    nationalAverage: number;
    highYield: number;
    onlineBanks: number;
    moneyMarket: number;
  };
  creditCards: {
    averageAPR: number;
    balanceTransfer: number;
    rewards: number;
    secured: number;
  };
  investments: {
    sp500AverageReturn: number;
    bondAverageReturn: number;
    inflationRate: number;
    treasuryBill: number;
  };
  loans: {
    mortgageRates: {
      thirtyYear: number;
      fifteenYear: number;
      arm: number;
    };
    autoLoanRates: {
      new: number;
      used: number;
      excellent: number;
      fair: number;
    };
    personalLoanRates: {
      excellent: number;
      good: number;
      fair: number;
    };
    studentLoanRates: {
      federal: number;
      private: number;
    };
  };
  cds: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
}

// Current market data (updated regularly)
export const currentMarketData: MarketBenchmarks = {
  savingsAccounts: {
    nationalAverage: 0.46,
    highYield: 4.5,
    onlineBanks: 4.2,
    moneyMarket: 4.8
  },
  creditCards: {
    averageAPR: 20.75,
    balanceTransfer: 0, // Promotional rate
    rewards: 18.5,
    secured: 22.5
  },
  investments: {
    sp500AverageReturn: 10.5,
    bondAverageReturn: 3.5,
    inflationRate: 3.2,
    treasuryBill: 4.8
  },
  loans: {
    mortgageRates: {
      thirtyYear: 7.2,
      fifteenYear: 6.8,
      arm: 6.5
    },
    autoLoanRates: {
      new: 7.8,
      used: 8.2,
      excellent: 6.5,
      fair: 9.5
    },
    personalLoanRates: {
      excellent: 8.5,
      good: 11.5,
      fair: 15.5
    },
    studentLoanRates: {
      federal: 5.5,
      private: 7.8
    }
  },
  cds: {
    oneYear: 4.8,
    threeYear: 4.5,
    fiveYear: 4.2
  }
};

// Opportunity detection interfaces
export interface Opportunity {
  id: string;
  type: 'savings_rate' | 'balance_transfer' | 'debt_consolidation' | 'investment_allocation' | 'cd_upgrade' | 'refinance';
  accountId: string;
  accountName: string;
  currentValue: number;
  potentialValue: number;
  potentialSavings: number;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  actionRequired: string;
  estimatedImpact: string;
}

export interface OpportunityAnalysis {
  opportunities: Opportunity[];
  totalPotentialSavings: number;
  highImpactOpportunities: Opportunity[];
  quickWins: Opportunity[];
  summary: string;
}

// Opportunity detection utility class
export class OpportunityDetection {
  /**
   * Find savings account opportunities
   */
  static findSavingsOpportunities(accounts: any[]): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    accounts.forEach(account => {
      if (account.type === 'savings' && account.interestRate !== undefined) {
        const currentRate = account.interestRate;
        const highYieldRate = currentMarketData.savingsAccounts.highYield;
        
        if (highYieldRate > currentRate * 2) { // Significant improvement
          const annualSavings = (highYieldRate - currentRate) * account.balance / 100;
          
          opportunities.push({
            id: `savings-${account.id}`,
            type: 'savings_rate',
            accountId: account.id,
            accountName: account.name,
            currentValue: currentRate,
            potentialValue: highYieldRate,
            potentialSavings: annualSavings,
            description: `Your ${account.name} earns ${currentRate}% APY. High-yield savings accounts offer ${highYieldRate}% APY, potentially earning you $${annualSavings.toFixed(2)} more per year.`,
            confidence: 'high',
            timeframe: 'immediate',
            effort: 'low',
            risk: 'low',
            actionRequired: 'Open high-yield savings account and transfer funds',
            estimatedImpact: `$${annualSavings.toFixed(2)} additional annual earnings`
          });
        }
      }
    });
    
    return opportunities;
  }

  /**
   * Find credit card balance transfer opportunities
   */
  static findBalanceTransferOpportunities(accounts: any[]): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    accounts.forEach(account => {
      if (account.type === 'credit_card' && account.balance > 0 && account.interestRate) {
        const currentAPR = account.interestRate;
        const balanceTransferAPR = currentMarketData.creditCards.balanceTransfer;
        
        if (currentAPR > 15 && account.balance > 1000) { // Worth transferring
          const monthlyInterest = (currentAPR / 100 / 12) * account.balance;
          const transferMonthlyInterest = (balanceTransferAPR / 100 / 12) * account.balance;
          const monthlySavings = monthlyInterest - transferMonthlyInterest;
          const annualSavings = monthlySavings * 12;
          
          opportunities.push({
            id: `balance-transfer-${account.id}`,
            type: 'balance_transfer',
            accountId: account.id,
            accountName: account.name,
            currentValue: currentAPR,
            potentialValue: balanceTransferAPR,
            potentialSavings: annualSavings,
            description: `Your ${account.name} has a ${currentAPR}% APR. A 0% balance transfer could save you $${annualSavings.toFixed(2)} in interest over 12-18 months.`,
            confidence: 'high',
            timeframe: 'short_term',
            effort: 'medium',
            risk: 'low',
            actionRequired: 'Apply for 0% APR balance transfer card',
            estimatedImpact: `$${annualSavings.toFixed(2)} interest savings over promotional period`
          });
        }
      }
    });
    
    return opportunities;
  }

  /**
   * Find debt consolidation opportunities
   */
  static findDebtConsolidationOpportunities(accounts: any[]): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    const creditCards = accounts.filter(a => a.type === 'credit_card' && a.balance > 0);
    const personalLoans = accounts.filter(a => a.type === 'loan' && a.balance > 0);
    
    if (creditCards.length > 1) {
      const totalDebt = creditCards.reduce((sum, a) => sum + a.balance, 0);
      const averageAPR = creditCards.reduce((sum, a) => sum + (a.interestRate || 0), 0) / creditCards.length;
      const personalLoanRate = currentMarketData.loans.personalLoanRates.good;
      
      if (averageAPR > personalLoanRate + 5 && totalDebt > 5000) { // Significant savings
        const currentMonthlyInterest = (averageAPR / 100 / 12) * totalDebt;
        const consolidatedMonthlyInterest = (personalLoanRate / 100 / 12) * totalDebt;
        const monthlySavings = currentMonthlyInterest - consolidatedMonthlyInterest;
        const annualSavings = monthlySavings * 12;
        
        opportunities.push({
          id: 'debt-consolidation',
          type: 'debt_consolidation',
          accountId: 'multiple',
          accountName: 'Multiple Credit Cards',
          currentValue: averageAPR,
          potentialValue: personalLoanRate,
          potentialSavings: annualSavings,
          description: `Consolidating $${totalDebt.toLocaleString()} in credit card debt at ${averageAPR.toFixed(1)}% APR into a personal loan at ${personalLoanRate}% APR could save you $${annualSavings.toFixed(2)} annually.`,
          confidence: 'medium',
          timeframe: 'short_term',
          effort: 'high',
          risk: 'medium',
          actionRequired: 'Apply for personal loan to consolidate credit card debt',
          estimatedImpact: `$${annualSavings.toFixed(2)} annual interest savings`
        });
      }
    }
    
    return opportunities;
  }

  /**
   * Find investment allocation opportunities
   */
  static findInvestmentOpportunities(accounts: any[], userProfile: any): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    const savingsAccounts = accounts.filter(a => a.type === 'savings');
    const totalSavings = savingsAccounts.reduce((sum, a) => sum + a.balance, 0);
    
    // Check for over-allocation to low-yield savings
    if (totalSavings > 50000 && userProfile.riskTolerance !== 'conservative') {
      const excessSavings = totalSavings - 25000; // Keep $25k in savings
      const currentSavingsRate = 0.045; // 4.5% high-yield savings
      const potentialInvestmentReturn = userProfile.riskTolerance === 'aggressive' ? 0.085 : 0.065;
      const annualOpportunityCost = excessSavings * (potentialInvestmentReturn - currentSavingsRate);
      
      if (annualOpportunityCost > 1000) { // Worth considering
        opportunities.push({
          id: 'investment-allocation',
          type: 'investment_allocation',
          accountId: 'savings-accounts',
          accountName: 'Savings Accounts',
          currentValue: currentSavingsRate * 100,
          potentialValue: potentialInvestmentReturn * 100,
          potentialSavings: annualOpportunityCost,
          description: `You have $${excessSavings.toLocaleString()} in savings earning ${(currentSavingsRate * 100).toFixed(1)}%. Investing this could potentially earn ${(potentialInvestmentReturn * 100).toFixed(1)}% annually.`,
          confidence: 'medium',
          timeframe: 'long_term',
          effort: 'medium',
          risk: 'medium',
          actionRequired: 'Consider investing excess savings in diversified portfolio',
          estimatedImpact: `$${annualOpportunityCost.toFixed(2)} additional annual returns (potential)`
        });
      }
    }
    
    return opportunities;
  }

  /**
   * Find CD upgrade opportunities
   */
  static findCDOpportunities(accounts: any[]): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    // Check if user has large savings that could benefit from CDs
    const savingsAccounts = accounts.filter(a => a.type === 'savings');
    const totalSavings = savingsAccounts.reduce((sum, a) => sum + a.balance, 0);
    
    if (totalSavings > 10000) {
      const currentRate = 0.045; // High-yield savings
      const cdRate = currentMarketData.cds.oneYear;
      
      if (cdRate > currentRate + 0.5) { // CD offers significantly better rate
        const additionalEarnings = totalSavings * (cdRate - currentRate);
        
        opportunities.push({
          id: 'cd-upgrade',
          type: 'cd_upgrade',
          accountId: 'savings-accounts',
          accountName: 'Savings Accounts',
          currentValue: currentRate * 100,
          potentialValue: cdRate * 100,
          potentialSavings: additionalEarnings,
          description: `Moving $${totalSavings.toLocaleString()} from savings (${(currentRate * 100).toFixed(1)}%) to a 1-year CD (${cdRate.toFixed(1)}%) could earn an additional $${additionalEarnings.toFixed(2)} annually.`,
          confidence: 'high',
          timeframe: 'short_term',
          effort: 'low',
          risk: 'low',
          actionRequired: 'Open 1-year CD with excess savings',
          estimatedImpact: `$${additionalEarnings.toFixed(2)} additional annual earnings`
        });
      }
    }
    
    return opportunities;
  }

  /**
   * Comprehensive opportunity analysis
   */
  static analyzeOpportunities(accounts: any[], userProfile: any): OpportunityAnalysis {
    const allOpportunities = [
      ...this.findSavingsOpportunities(accounts),
      ...this.findBalanceTransferOpportunities(accounts),
      ...this.findDebtConsolidationOpportunities(accounts),
      ...this.findInvestmentOpportunities(accounts, userProfile),
      ...this.findCDOpportunities(accounts)
    ];

    const totalPotentialSavings = allOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);
    const highImpactOpportunities = allOpportunities.filter(opp => opp.potentialSavings > 500);
    const quickWins = allOpportunities.filter(opp => opp.effort === 'low' && opp.timeframe === 'immediate');

    const summary = this.generateOpportunitySummary(allOpportunities, totalPotentialSavings);

    return {
      opportunities: allOpportunities,
      totalPotentialSavings,
      highImpactOpportunities,
      quickWins,
      summary
    };
  }

  /**
   * Generate opportunity summary for AI
   */
  private static generateOpportunitySummary(opportunities: Opportunity[], totalSavings: number): string {
    if (opportunities.length === 0) {
      return "No significant financial opportunities detected at this time.";
    }

    const quickWins = opportunities.filter(o => o.effort === 'low' && o.timeframe === 'immediate');
    const highImpact = opportunities.filter(o => o.potentialSavings > 500);

    let summary = `Found ${opportunities.length} potential opportunities with $${totalSavings.toFixed(2)} in total annual savings. `;
    
    if (quickWins.length > 0) {
      summary += `${quickWins.length} quick wins available (low effort, immediate impact). `;
    }
    
    if (highImpact.length > 0) {
      summary += `${highImpact.length} high-impact opportunities identified (savings > $500/year). `;
    }

    summary += "Top opportunities include: ";
    summary += opportunities
      .sort((a, b) => b.potentialSavings - a.potentialSavings)
      .slice(0, 3)
      .map(o => `${o.type.replace('_', ' ')} ($${o.potentialSavings.toFixed(2)}/year)`)
      .join(', ');

    return summary;
  }
}

// Market data utilities
export class MarketDataUtils {
  /**
   * Get current rate for account type
   */
  static getCurrentRate(accountType: string, subtype?: string): number {
    switch (accountType) {
      case 'savings':
        return currentMarketData.savingsAccounts.highYield;
      case 'credit_card':
        return currentMarketData.creditCards.averageAPR;
      case 'loan':
        if (subtype === 'auto') return currentMarketData.loans.autoLoanRates.new;
        if (subtype === 'personal') return currentMarketData.loans.personalLoanRates.good;
        if (subtype === 'student') return currentMarketData.loans.studentLoanRates.federal;
        return currentMarketData.loans.personalLoanRates.good;
      default:
        return 0;
    }
  }

  /**
   * Check if rate is competitive
   */
  static isCompetitiveRate(accountType: string, currentRate: number): boolean {
    const marketRate = this.getCurrentRate(accountType);
    return Math.abs(currentRate - marketRate) <= marketRate * 0.1; // Within 10% of market rate
  }

  /**
   * Calculate opportunity cost
   */
  static calculateOpportunityCost(currentRate: number, betterRate: number, balance: number): number {
    return balance * (betterRate - currentRate) / 100;
  }
}
