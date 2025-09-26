import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePlaidLinkSingleton, resetPlaidGlobalState } from '../hooks/usePlaidLinkSingleton';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Icon, IconNames } from './Icon';
import { API_BASE_URL } from '../config/api';
import { mapPlaidAccountType } from '../utils/plaidAccountMapping';
import PlaidSandboxBanner from './PlaidSandboxBanner';
import './Button.css';

// Define PlaidLinkOptions type locally
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string) => void;
  onExit?: (err: any, metadata: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
}

type Props = {
  userId?: string;
  onSuccess: (data: any[] | { accounts: any[], transactions?: any[] }) => void;
  apiBase?: string; // defaults to environment-based API_BASE_URL
  autoOpen?: boolean; // automatically open Plaid Link when ready
  hidden?: boolean; // hide the button and only expose via ref
  plaidOpenRequested?: boolean; // trigger to open Plaid
  instanceId?: string; // identifier for debugging
};

export default function PlaidLinkButton({ userId = 'demo-user-123', onSuccess, apiBase = API_BASE_URL, autoOpen = false, hidden = false, plaidOpenRequested = false, instanceId = 'unknown' }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializing = useRef(false);
  
  // Banner state
  const [showBanner, setShowBanner] = useState(false);
  const [bannerStep, setBannerStep] = useState<'initial' | 'login' | 'success'>('initial');

  // Reset global Plaid state on mount to prevent auto-initialization
  useEffect(() => {
    resetPlaidGlobalState();
  }, []);

  const handleSuccess = useCallback(async (public_token: string) => {
    try {
      console.log('Plaid Link success, public token:', public_token);
      
      // For development with mock tokens, provide sample data
      if (public_token.startsWith('public-sandbox-mock') || linkToken?.startsWith('link-sandbox-mock')) {
        console.log('Using mock data for development');
        const mockAccounts = [
          {
            id: 'mock-checking-1',
            name: 'Chase Total Checking',
            type: 'checking',
            balance: 2450.75,
            institutionId: 'chase',
            institutionName: 'Chase Bank'
          },
          {
            id: 'mock-credit-1',
            name: 'Chase Freedom Credit Card',
            type: 'credit_card',
            balance: -1250.30,
            apr: 24.99, // High APR to trigger debt insights
            institutionId: 'chase',
            institutionName: 'Chase Bank'
          }
        ];
        
        const mockTransactions = [
          {
            id: 'mock-txn-1',
            account_id: 'mock-checking-1',
            amount: -45.50,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            name: 'Coffee Shop',
            description: 'Coffee Shop',
            category: ['Food and Drink', 'Restaurants'],
            type: 'debit'
          },
          {
            id: 'mock-txn-2', 
            account_id: 'mock-checking-1',
            amount: -1200.00,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            name: 'Rent Payment',
            description: 'Rent Payment',
            category: ['Rent', 'Housing'],
            type: 'debit'
          },
          {
            id: 'mock-txn-3',
            account_id: 'mock-checking-1', 
            amount: 500.00,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            name: 'Salary Deposit',
            description: 'Salary Deposit',
            category: ['Payroll', 'Income'],
            type: 'credit'
          }
        ];
        
        onSuccess({ accounts: mockAccounts, transactions: mockTransactions });
        
        // Clean up Plaid iframe after successful connection (mock data)
        setTimeout(() => {
          // Reset Plaid state to close any open iframes
          resetPlaidGlobalState();
          setShouldInitializePlaid(false);
          setShowBanner(false);
          
          // Force remove any remaining Plaid iframes
          const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
          plaidIframes.forEach(iframe => {
            iframe.remove();
          });
        }, 1000); // Small delay to ensure success callback completes
        
        return;
      }
      
      // Exchange public_token -> access_token (server-side)
      const exchangeResponse = await fetch(`${apiBase}/plaid/item/public_token/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token, userId }),
      });
      
      if (!exchangeResponse.ok) {
        throw new Error('Token exchange failed');
      }
      
      const { access_token } = await exchangeResponse.json();
      
      // Fetch mapped accounts using the access token
      const accountsResponse = await fetch(`${apiBase}/plaid/accounts?access_token=${encodeURIComponent(access_token)}&userId=${encodeURIComponent(userId)}`);
      
      if (!accountsResponse.ok) {
        throw new Error('Account fetch failed');
      }
      
      const { accounts } = await accountsResponse.json();
      console.log('Real Plaid accounts received:', accounts);
      
      // Map Plaid account types to our internal types
      const mappedAccounts = accounts.map((account: any) => {
        const mappedType = mapPlaidAccountType(account.type, account.subtype);
        console.log(`Account mapping: "${account.name}" - Plaid type: "${account.type}", subtype: "${account.subtype}" -> Mapped to: "${mappedType}"`);
        return {
        ...account,
          type: mappedType
        };
      });
      
      console.log('Mapped Plaid accounts:', mappedAccounts);
      
      // Create appropriate mock transactions based on account type
      const createMockTransactionsForAccount = (account: any) => {
        const transactions = [];
        const accountId = account.id;
        
        switch (account.type) {
          case 'checking':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: -8.50,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Coffee Shop',
                description: 'Coffee Shop',
                category: ['Food and Drink', 'Restaurants'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: -1200.00,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Rent Payment',
                description: 'Rent Payment',
                category: ['Rent', 'Housing'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-3`,
                account_id: accountId,
                amount: 3500.00,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Salary Deposit',
                description: 'Salary Deposit',
                category: ['Payroll', 'Income'],
                type: 'credit'
              }
            ];
            
          case 'savings':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: 500.00,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Monthly Savings Transfer',
                description: 'Monthly Savings Transfer',
                category: ['Transfer', 'Savings'],
                type: 'credit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: 1.25,
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Interest Payment',
                description: 'Interest Payment',
                category: ['Interest', 'Income'],
                type: 'credit'
              }
            ];
            
          case 'money_market':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: 1000.00,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Money Market Deposit',
                description: 'Money Market Deposit',
                category: ['Transfer', 'Deposit'],
                type: 'credit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: 2.50,
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Money Market Interest',
                description: 'Money Market Interest',
                category: ['Interest', 'Income'],
                type: 'credit'
              }
            ];
            
          case 'cd':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: 10000.00,
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'CD Initial Deposit',
                description: 'CD Initial Deposit',
                category: ['Deposit', 'Investment'],
                type: 'credit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: 25.00,
                date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'CD Interest',
                description: 'CD Interest',
                category: ['Interest', 'Income'],
                type: 'credit'
              }
            ];
            
          case 'credit_card':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: -89.99,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Grocery Store',
                description: 'Grocery Store',
                category: ['Food and Drink', 'Groceries'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: -45.00,
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Gas Station',
                description: 'Gas Station',
                category: ['Gas', 'Transportation'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-3`,
                account_id: accountId,
                amount: 150.00,
                date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Credit Card Payment',
                description: 'Credit Card Payment',
                category: ['Payment', 'Transfer'],
                type: 'credit'
              }
            ];
            
          case 'mortgage':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: -1200.00,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Mortgage Payment',
                description: 'Mortgage Payment',
                category: ['Payment', 'Housing'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: -150.00,
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Property Tax',
                description: 'Property Tax',
                category: ['Tax', 'Housing'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-3`,
                account_id: accountId,
                amount: -85.00,
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Home Insurance',
                description: 'Home Insurance',
                category: ['Insurance', 'Housing'],
                type: 'debit'
              }
            ];
            
          case 'student':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: -250.00,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Student Loan Payment',
                description: 'Student Loan Payment',
                category: ['Payment', 'Education'],
                type: 'debit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: 15.00,
                date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Student Loan Interest',
                description: 'Student Loan Interest',
                category: ['Interest', 'Education'],
                type: 'debit'
              }
            ];
            
          case 'ira':
          case '401k':
          case 'roth_ira':
            return [
              {
                id: `txn-${accountId}-1`,
                account_id: accountId,
                amount: 500.00,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                name: '401k Contribution',
                description: '401k Contribution',
                category: ['Investment', 'Retirement'],
                type: 'credit'
              },
              {
                id: `txn-${accountId}-2`,
                account_id: accountId,
                amount: 25.00,
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Dividend Payment',
                description: 'Dividend Payment',
                category: ['Dividend', 'Investment'],
                type: 'credit'
              },
              {
                id: `txn-${accountId}-3`,
                account_id: accountId,
                amount: -12.50,
                date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                name: 'Management Fee',
                description: 'Management Fee',
                category: ['Fee', 'Investment'],
                type: 'debit'
              }
            ];
            
          default:
            return []; // No transactions for unknown account types
        }
      };
      
      // Generate appropriate transactions for each account
      const mockTransactions = mappedAccounts.flatMap((account: any) => createMockTransactionsForAccount(account));
      
      // Legacy transaction array (keeping for reference but not using)
      /* const legacyMockTransactions = [
        // Checking account transactions (15 transactions)
        {
          id: 'txn-1',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -8.50,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Coffee Shop',
          description: 'Coffee Shop',
          category: ['Food and Drink', 'Restaurants'],
          type: 'debit'
        },
        {
          id: 'txn-2', 
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -1200.00,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Rent Payment',
          description: 'Rent Payment',
          category: ['Rent', 'Housing'],
          type: 'debit'
        },
        {
          id: 'txn-3',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -89.99,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Grocery Store',
          description: 'Grocery Store',
          category: ['Food and Drink', 'Groceries'],
          type: 'debit'
        },
        {
          id: 'txn-4',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: 3500.00,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Salary Deposit',
          description: 'Salary Deposit',
          category: ['Payroll', 'Income'],
          type: 'credit'
        },
        {
          id: 'txn-5',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -15.99,
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Uber Ride',
          description: 'Uber Ride',
          category: ['Transportation', 'Rideshare'],
          type: 'debit'
        },
        {
          id: 'txn-6',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -45.00,
          date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Electric Bill',
          description: 'Electric Bill',
          category: ['Utilities', 'Electric'],
          type: 'debit'
        },
        {
          id: 'txn-7',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -32.50,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Restaurant',
          description: 'Restaurant',
          category: ['Food and Drink', 'Restaurants'],
          type: 'debit'
        },
        {
          id: 'txn-8',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -25.00,
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Gym Membership',
          description: 'Gym Membership',
          category: ['Recreation', 'Sports'],
          type: 'debit'
        },
        {
          id: 'txn-9',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -75.00,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Phone Bill',
          description: 'Phone Bill',
          category: ['Utilities', 'Phone'],
          type: 'debit'
        },
        {
          id: 'txn-10',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -12.99,
          date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Spotify Premium',
          description: 'Spotify Premium',
          category: ['Entertainment', 'Streaming Services'],
          type: 'debit'
        },
        {
          id: 'txn-11',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -67.50,
          date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Target',
          description: 'Target',
          category: ['Shops', 'Department Store'],
          type: 'debit'
        },
        {
          id: 'txn-12',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -22.00,
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Gas Station',
          description: 'Gas Station',
          category: ['Gas', 'Transportation'],
          type: 'debit'
        },
        {
          id: 'txn-13',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -18.75,
          date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Starbucks',
          description: 'Starbucks',
          category: ['Food and Drink', 'Coffee'],
          type: 'debit'
        },
        {
          id: 'txn-14',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -150.00,
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Internet Bill',
          description: 'Internet Bill',
          category: ['Utilities', 'Internet'],
          type: 'debit'
        },
        {
          id: 'txn-15',
          account_id: mappedAccounts[0]?.id || 'checking',
          amount: -35.00,
          date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Movie Theater',
          description: 'Movie Theater',
          category: ['Entertainment', 'Movies'],
          type: 'debit'
        },
        
        // Savings account transactions (5 transactions)
        {
          id: 'txn-16',
          account_id: mappedAccounts[1]?.id || 'savings',
          amount: 500.00,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Transfer from Checking',
          description: 'Transfer from Checking',
          category: ['Transfer', 'Internal Transfer'],
          type: 'credit'
        },
        {
          id: 'txn-17',
          account_id: mappedAccounts[1]?.id || 'savings',
          amount: 1.25,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Interest Payment',
          description: 'Interest Payment',
          category: ['Interest', 'Income'],
          type: 'credit'
        },
        {
          id: 'txn-18',
          account_id: mappedAccounts[1]?.id || 'savings',
          amount: 300.00,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Emergency Fund Deposit',
          description: 'Emergency Fund Deposit',
          category: ['Transfer', 'Savings'],
          type: 'credit'
        },
        {
          id: 'txn-19',
          account_id: mappedAccounts[1]?.id || 'savings',
          amount: 200.00,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Vacation Fund Deposit',
          description: 'Vacation Fund Deposit',
          category: ['Transfer', 'Savings'],
          type: 'credit'
        },
        {
          id: 'txn-20',
          account_id: mappedAccounts[1]?.id || 'savings',
          amount: 0.95,
          date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Interest Payment',
          description: 'Interest Payment',
          category: ['Interest', 'Income'],
          type: 'credit'
        },
        
        // Credit card transactions (12 transactions)
        {
          id: 'txn-21',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -156.78,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Gas Station',
          description: 'Gas Station',
          category: ['Gas', 'Transportation'],
          type: 'debit'
        },
        {
          id: 'txn-22',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -299.99,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Amazon Purchase',
          description: 'Amazon Purchase',
          category: ['Shops', 'Online Purchase'],
          type: 'debit'
        },
        {
          id: 'txn-23',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -45.00,
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Netflix',
          description: 'Netflix',
          category: ['Entertainment', 'Streaming Services'],
          type: 'debit'
        },
        {
          id: 'txn-24',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: 450.00,
          date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Payment from Checking',
          description: 'Payment from Checking',
          category: ['Payment', 'Credit Card Payment'],
          type: 'credit'
        },
        {
          id: 'txn-25',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -89.99,
          date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Restaurant',
          description: 'Restaurant',
          category: ['Food and Drink', 'Restaurants'],
          type: 'debit'
        },
        {
          id: 'txn-26',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -125.00,
          date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Clothing Store',
          description: 'Clothing Store',
          category: ['Shops', 'Clothing'],
          type: 'debit'
        },
        {
          id: 'txn-27',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -35.50,
          date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Grocery Store',
          description: 'Grocery Store',
          category: ['Food and Drink', 'Groceries'],
          type: 'debit'
        },
        {
          id: 'txn-28',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -75.00,
          date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Pharmacy',
          description: 'Pharmacy',
          category: ['Health', 'Pharmacy'],
          type: 'debit'
        },
        {
          id: 'txn-29',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -199.99,
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Electronics Store',
          description: 'Electronics Store',
          category: ['Shops', 'Electronics'],
          type: 'debit'
        },
        {
          id: 'txn-30',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -15.99,
          date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'App Store',
          description: 'App Store',
          category: ['Entertainment', 'Software'],
          type: 'debit'
        },
        {
          id: 'txn-31',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -67.50,
          date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Home Improvement',
          description: 'Home Improvement',
          category: ['Shops', 'Hardware'],
          type: 'debit'
        },
        {
          id: 'txn-32',
          account_id: mappedAccounts[2]?.id || 'credit_card',
          amount: -22.00,
          date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Coffee Shop',
          description: 'Coffee Shop',
          category: ['Food and Drink', 'Coffee'],
          type: 'debit'
        },
        
        // 401k investment transactions (5 transactions)
        {
          id: 'txn-33',
          account_id: mappedAccounts[3]?.id || '401k',
          amount: 850.00,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Employer 401k Contribution',
          description: 'Employer 401k Contribution',
          category: ['Payroll', 'Retirement'],
          type: 'credit'
        },
        {
          id: 'txn-34',
          account_id: mappedAccounts[3]?.id || '401k',
          amount: 425.00,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Employee 401k Contribution',
          description: 'Employee 401k Contribution',
          category: ['Payroll', 'Retirement'],
          type: 'credit'
        },
        {
          id: 'txn-35',
          account_id: mappedAccounts[3]?.id || '401k',
          amount: 127.50,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          name: '401k Investment Gains',
          description: '401k Investment Gains',
          category: ['Investment', 'Capital Gains'],
          type: 'credit'
        },
        {
          id: 'txn-36',
          account_id: mappedAccounts[3]?.id || '401k',
          amount: 45.75,
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Dividend Payment',
          description: 'Dividend Payment',
          category: ['Investment', 'Dividends'],
          type: 'credit'
        },
        {
          id: 'txn-37',
          account_id: mappedAccounts[3]?.id || '401k',
          amount: -12.50,
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          name: '401k Management Fee',
          description: '401k Management Fee',
          category: ['Investment', 'Fees'],
          type: 'debit'
        },
        
        // Student loan transactions (4 transactions)
        {
          id: 'txn-38',
          account_id: mappedAccounts[4]?.id || 'student_loan',
          amount: -350.00,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Student Loan Payment',
          description: 'Student Loan Payment',
          category: ['Payment', 'Loan Payment'],
          type: 'debit'
        },
        {
          id: 'txn-39',
          account_id: mappedAccounts[4]?.id || 'student_loan',
          amount: -285.67,
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Student Loan Interest',
          description: 'Student Loan Interest',
          category: ['Interest', 'Loan Interest'],
          type: 'debit'
        },
        {
          id: 'txn-40',
          account_id: mappedAccounts[4]?.id || 'student_loan',
          amount: -64.33,
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Student Loan Principal',
          description: 'Student Loan Principal',
          category: ['Payment', 'Loan Principal'],
          type: 'debit'
        },
        {
          id: 'txn-41',
          account_id: mappedAccounts[4]?.id || 'student_loan',
          amount: -5.00,
          date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Student Loan Fee',
          description: 'Student Loan Fee',
          category: ['Payment', 'Loan Fees'],
          type: 'debit'
        },
        
        // Mortgage transactions (5 transactions)
        {
          id: 'txn-42',
          account_id: mappedAccounts[5]?.id || 'mortgage',
          amount: -1850.00,
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Mortgage Payment',
          description: 'Mortgage Payment',
          category: ['Payment', 'Mortgage Payment'],
          type: 'debit'
        },
        {
          id: 'txn-43',
          account_id: mappedAccounts[5]?.id || 'mortgage',
          amount: -1200.00,
          date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Mortgage Principal',
          description: 'Mortgage Principal',
          category: ['Payment', 'Mortgage Principal'],
          type: 'debit'
        },
        {
          id: 'txn-44',
          account_id: mappedAccounts[5]?.id || 'mortgage',
          amount: -650.00,
          date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Mortgage Interest',
          description: 'Mortgage Interest',
          category: ['Interest', 'Mortgage Interest'],
          type: 'debit'
        },
        {
          id: 'txn-45',
          account_id: mappedAccounts[5]?.id || 'mortgage',
          amount: -350.00,
          date: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Property Tax',
          description: 'Property Tax',
          category: ['Payment', 'Taxes'],
          type: 'debit'
        },
        {
          id: 'txn-46',
          account_id: mappedAccounts[5]?.id || 'mortgage',
          amount: -125.00,
          date: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString(),
          name: 'Home Insurance',
          description: 'Home Insurance',
          category: ['Payment', 'Insurance'],
          type: 'debit'
        }
      ]; */
      
      // Pass both mapped accounts and transactions
      onSuccess({ accounts: mappedAccounts, transactions: mockTransactions });
      
      // Clean up Plaid iframe after successful connection
      setTimeout(() => {
        // Reset Plaid state to close any open iframes
        resetPlaidGlobalState();
        setShouldInitializePlaid(false);
        setShowBanner(false);
        
        // Force remove any remaining Plaid iframes
        const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
        plaidIframes.forEach(iframe => {
          iframe.remove();
        });
      }, 1000); // Small delay to ensure success callback completes
      
    } catch (e: any) {
      console.error('Plaid success flow error:', e);
      setError(`Link success, but account fetch failed: ${e.message}`);
    }
  }, [apiBase, userId, onSuccess, linkToken]);

  useEffect(() => {
    console.log('PlaidLinkButton useEffect running, userId:', userId, 'apiBase:', apiBase, 'hidden:', hidden);
    
    // Always initialize to get the link token, even when hidden
    // The hidden prop only affects rendering, not initialization
    
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Prevent multiple simultaneous initializations
    if (isInitializing.current) {
      console.log('Already initializing, skipping');
      return;
    }

    console.log('Starting token initialization...');
    isInitializing.current = true;

    // Safety timeout to reset the flag if something goes wrong
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout: resetting isInitializing flag');
      isInitializing.current = false;
    }, 10000); // 10 second safety timeout

    // Debounce the request to prevent multiple rapid calls
    timeoutId = setTimeout(async () => {
      try {
        console.log('Fetching link token from:', `${apiBase}/plaid/link/token/create`);
        console.log('Current window location:', window.location.href);
        console.log('Request body:', JSON.stringify({ userId }));

        // For development, try the API first, then fall back to mock
        let data;
        try {
        const r = await fetch(`${apiBase}/plaid/link/token/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        console.log('Response status:', r.status);
        console.log('Response headers:', Object.fromEntries(r.headers.entries()));

        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }

          data = await r.json();
          console.log('Received link token from API:', data);
        } catch (apiError) {
          console.warn('API call failed, using mock link token for development:', apiError);
          // Use mock link token for development
          data = {
            link_token: `link-sandbox-mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };
          console.log('Using mock link token:', data);
        }

        if (isMounted) {
          setLinkToken(data.link_token);
          setIsInitialized(true);
        }
      } catch (e: any) {
        console.error('Plaid Link initialization error:', e);
        if (isMounted) {
          setError(`Failed to init Plaid Link: ${e.message}`);
        }
      } finally {
        isInitializing.current = false;
      }
    }, 500); // 500ms debounce

    return () => {
      console.log('PlaidLinkButton useEffect cleanup');
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(safetyTimeout);
      // Reset the initializing flag on cleanup
      isInitializing.current = false;
    };
  }, [userId, apiBase]);

  const config: PlaidLinkOptions = useMemo(() => ({
    token: linkToken || '',
    onSuccess: handleSuccess,
    onExit: (err: any, metadata: any) => {
      console.log('Plaid Link exited:', err, metadata);
      
      // Hide banner when Plaid Link exits
      setShowBanner(false);
      setBannerStep('initial');
      
      // Clean up Plaid iframe when user cancels or exits
      setTimeout(() => {
        // Reset Plaid state
        resetPlaidGlobalState();
        setShouldInitializePlaid(false);
        
        // Force remove any remaining Plaid iframes
        const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
        plaidIframes.forEach(iframe => {
          console.log('Removing Plaid iframe on exit');
          iframe.remove();
        });
        
        // Also remove any Plaid-related divs that might be blocking interaction
        const plaidDivs = document.querySelectorAll('div[style*="z-index"][style*="2147483647"]');
        plaidDivs.forEach(div => {
          if (div.innerHTML.includes('plaid') || div.querySelector('iframe[src*="plaid"]')) {
            console.log('Removing Plaid overlay div');
            div.remove();
          }
        });
      }, 100); // Small delay to ensure Plaid has finished its cleanup
      
      // Handle INVALID_LINK_TOKEN error as recommended by Plaid docs
      if (err && err.error_code === 'INVALID_LINK_TOKEN') {
        console.log('Link token invalidated, regenerating...');
        // Reset state to trigger token regeneration
        setIsInitialized(false);
        setLinkToken(null);
        setError(null);
        // The useEffect will automatically regenerate the token
      }
    },
    onEvent: (eventName: string, metadata: any) => {
      console.log('Plaid Link event:', eventName, metadata);
      
      // More specific event handling to control banner progression
      switch (eventName) {
        case 'OPEN':
          setShowBanner(true);
          setBannerStep('initial'); // Show phone + passcode
          break;
        case 'SELECT_INSTITUTION':
          // Stay on initial state (phone + passcode) when institution is selected
          console.log('Institution selected - staying on initial state');
          break;
        case 'SUBMIT_CREDENTIALS':
        case 'VERIFY_CODE':
        case 'VERIFY_MFA':
          // Only progress to login state for actual credential submission
          console.log('Login step detected, showing username/password');
          setBannerStep('login'); // Show username/password + verification code
          break;
        case 'OPEN_OAUTH':
          // Plaid opened a new window for OAuth - this is when we should show login credentials
          console.log('Plaid opened OAuth window - showing login credentials');
          setBannerStep('login');
          break;
        case 'HANDOFF':
        case 'OAUTH_REDIRECT':
          // These might happen during phone verification, stay on initial
          console.log('Handoff/OAuth redirect - staying on initial state');
          break;
        case 'EXIT':
          setShowBanner(false);
          setBannerStep('initial');
          break;
        default:
          console.log('Unhandled Plaid event:', eventName, metadata);
          // Don't auto-progress for unhandled events - let timer handle it
      }
    },
  }), [linkToken, handleSuccess]);

  // State to track if we should initialize Plaid
  const [shouldInitializePlaid, setShouldInitializePlaid] = useState(!hidden);

  // Only initialize Plaid when we actually want to open it
  const { open, ready, error: plaidError } = usePlaidLinkSingleton(shouldInitializePlaid ? config : null as any);

  // Debug ready state changes
  useEffect(() => {
    console.log(`PlaidLinkButton [${instanceId}] ready state changed:`, { 
      ready, 
      shouldInitializePlaid, 
      linkToken: linkToken ? 'Present' : 'Missing', 
      hidden, 
      autoOpen 
    });
  }, [ready, shouldInitializePlaid, linkToken, instanceId, hidden, autoOpen]);

  // Cleanup function to force remove Plaid iframes
  const forceCleanupPlaid = useCallback(() => {
    console.log('Force cleaning up Plaid iframes');
    
    // Reset Plaid state
    resetPlaidGlobalState();
    setShouldInitializePlaid(false);
    setShowBanner(false);
    
    // Remove all Plaid iframes
    const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
    plaidIframes.forEach(iframe => {
      console.log('Force removing Plaid iframe');
      iframe.remove();
    });
    
    // Remove Plaid overlay divs
    const plaidDivs = document.querySelectorAll('div[style*="z-index"][style*="2147483647"]');
    plaidDivs.forEach(div => {
      if (div.innerHTML.includes('plaid') || div.querySelector('iframe[src*="plaid"]')) {
        console.log('Force removing Plaid overlay div');
        div.remove();
      }
    });
  }, []);

  // Add global cleanup listeners
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Check if there are any Plaid iframes visible
        const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
        if (plaidIframes.length > 0) {
          console.log('Escape key pressed - cleaning up Plaid iframes');
          forceCleanupPlaid();
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside any Plaid iframe
      const target = event.target as Element;
      const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
      
      if (plaidIframes.length > 0) {
        const isClickOnPlaid = Array.from(plaidIframes).some(iframe => 
          iframe.contains(target) || iframe === target
        );
        
        if (!isClickOnPlaid) {
          // Click is outside Plaid iframe - check if it's on a Plaid overlay
          const plaidOverlays = document.querySelectorAll('div[style*="z-index"][style*="2147483647"]');
          const isClickOnOverlay = Array.from(plaidOverlays).some(overlay => 
            overlay.contains(target) || overlay === target
          );
          
          if (!isClickOnOverlay) {
            console.log('Click outside Plaid - cleaning up iframes');
            forceCleanupPlaid();
          }
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    // Cleanup listeners
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [forceCleanupPlaid]);

  // Handle open request from parent component
  useEffect(() => {
    if (plaidOpenRequested && linkToken) {
      setShouldInitializePlaid(true);
      setShowBanner(true);
      setBannerStep('initial');
    }
  }, [plaidOpenRequested, linkToken]);

  // Open Plaid when it becomes ready (only for hidden/triggered mode)
  useEffect(() => {
    console.log(`PlaidLinkButton [${instanceId}] open effect triggered:`, {
      shouldInitializePlaid,
      ready,
      linkToken: linkToken ? 'Present' : 'Missing',
      hidden,
      autoOpen
    });
    
    if (shouldInitializePlaid && ready && linkToken && hidden) {
      console.log(`PlaidLinkButton [${instanceId}] AUTO-OPENING (hidden mode)`);
      open();
    } else if (shouldInitializePlaid && ready && linkToken && !hidden) {
      console.log(`PlaidLinkButton [${instanceId}] READY but NOT auto-opening (visible mode)`);
    }
  }, [shouldInitializePlaid, ready, linkToken, open, hidden, instanceId]);

  // Auto-open effect - only run if not hidden
  useEffect(() => {
    console.log(`PlaidLinkButton [${instanceId}] auto-open effect triggered:`, {
      autoOpen,
      hidden,
      ready,
      isInitialized,
      linkToken: linkToken ? 'Present' : 'Missing'
    });
    
    if (autoOpen && !hidden && ready && isInitialized && linkToken) {
      console.log(`PlaidLinkButton [${instanceId}] AUTO-OPENING via autoOpen prop`);
      // If using mock token, simulate the Plaid flow instead of opening real Plaid
      if (linkToken.startsWith('link-sandbox-mock')) {
        // Show banner for mock flow
        setShowBanner(true);
        setBannerStep('initial');
        
        // Simulate the simplified flow
        setTimeout(() => {
          setBannerStep('login'); // Show login credentials after 3 seconds
        }, 3000);
        
        setTimeout(() => {
          // Simulate successful Plaid Link flow with mock data
          const mockPublicToken = 'public-sandbox-mock-' + Date.now();
          setBannerStep('success');
          handleSuccess(mockPublicToken);
        }, 6000); // Complete after 6 seconds
      } else {
        // Use real Plaid Link for production tokens
        setShowBanner(true);
        setBannerStep('initial');
        open();
      }
    }
  }, [autoOpen, hidden, ready, isInitialized, linkToken, open, handleSuccess]);


  // Window focus detection for OAuth popup
  useEffect(() => {
    if (showBanner && bannerStep === 'initial') {
      const handleFocus = () => {
        console.log('Window focus detected - user returned from popup, showing login credentials');
        setBannerStep('login');
      };

      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [showBanner, bannerStep]);

  // Monitor for Plaid iframes and ensure banner stays on top
  useEffect(() => {
    if (showBanner) {
      const ensureBannerOnTop = () => {
        const banner = document.querySelector('.plaid-sandbox-banner');
        const plaidIframes = document.querySelectorAll('iframe[src*="plaid"]');
        
        if (banner && plaidIframes.length > 0) {
          // Set banner z-index higher than any Plaid iframe
          (banner as HTMLElement).style.zIndex = '2147483649';
          
          // Ensure Plaid iframes have lower z-index
          plaidIframes.forEach(iframe => {
            (iframe as HTMLElement).style.zIndex = '2147483647';
          });
        }
      };

      // Check immediately and then periodically
      ensureBannerOnTop();
      const interval = setInterval(ensureBannerOnTop, 100);

      return () => clearInterval(interval);
    }
  }, [showBanner]);

  if (error) return <div>{error}</div>;
  if (plaidError) return <div>Plaid Error: {plaidError}</div>;
  
  // If hidden, only render the banner via portal
  if (hidden) {
    return showBanner ? createPortal(
      <PlaidSandboxBanner
        isVisible={showBanner}
        currentStep={bannerStep}
        onClose={() => setShowBanner(false)}
      />,
      document.body
    ) : null;
  }
  
  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <Button 
        variant={ButtonVariants.outline} 
        color={ButtonColors.secondary} 
        fullWidth={true} 
        disabled
      >
        <Icon name={IconNames.account_balance_wallet} size="md" />
        Connecting to Plaid...
      </Button>
    );
  }
  
  // Show unavailable state only if we have an error and no token
  if (!linkToken) {
    if (hidden) {
      return <PlaidSandboxBanner 
        isVisible={showBanner} 
        currentStep={bannerStep}
        onClose={() => setShowBanner(false)}
      />;
    }
  return (
      <Button 
        variant={ButtonVariants.outline} 
        color={ButtonColors.secondary} 
        fullWidth={true} 
        disabled
      >
        <Icon name={IconNames.account_balance_wallet} size="md" />
        Plaid unavailable
      </Button>
    );
  }


  if (hidden) {
    return (
      <PlaidSandboxBanner 
        isVisible={showBanner} 
        currentStep={bannerStep}
        onClose={() => setShowBanner(false)}
      />
    );
  }

  return (
    <>
    <Button
      variant={ButtonVariants.outline}
      color={ButtonColors.secondary}
      fullWidth={true}
      onClick={() => {
        console.log(`PlaidLinkButton [${instanceId}] BUTTON CLICKED, ready:`, ready, 'shouldInitializePlaid:', shouldInitializePlaid, 'linkToken:', linkToken ? 'Present' : 'Missing');
        if (ready) {
          console.log(`PlaidLinkButton [${instanceId}] Opening Plaid...`);
          setShowBanner(true);
          setBannerStep('initial');
        open();
        } else {
          console.log(`PlaidLinkButton [${instanceId}] Button clicked but not ready. Ready:`, ready, 'ShouldInitialize:', shouldInitializePlaid);
        }
      }}
      disabled={!ready}
    >
      <Icon name={IconNames.account_balance_wallet} size="md" />
      Connect with Plaid {!ready ? '(Loading...)' : ''}
    </Button>
      
      
      {showBanner && createPortal(
      <PlaidSandboxBanner 
        isVisible={showBanner} 
        currentStep={bannerStep}
        onClose={() => setShowBanner(false)}
        />,
        document.body
      )}
    </>
  );
}
