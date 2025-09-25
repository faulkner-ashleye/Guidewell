// Vercel serverless function for exchanging Plaid public tokens
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

    // For now, return a mock access token
    // In production, you would:
    // 1. Initialize Plaid client with your credentials
    // 2. Exchange the public token for an access token
    // 3. Store the access token securely for the user
    
    const mockAccessToken = `access-sandbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Exchanged public token for user: ${userId}`);
    
    res.status(200).json({
      access_token: mockAccessToken,
      item_id: `item-${userId}-${Date.now()}`,
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
