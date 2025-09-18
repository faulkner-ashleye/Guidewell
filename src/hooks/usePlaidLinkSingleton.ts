import { useEffect, useState, useRef } from 'react';
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link';

// Global state to track if Plaid Link is already initialized
let globalPlaidInitialized = false;
let globalLinkToken: string | null = null;
let globalConfig: PlaidLinkOptions | null = null;
let componentCount = 0;

export function usePlaidLinkSingleton(config: PlaidLinkOptions) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const componentId = useRef(++componentCount);

  useEffect(() => {
    console.log(`Component ${componentId.current}: usePlaidLinkSingleton effect running`);
    
    // If Plaid Link is already initialized globally, don't initialize again
    if (globalPlaidInitialized && globalLinkToken === config.token) {
      console.log(`Component ${componentId.current}: Using existing global Plaid instance`);
      setIsReady(true);
      return;
    }

    // If this component already initialized, don't initialize again
    if (initializedRef.current) {
      console.log(`Component ${componentId.current}: Already initialized, skipping`);
      return;
    }

    // Only initialize if we have a token and haven't initialized yet
    if (config.token && !globalPlaidInitialized) {
      console.log(`Component ${componentId.current}: Initializing global Plaid Link`);
      globalPlaidInitialized = true;
      globalLinkToken = config.token;
      globalConfig = config;
      initializedRef.current = true;
      setIsReady(true);
    }
  }, [config.token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`Component ${componentId.current}: Cleaning up`);
    };
  }, []);

  // Return the global config if available, otherwise return the passed config
  const effectiveConfig = globalConfig || config;
  
  const { open, ready } = usePlaidLink(effectiveConfig);

  return {
    open,
    ready: ready && isReady,
    error
  };
}
