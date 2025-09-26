// Vercel serverless function for testing/debugging
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({ 
      message: 'Guidewell API Server is running!', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      plaidConfigured: !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET),
      supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
      availableEndpoints: [
        'GET /api/health',
        'GET /api/test',
        'POST /api/plaid/link/token/create',
        'POST /api/plaid/item/public_token/exchange',
        'GET /api/plaid/accounts',
        'POST /api/plaid/institution/logo',
        'POST /api/ai/analyze',
        'POST /api/ai-chat',
        'POST /api/ai-health',
        'POST /api/ai-test'
      ]
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}