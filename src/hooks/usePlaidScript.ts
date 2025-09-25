import { useEffect, useState } from 'react';

// Global state to track script loading
let scriptLoaded = false;
let scriptLoading = false;
let scriptLoadPromise: Promise<void> | null = null;

export function usePlaidScript() {
  const [isLoaded, setIsLoaded] = useState(scriptLoaded);

  useEffect(() => {
    if (scriptLoaded) {
      setIsLoaded(true);
      return;
    }

    if (scriptLoading && scriptLoadPromise) {
      scriptLoadPromise.then(() => setIsLoaded(true));
      return;
    }

    if (!scriptLoading) {
      scriptLoading = true;
      scriptLoadPromise = new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="plaid"]');
        if (existingScript) {
          scriptLoaded = true;
          scriptLoading = false;
          setIsLoaded(true);
          resolve();
          return;
        }

        // Create and load the script
        const script = document.createElement('script');
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.async = true;
        script.onload = () => {
          console.log('Plaid script loaded successfully');
          scriptLoaded = true;
          scriptLoading = false;
          setIsLoaded(true);
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Plaid script');
          scriptLoading = false;
          reject(new Error('Failed to load Plaid script'));
        };
        
        document.head.appendChild(script);
      });

      scriptLoadPromise.catch((error) => {
        console.error('Plaid script loading error:', error);
        scriptLoading = false;
      });
    }
  }, []);

  return isLoaded;
}
