// API configuration based on environment
const getApiBaseUrl = (): string => {
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // For production, you have several options:
  
  // Option 1: Use Vercel serverless functions (recommended)
  // This would require creating API routes in your Vercel deployment
  if (window.location.hostname === 'guidewell-app.vercel.app') {
    return 'https://guidewell-app.vercel.app/api';
  }
  
  // Option 2: Use a separate backend service
  // Replace with your actual backend URL when you deploy it
  // return 'https://your-backend-domain.com';
  
  // Option 3: Use environment variables (if you set them in Vercel)
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);
console.log('Hostname:', window.location.hostname);
