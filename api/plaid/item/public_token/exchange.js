// Vercel serverless function for exchanging Plaid public tokens
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
    const { public_token, userId } = req.body;

    if (!public_token || !userId) {
      return res.status(400).json({ error: 'public_token and userId are required' });
    }

    // Check if Plaid credentials are configured
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      console.log('Plaid credentials not configured, using mock exchange');
      const mockAccessToken = `access-sandbox-mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return res.status(200).json({
        access_token: mockAccessToken,
        item_id: `item-mock-${userId}-${Date.now()}`,
      });
    }

    // Exchange public token for access token using real Plaid sandbox
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });
    
    console.log(`Exchanged public token for user: ${userId}`);
    
    res.status(200).json({
      access_token: response.data.access_token,
      item_id: response.data.item_id,
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
