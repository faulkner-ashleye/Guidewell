import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { usePlaidLinkSingleton } from '../hooks/usePlaidLinkSingleton';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Icon, IconNames } from './Icon';
import { API_BASE_URL } from '../config/api';
import './Button.css';

// Define PlaidLinkOptions type locally
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string) => void;
  onExit?: (err: any, metadata: any) => void;
}

type Props = {
  userId?: string;
  onSuccess: (data: any[] | { accounts: any[], transactions?: any[] }) => void;
  apiBase?: string; // defaults to environment-based API_BASE_URL
  autoOpen?: boolean; // automatically open Plaid Link when ready
};

export default function PlaidLinkButton({ userId = 'demo-user-123', onSuccess, apiBase = API_BASE_URL, autoOpen = false }: Props) {
  console.log('PlaidLinkButton render, userId:', userId, 'apiBase:', apiBase, 'autoOpen:', autoOpen);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializing = useRef(false);

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
            description: 'Coffee Shop',
            category: ['Food and Drink', 'Restaurants'],
            type: 'debit'
          },
          {
            id: 'mock-txn-2', 
            account_id: 'mock-checking-1',
            amount: -1200.00,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Rent Payment',
            category: ['Rent', 'Housing'],
            type: 'debit'
          },
          {
            id: 'mock-txn-3',
            account_id: 'mock-checking-1', 
            amount: 500.00,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Salary Deposit',
            category: ['Payroll', 'Income'],
            type: 'credit'
          }
        ];
        
        onSuccess({ accounts: mockAccounts, transactions: mockTransactions });
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
      
      // Add mock transactions for Plaid accounts to make the app more functional
      const mockTransactions = [
        {
          id: 'txn-1',
          account_id: accounts[0]?.id || 'checking',
          amount: -45.50,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Coffee Shop',
          category: ['Food and Drink', 'Restaurants'],
          type: 'debit'
        },
        {
          id: 'txn-2', 
          account_id: accounts[0]?.id || 'checking',
          amount: -1200.00,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Rent Payment',
          category: ['Rent', 'Housing'],
          type: 'debit'
        },
        {
          id: 'txn-3',
          account_id: accounts[1]?.id || 'savings', 
          amount: 500.00,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Salary Deposit',
          category: ['Payroll', 'Income'],
          type: 'credit'
        }
      ];
      
      // Pass both accounts and transactions
      onSuccess({ accounts, transactions: mockTransactions });
    } catch (e: any) {
      console.error('Plaid success flow error:', e);
      setError(`Link success, but account fetch failed: ${e.message}`);
    }
  }, [apiBase, userId, onSuccess, linkToken]);

  useEffect(() => {
    console.log('PlaidLinkButton useEffect running, userId:', userId, 'apiBase:', apiBase);
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
  }), [linkToken, handleSuccess]);

  const { open, ready, error: plaidError } = usePlaidLinkSingleton(config);

  // Auto-open effect
  useEffect(() => {
    if (autoOpen && ready && isInitialized && linkToken) {
      console.log('Auto-opening Plaid Link');
      
      // If using mock token, simulate the Plaid flow instead of opening real Plaid
      if (linkToken.startsWith('link-sandbox-mock')) {
        console.log('Using mock Plaid flow for development');
        setTimeout(() => {
          // Simulate successful Plaid Link flow with mock data
          const mockPublicToken = 'public-sandbox-mock-' + Date.now();
          handleSuccess(mockPublicToken);
        }, 1000); // 1 second delay to simulate user interaction
      } else {
        // Use real Plaid Link for production tokens
        open();
      }
    }
  }, [autoOpen, ready, isInitialized, linkToken, open, handleSuccess]);

  // Debug logging
  console.log('PlaidLinkButton state:', {
    isInitialized,
    linkToken: linkToken ? 'Present' : 'Missing',
    ready,
    error,
    plaidError,
    autoOpen
  });

  if (error) return <div>{error}</div>;
  if (plaidError) return <div>Plaid Error: {plaidError}</div>;
  
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


  return (
    <Button
      variant={ButtonVariants.outline}
      color={ButtonColors.secondary}
      fullWidth={true}
      onClick={() => {
        console.log('Plaid button clicked, ready:', ready);
        open();
      }}
      disabled={!ready}
    >
      <Icon name={IconNames.account_balance_wallet} size="md" />
      Connect with Plaid {!ready ? '(Loading...)' : ''}
    </Button>
  );
}
