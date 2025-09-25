import { useEffect, useState, useRef, useCallback } from 'react';
import { usePlaidScript } from './usePlaidScript';

// Define PlaidLinkOptions type locally
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string) => void;
  onExit?: () => void;
}

// Global state to track if Plaid Link is already initialized
let globalPlaidInitialized = false;
let globalLinkToken: string | null = null;
let globalConfig: PlaidLinkOptions | null = null;
let globalPlaidLinkInstance: any = null;
let componentCount = 0;

// Declare Plaid types
declare global {
  interface Window {
    Plaid?: {
      create: (config: any) => any;
    };
  }
}

export function usePlaidLinkSingleton(config: PlaidLinkOptions) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const componentId = useRef(++componentCount);
  const scriptLoaded = usePlaidScript();

  const open = useCallback(() => {
    if (globalPlaidLinkInstance) {
      globalPlaidLinkInstance.open();
    }
  }, []);

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

    // Only initialize if we have a token, script is loaded, and haven't initialized yet
    if (config.token && scriptLoaded && !globalPlaidInitialized) {
      console.log(`Component ${componentId.current}: Initializing global Plaid Link`);
      
      try {
        if (window.Plaid) {
          globalPlaidLinkInstance = window.Plaid.create({
            token: config.token,
            onSuccess: config.onSuccess,
            onExit: config.onExit,
          });
        } else {
          throw new Error('Plaid is not available on window object');
        }
        
        globalPlaidInitialized = true;
        globalLinkToken = config.token;
        globalConfig = config;
        initializedRef.current = true;
        setIsReady(true);
        console.log('Global Plaid Link initialized successfully');
      } catch (error) {
        console.error('Error initializing Plaid Link:', error);
        setError('Failed to initialize Plaid Link');
      }
    }
  }, [config.token, config.onSuccess, config.onExit, scriptLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`Component ${componentId.current}: Cleaning up`);
    };
  }, []);

  return {
    open,
    ready: isReady,
    error
  };
}
