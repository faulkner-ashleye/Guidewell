import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Goal, Account } from '../app/types';
import { Transaction } from '../lib/supabase';
import { Contribution } from './activitySelectors';
import { EnhancedUserProfile, UserProfileUtils } from '../data/enhancedUserProfile';
import { ValidationUtils } from '../utils/validation';
import { OpportunityDetection } from '../data/marketData';
import { sampleScenarios, SampleScenario } from '../data/sampleScenarios';
import { resetInsightsDismissal } from '../hooks/useInsightsCount';
import { resetPlaidGlobalState } from '../hooks/usePlaidLinkSingleton';

export type AccountType = 
  // Depository accounts
  | 'checking' | 'savings' | 'money_market' | 'cd' | 'cash_management' | 'prepaid' | 'hsa' | 'gic'
  // Credit accounts  
  | 'credit_card' | 'line_of_credit' | 'overdraft'
  // Investment accounts
  | '401a' | '401k' | '403b' | '457b' | '529' | 'brokerage' | 'esa' | 'ira' | 'isa' | 'lira' | 'rif' | 'rsp' | 'pension' | 'profit_sharing' | 'roth_ira' | 'roth_401k' | 'sep_ira' | 'simple_ira' | 'sipp' | 'stock_plan' | 'tsp' | 'tfsa' | 'custodial' | 'variable_annuity'
  // Loan accounts
  | 'auto' | 'commercial' | 'construction' | 'consumer' | 'home_equity' | 'mortgage' | 'student'
  // Legacy/fallback types
  | 'loan' | 'investment' | 'debt';

// Re-export Account from types for compatibility
export type { Account } from '../app/types';

export interface UserProfile {
  name?: string;
  firstName?: string;  // Keep for backward compatibility
  lastName?: string;   // Keep for backward compatibility
  ageRange?: string;
  mainGoals: string[];
  topPriority?: string;
  timeline?: string;
  comfortLevel?: string;
  primaryGoalAccountId?: string; // ID of account linked to primary goal
  hasSampleData?: boolean; // Flag to indicate if sample data was loaded
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  financialLiteracy?: 'beginner' | 'intermediate' | 'advanced';
  // AI Coaching Preferences
  aiPersonality?: 'encouraging' | 'analytical' | 'casual' | 'professional';
  communicationStyle?: 'detailed' | 'concise' | 'visual';
  detailLevel?: 'high' | 'medium' | 'low';
  preferredLanguage?: 'simple' | 'technical' | 'mixed';
}

export interface StrategyAllocation {
  debtPct: number;
  savingsPct: number;
  investPct: number;
}

export interface StrategyConfig {
  scope: 'all' | 'debts' | 'savings' | 'investments' | 'single';
  preset?: 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'balanced_climb';
  targetTimeline: 'short' | 'mid' | 'long';
  extraContribution: number;
  allocation: StrategyAllocation;
  singleAccountId?: string;
}

interface AppStateContextType {
  accounts: Account[];
  goals: Goal[];
  transactions: Transaction[];
  contributions: Contribution[];
  userProfile: UserProfile | null;
  strategyConfig: StrategyConfig;
  // Enhanced foundation features (non-breaking additions)
  enhancedUserProfile: EnhancedUserProfile | null;
  opportunities: any[] | null;
  validationErrors: string[] | null;
  currentScenario: SampleScenario | null;
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
  setUserProfile: (userProfile: UserProfile | null) => void;
  setStrategyConfig: (strategyConfig: StrategyConfig) => void;
  clearSampleData: () => void;
  logout: () => void;
  loadSampleScenario: (scenarioId: string) => void;
  // New foundation methods
  validateData: () => boolean;
  detectOpportunities: () => void;
  enrichUserProfile: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const defaultStrategyConfig: StrategyConfig = {
  scope: 'all',
  targetTimeline: 'mid',
  extraContribution: 0,
  allocation: {
    debtPct: 0,
    savingsPct: 0,
    investPct: 0
  }
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [strategyConfig, setStrategyConfig] = useState<StrategyConfig>(defaultStrategyConfig);
  
  // Enhanced foundation state (non-breaking additions)
  const [enhancedUserProfile, setEnhancedUserProfile] = useState<EnhancedUserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<any[] | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);
  const [currentScenario, setCurrentScenario] = useState<SampleScenario | null>(null);
  const [hasLoadedDefaultScenario, setHasLoadedDefaultScenario] = useState(false);

