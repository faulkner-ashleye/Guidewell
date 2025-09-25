// Vercel serverless function for creating Plaid link tokens
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

    // For now, return a mock link token
    // In production, you would:
    // 1. Initialize Plaid client with your credentials
    // 2. Create a real link token
    // 3. Store it securely
    
    const mockLinkToken = `link-sandbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Created link token for user: ${userId}`);
    
    res.status(200).json({
      link_token: mockLinkToken,
      expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
