import { useEffect, useState, useCallback, useRef } from 'react';
import { PlaidLinkOptions } from 'react-plaid-link';
import { usePlaidLinkSingleton } from '../hooks/usePlaidLinkSingleton';

type Props = {
  userId?: string;
  onSuccess: (mappedAccounts: any[]) => void;
  apiBase?: string; // default http://localhost:3001
};

export default function PlaidLinkButton({ userId = 'demo-user-123', onSuccess, apiBase = 'http://localhost:3001' }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializing = useRef(false);

  const handleSuccess = useCallback(async (public_token: string) => {
    try {
      // Exchange public_token -> access_token (server-side)
      await fetch(`${apiBase}/plaid/item/public_token/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token, userId }),
      });
      // Fetch mapped accounts
      const r = await fetch(`${apiBase}/plaid/accounts?userId=${encodeURIComponent(userId)}`);
      const { accounts } = await r.json();
      onSuccess(accounts);
    } catch (e) {
      setError('Link success, but account fetch failed');
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

  if (error) return <div>{error}</div>;
  if (plaidError) return <div>Plaid Error: {plaidError}</div>;
  if (!isInitialized || !linkToken) return <button disabled>Plaid unavailable</button>;

  
  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect with Plaid
    </button>
  );
}