  const loadSampleScenario = (scenarioId: string) => {
    const scenario = sampleScenarios[scenarioId];
    if (!scenario) {
      console.error(`Sample scenario '${scenarioId}' not found`);
      return;
    }

    // Clear existing data first to prevent mixing scenarios
    setAccounts([]);
    setGoals([]);
    setTransactions([]);
    setContributions([]);

    // Set the current scenario
    setCurrentScenario(scenario);

    // Convert scenario data to app state format
    const convertedAccounts: Account[] = scenario.accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      apr: account.interestRate, // Map interestRate to apr field
      monthlyContribution: account.monthlyContribution
    }));

    const convertedGoals: Goal[] = scenario.goals.map(goal => ({
      id: goal.id,
      name: goal.name,
      type: goal.type,
      target: goal.target,
      accountId: goal.accountId,
      accountIds: goal.accountIds,
      targetDate: goal.targetDate,
      priority: goal.priority,
      note: goal.note,
      createdAt: goal.createdAt
    }));

    // Preserve user's real profile data and only update sample data flag
    setUserProfile(prevProfile => {
      if (!prevProfile) {
        // If no profile exists, create a minimal one with just the sample data flag
        return {
          mainGoals: [],
          hasSampleData: true
        };
      }
      return {
        ...prevProfile, // Keep all existing user data
        hasSampleData: true // Only update the sample data flag
      };
    });

    // Load the scenario data (accounts, goals, transactions)
    setAccounts(convertedAccounts);
    setGoals(convertedGoals);
    setTransactions(scenario.transactions);
    setContributions([]);

    // Reset insights dismissal state when switching personas
    // This ensures the badge reappears for new insights in the new scenario
    resetInsightsDismissal();
  };

  // Load default sample scenario on app start
  useEffect(() => {
    // Only load sample data if no accounts are present, no user profile exists, and we haven't loaded a default scenario yet
    if (accounts.length === 0 && !userProfile && !hasLoadedDefaultScenario) {
      // Load the "recentGrad" scenario by default to show realistic activity
      loadSampleScenario('recentGrad');
      setHasLoadedDefaultScenario(true);
    }
  }, []); // Empty dependency array means this runs once on mount

  const clearSampleData = () => {
    // Show a more user-friendly notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 400px;
      font-family: 'FigTree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 24px; margin-right: 12px;">🎉</span>
        <strong style="font-size: 16px;">Welcome to your real data!</strong>
      </div>
      <p style="margin: 0 0 12px 0;">We've cleared the sample data so you can see your personal financial picture.</p>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Your accounts, goals, and transactions will now be displayed with Guidewell's personalized guidance.</p>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, 5000);
    
    // Clear all sample data when user adds their own accounts
    setAccounts([]);
    setGoals([]);
    setTransactions([]);
    setContributions([]);
    setCurrentScenario(null);
    setHasLoadedDefaultScenario(false); // Reset the default scenario flag
    // Clear the hasSampleData flag but preserve other user profile data
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        hasSampleData: false
      });
    }
  };

  const logout = () => {
    // Clear all user data and reset to initial state
    setAccounts([]);
    setGoals([]);
    setTransactions([]);
    setContributions([]);
    setUserProfile(null);
    setStrategyConfig({
      scope: 'all',
      targetTimeline: 'mid',
      extraContribution: 0,
      allocation: {
        debtPct: 0,
        savingsPct: 0,
        investPct: 0
      }
    });
    
    // Reset Plaid global state to fix connection issues after logout
    resetPlaidGlobalState();
    
    // Reset scenario flags
    setCurrentScenario(null);
    setHasLoadedDefaultScenario(false);
    
    // Clear any stored data from localStorage
    localStorage.removeItem('guidewell-user-profile');
    localStorage.removeItem('guidewell-accounts');
    localStorage.removeItem('guidewell-goals');
    localStorage.removeItem('guidewell-transactions');
    localStorage.removeItem('guidewell-contributions');
    localStorage.removeItem('guidewell-strategy-config');
  };

  // Foundation methods (non-breaking additions)
  const validateData = (): boolean => {
    try {
      const validation = ValidationUtils.validateFinancialData({
        accounts,
        goals,
        userProfile
      });
      
      if (validation.success) {
        setValidationErrors(null);
        return true;
      } else {
        setValidationErrors(validation.errorMessages || []);
        return false;
      }
    } catch (error) {
      setValidationErrors(['Validation error occurred']);
      return false;
    }
  };

  const detectOpportunities = () => {
    if (accounts.length > 0 && userProfile) {
      try {
        const analysis = OpportunityDetection.analyzeOpportunities(accounts, userProfile);
        setOpportunities(analysis.opportunities);
      } catch (error) {
        console.error('Error detecting opportunities:', error);
        setOpportunities([]);
      }
    }
  };

  const enrichUserProfile = () => {
    if (userProfile) {
      try {
        const enriched = {
          id: crypto.randomUUID(),
          firstName: userProfile.firstName,
          riskTolerance: 'moderate' as const,
          financialLiteracy: 'beginner' as const,
          mainGoals: userProfile.mainGoals,
          communicationStyle: 'detailed' as const,
          notificationFrequency: 'weekly' as const,
          preferredLanguage: 'simple' as const,
          aiPersonality: 'encouraging' as const,
          detailLevel: 'medium' as const,
          hasSampleData: userProfile.hasSampleData,
          onboardingCompleted: true
        };
        
        // Convert existing goals to the format expected by UserProfileUtils
        const convertedGoals = goals.map(goal => ({
          id: goal.id,
          name: goal.name,
          type: goal.type as any,
          target: goal.target,
          accountId: goal.accountId,
          accountIds: goal.accountIds,
          targetDate: goal.targetDate || new Date().toISOString().split('T')[0],
          priority: goal.priority || 'medium',
          note: goal.note,
          createdAt: goal.createdAt
        }));
        
        const enhanced = UserProfileUtils.enrichProfile(enriched, accounts, convertedGoals);
        setEnhancedUserProfile(enhanced);
      } catch (error) {
        console.error('Error enriching user profile:', error);
      }
    }
  };

  const value: AppStateContextType = {
    accounts,
    goals,
    transactions,
    contributions,
    userProfile,
    strategyConfig,
    // Enhanced foundation features
    enhancedUserProfile,
    opportunities,
    validationErrors,
    currentScenario,
    setAccounts,
    setGoals,
    setTransactions,
    setContributions,
    setUserProfile,
    setStrategyConfig,
    clearSampleData,
    logout,
    loadSampleScenario,
    // Foundation methods
    validateData,
    detectOpportunities,
    enrichUserProfile
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}