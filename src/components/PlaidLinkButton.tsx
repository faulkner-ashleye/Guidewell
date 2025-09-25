import { useEffect, useState, useCallback, useRef } from 'react';
import { usePlaidLinkSingleton } from '../hooks/usePlaidLinkSingleton';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Icon, IconNames } from './Icon';
import { API_BASE_URL } from '../config/api';
import './Button.css';

// Define PlaidLinkOptions type locally
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string) => void;
  onExit?: () => void;
}

type Props = {
  userId?: string;
  onSuccess: (mappedAccounts: any[]) => void;
  apiBase?: string; // defaults to environment-based API_BASE_URL
};

export default function PlaidLinkButton({ userId = 'demo-user-123', onSuccess, apiBase = API_BASE_URL }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializing = useRef(false);

  const handleSuccess = useCallback(async (public_token: string) => {
    try {
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
      onSuccess(accounts);
    } catch (e: any) {
      console.error('Plaid success flow error:', e);
      setError(`Link success, but account fetch failed: ${e.message}`);
    }
  }, [apiBase, userId, onSuccess]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Prevent multiple simultaneous initializations
    if (isInitializing.current) {
      return;
    }

    isInitializing.current = true;

    // Debounce the request to prevent multiple rapid calls
    timeoutId = setTimeout(async () => {
      try {
        console.log('Fetching link token from:', `${apiBase}/plaid/link/token/create`);
        console.log('Current window location:', window.location.href);
        console.log('Request body:', JSON.stringify({ userId }));

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

        const data = await r.json();
        console.log('Received link token:', data);

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
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [userId, apiBase]);

  const config: PlaidLinkOptions = {
    token: linkToken || '',
    onSuccess: handleSuccess,
    onExit: () => {},
  };

  const { open, ready, error: plaidError } = usePlaidLinkSingleton(config);

  // Debug logging
  console.log('PlaidLinkButton state:', {
    isInitialized,
    linkToken: linkToken ? 'Present' : 'Missing',
    ready,
    error,
    plaidError
  });

  if (error) return <div>{error}</div>;
  if (plaidError) return <div>Plaid Error: {plaidError}</div>;
  if (!isInitialized || !linkToken) return <Button variant={ButtonVariants.outline} color={ButtonColors.secondary} fullWidth={true} disabled>Plaid unavailable</Button>;


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
