import { MarketBenchmarks, Opportunity, OpportunityAnalysis } from '../data/marketData';

// Market data service for real-time updates and API integration
export class MarketDataService {
  private static instance: MarketDataService;
  private marketData: MarketBenchmarks | null = null;
  private lastUpdated: Date | null = null;
  private updateInterval: number = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {}

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  /**
   * Get current market data with caching
   */
  async getMarketData(): Promise<MarketBenchmarks> {
    if (this.shouldUpdateMarketData()) {
      await this.updateMarketData();
    }
    return this.marketData!;
  }

  /**
   * Check if market data needs updating
   */
  private shouldUpdateMarketData(): boolean {
    if (!this.marketData || !this.lastUpdated) return true;
    const now = new Date();
    const timeDiff = now.getTime() - this.lastUpdated.getTime();
    return timeDiff > this.updateInterval;
  }

  /**
   * Update market data from external sources
   */
  private async updateMarketData(): Promise<void> {
    try {
      // In a real implementation, this would fetch from financial APIs
      // For now, we'll simulate with realistic market data updates
      const updatedData = await this.fetchMarketDataFromAPI();
      this.marketData = updatedData;
      this.lastUpdated = new Date();
      
      // Store in localStorage for persistence
      localStorage.setItem('marketData', JSON.stringify({
        data: this.marketData,
        timestamp: this.lastUpdated.toISOString()
      }));
    } catch (error) {
      console.error('Failed to update market data:', error);
      // Fallback to cached data or default data
      this.loadCachedMarketData();
    }
  }

  /**
   * Simulate API call to fetch market data
   * In production, this would integrate with financial data providers
   */
  private async fetchMarketDataFromAPI(): Promise<MarketBenchmarks> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate realistic market data variations
    const baseData = {
      savingsAccounts: {
        nationalAverage: 0.46 + (Math.random() - 0.5) * 0.1,
        highYield: 4.5 + (Math.random() - 0.5) * 0.5,
        onlineBanks: 4.2 + (Math.random() - 0.5) * 0.3,
        moneyMarket: 4.8 + (Math.random() - 0.5) * 0.4
      },
      creditCards: {
        averageAPR: 20.75 + (Math.random() - 0.5) * 1.0,
        balanceTransfer: 0, // Promotional rate
        rewards: 18.5 + (Math.random() - 0.5) * 0.8,
        secured: 22.5 + (Math.random() - 0.5) * 1.2
      },
      investments: {
        sp500AverageReturn: 10.5 + (Math.random() - 0.5) * 2.0,
        bondAverageReturn: 3.5 + (Math.random() - 0.5) * 0.5,
        inflationRate: 3.2 + (Math.random() - 0.5) * 0.3,
        treasuryBill: 4.8 + (Math.random() - 0.5) * 0.4
      },
      loans: {
        mortgageRates: {
          thirtyYear: 7.2 + (Math.random() - 0.5) * 0.5,
          fifteenYear: 6.8 + (Math.random() - 0.5) * 0.4,
          arm: 6.5 + (Math.random() - 0.5) * 0.3
        },
        autoLoanRates: {
          new: 7.8 + (Math.random() - 0.5) * 0.6,
          used: 8.2 + (Math.random() - 0.5) * 0.7,
          excellent: 6.5 + (Math.random() - 0.5) * 0.4,
          fair: 9.5 + (Math.random() - 0.5) * 0.8
        },
        personalLoanRates: {
          excellent: 8.5 + (Math.random() - 0.5) * 0.6,
          good: 11.5 + (Math.random() - 0.5) * 0.8,
          fair: 15.5 + (Math.random() - 0.5) * 1.0
        },
        studentLoanRates: {
          federal: 5.5 + (Math.random() - 0.5) * 0.3,
          private: 7.8 + (Math.random() - 0.5) * 0.5
        }
      },
      cds: {
        oneYear: 4.8 + (Math.random() - 0.5) * 0.4,
        threeYear: 4.5 + (Math.random() - 0.5) * 0.3,
        fiveYear: 4.2 + (Math.random() - 0.5) * 0.3
      }
    };

    return baseData;
  }

  /**
   * Load cached market data from localStorage
   */
  private loadCachedMarketData(): void {
    try {
      const cached = localStorage.getItem('marketData');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.marketData = parsed.data;
        this.lastUpdated = new Date(parsed.timestamp);
      }
    } catch (error) {
      console.error('Failed to load cached market data:', error);
    }
  }

  /**
   * Get market data for specific account type
   */
  async getMarketRate(accountType: string, subtype?: string): Promise<number> {
    const marketData = await this.getMarketData();
    
    switch (accountType) {
      case 'savings':
        return marketData.savingsAccounts.highYield;
      case 'credit_card':
        return marketData.creditCards.averageAPR;
      case 'loan':
        if (subtype === 'auto') return marketData.loans.autoLoanRates.new;
        if (subtype === 'personal') return marketData.loans.personalLoanRates.good;
        if (subtype === 'student') return marketData.loans.studentLoanRates.federal;
        return marketData.loans.personalLoanRates.good;
      case 'mortgage':
        return marketData.loans.mortgageRates.thirtyYear;
      case 'cd':
        return marketData.cds.oneYear;
      default:
        return 0;
    }
  }

  /**
   * Check if a rate is competitive compared to market
   */
  async isCompetitiveRate(accountType: string, currentRate: number, subtype?: string): Promise<boolean> {
    const marketRate = await this.getMarketRate(accountType, subtype);
    const tolerance = marketRate * 0.1; // Within 10% of market rate
    return Math.abs(currentRate - marketRate) <= tolerance;
  }

  /**
   * Calculate opportunity cost of not having optimal rate
   */
  async calculateOpportunityCost(
    accountType: string, 
    currentRate: number, 
    balance: number, 
    subtype?: string
  ): Promise<number> {
    const marketRate = await this.getMarketRate(accountType, subtype);
    return balance * (marketRate - currentRate) / 100;
  }

  /**
   * Get market trends for specific account type
   */
  async getMarketTrends(accountType: string): Promise<{
    current: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
    recommendation: string;
  }> {
    const currentRate = await this.getMarketRate(accountType);
    
    // Simulate trend analysis (in production, this would use historical data)
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const change = (Math.random() - 0.5) * 0.5; // ±0.25% change
    
    let recommendation = '';
    if (trend === 'up') {
      recommendation = 'Rates are rising - consider locking in rates soon';
    } else if (trend === 'down') {
      recommendation = 'Rates are falling - you might wait for better rates';
    } else {
      recommendation = 'Rates are stable - good time to shop around';
    }

    return {
      current: currentRate,
      trend,
      change,
      recommendation
    };
  }

  /**
   * Force refresh market data
   */
  async refreshMarketData(): Promise<void> {
    this.lastUpdated = null;
    await this.updateMarketData();
  }

  /**
   * Get last update timestamp
   */
  getLastUpdateTime(): Date | null {
    return this.lastUpdated;
  }

  /**
   * Check if market data is stale
   */
  isMarketDataStale(): boolean {
    return this.shouldUpdateMarketData();
  }
}

// Export singleton instance
export const marketDataService = MarketDataService.getInstance();
