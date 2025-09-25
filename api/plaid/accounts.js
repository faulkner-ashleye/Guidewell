// Vercel serverless function for fetching Plaid accounts
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
    const { access_token, userId } = req.query;

    if (!access_token || !userId) {
      return res.status(400).json({ error: 'access_token and userId are required' });
    }

    // For now, return mock account data
    // In production, you would:
    // 1. Initialize Plaid client with your credentials
    // 2. Use the access token to fetch real account data
    // 3. Transform the data to match your app's format
    
    const mockAccounts = [
      {
        id: `account-${userId}-1`,
        name: 'Chase Total Checking',
        type: 'depository',
        subtype: 'checking',
        balance: 2450.75,
        institution: {
          name: 'Chase Bank',
          logo: '/images/chase_logo.jpeg'
        }
      },
      {
        id: `account-${userId}-2`,
        name: 'Chase Freedom Credit Card',
        type: 'credit',
        subtype: 'credit_card',
        balance: -1250.30,
        institution: {
          name: 'Chase Bank',
          logo: '/images/chase_logo.jpeg'
        }
      },
      {
        id: `account-${userId}-3`,
        name: 'SoFi High-Yield Savings',
        type: 'depository',
        subtype: 'savings',
        balance: 15000.00,
        institution: {
          name: 'SoFi',
          logo: '/images/sofi_logo.jpeg'
        }
      }
    ];
    
    console.log(`Fetched accounts for user: ${userId}`);
    
    res.status(200).json({
      accounts: mockAccounts,
      total_balance: mockAccounts.reduce((sum, acc) => sum + acc.balance, 0),
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
