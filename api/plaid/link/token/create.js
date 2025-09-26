// Vercel serverless function for creating Plaid link tokens
const { PlaidApi, PlaidEnvironments, Configuration } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if Plaid credentials are configured
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      console.log('Plaid credentials not configured, using mock token');
      const mockLinkToken = `link-sandbox-mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return res.status(200).json({
        link_token: mockLinkToken,
        expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });
    }

    // Create real Plaid sandbox link token
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Guidewell',
      products: ['auth', 'transactions', 'liabilities'],
      country_codes: ['US'],
      language: 'en',
    });
    
    console.log(`Created real Plaid link token for user: ${userId}`);
    
    res.status(200).json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
