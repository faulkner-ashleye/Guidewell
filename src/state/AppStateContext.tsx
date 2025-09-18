import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Goal, Account } from '../app/types';
import { Transaction } from '../lib/supabase';
import { Contribution } from './activitySelectors';
import { EnhancedUserProfile, UserProfileUtils } from '../data/enhancedUserProfile';
import { ValidationUtils } from '../utils/validation';
import { OpportunityDetection } from '../data/marketData';

export type AccountType = 'loan' | 'credit_card' | 'savings' | 'checking' | 'investment';

// Re-export Account from types for compatibility
export type { Account } from '../app/types';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  ageRange?: string;
  mainGoals: string[];
  topPriority?: string;
  timeline?: string;
  comfortLevel?: string;
  primaryGoalAccountId?: string; // ID of account linked to primary goal
  hasSampleData?: boolean; // Flag to indicate if sample data was loaded
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
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>;
  setUserProfile: (userProfile: UserProfile | null) => void;
  setStrategyConfig: (strategyConfig: StrategyConfig) => void;
  clearSampleData: () => void;
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

  const clearSampleData = () => {
    // Clear all sample data when user adds their own accounts
    setAccounts([]);
    setGoals([]);
    setTransactions([]);
    setContributions([]);
    // Clear the hasSampleData flag but preserve other user profile data
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        hasSampleData: false
      });
    }
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
          targetAmount: goal.target,
          currentAmount: 0, // We don't track current amount in the existing system
          targetDate: goal.targetDate || new Date().toISOString().split('T')[0],
          priority: goal.priority || 'medium'
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
    setAccounts,
    setGoals,
    setTransactions,
    setContributions,
    setUserProfile,
    setStrategyConfig,
    clearSampleData,
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