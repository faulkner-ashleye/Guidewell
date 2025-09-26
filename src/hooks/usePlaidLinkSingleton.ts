import { useEffect, useState, useRef, useCallback } from 'react';
import { usePlaidScript } from './usePlaidScript';

// Define PlaidLinkOptions type locally
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string) => void;
  onExit?: (err: any, metadata: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
}

// Global state to track if Plaid Link is already initialized
let globalPlaidInitialized = false;
let globalLinkToken: string | null = null;
let globalConfig: PlaidLinkOptions | null = null;
let globalPlaidLinkInstance: any = null;
let componentCount = 0;

// Function to reset global Plaid state (called during logout)
export function resetPlaidGlobalState() {
  globalPlaidInitialized = false;
  globalLinkToken = null;
  globalConfig = null;
  globalPlaidLinkInstance = null;
  componentCount = 0;
}

// Declare Plaid types
declare global {
  interface Window {
    Plaid?: {
      create: (config: any) => any;
    };
  }
}

export function usePlaidLinkSingleton(config: PlaidLinkOptions | null) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const componentId = useRef(++componentCount);
  const scriptLoaded = usePlaidScript();
  
  // Log component creation
  console.log(`Component ${componentId.current}: CREATED with config:`, config ? 'Present' : 'Null');
  
  // Log component destruction
  useEffect(() => {
    return () => {
      console.log(`Component ${componentId.current}: DESTROYED`);
    };
  }, []);

  const open = useCallback(() => {
    console.log(`Component ${componentId.current}: open() called`);
    if (globalPlaidLinkInstance) {
      console.log(`Component ${componentId.current}: Actually opening Plaid`);
      globalPlaidLinkInstance.open();
    } else {
      console.log(`Component ${componentId.current}: No global instance to open`);
    }
  }, []);

  useEffect(() => {
    // If config is null, don't initialize
    if (!config) {
      console.log(`Component ${componentId.current}: Config is null, not initializing`);
      return;
    }
    
    console.log(`Component ${componentId.current}: Starting initialization check`, {
      globalPlaidInitialized,
      globalLinkToken: globalLinkToken ? 'Present' : 'Missing',
      configToken: config.token ? 'Present' : 'Missing',
      scriptLoaded,
      initializedRef: initializedRef.current
    });
    
    // If Plaid Link is already initialized globally, don't initialize again
    if (globalPlaidInitialized && globalLinkToken === config.token) {
      setIsReady(true);
      return;
    }

    // If this component already initialized, don't initialize again
    if (initializedRef.current) {
      return;
    }

    // Only initialize if we have a token, script is loaded, and haven't initialized yet
    if (config.token && scriptLoaded && !globalPlaidInitialized) {
      
      try {
        if (window.Plaid) {
          globalPlaidLinkInstance = window.Plaid.create({
            token: config.token,
            onSuccess: config.onSuccess,
            onExit: config.onExit,
            onEvent: config.onEvent,
          });
        } else {
          throw new Error('Plaid is not available on window object');
        }
        
        globalPlaidInitialized = true;
        globalLinkToken = config.token;
        globalConfig = config;
        initializedRef.current = true;
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing Plaid Link:', error);
        setError('Failed to initialize Plaid Link');
      }
    }
  }, [config?.token, config?.onSuccess, config?.onExit, config?.onEvent, scriptLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return {
    open,
    ready: isReady,
    error
  };
}
