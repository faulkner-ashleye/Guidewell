// Vercel serverless function for fetching Plaid accounts
import { PlaidApi, PlaidEnvironments, Configuration } from 'plaid';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { access_token, userId } = req.query;

    if (!access_token || !userId) {
      return res.status(400).json({ error: 'access_token and userId are required' });
    }

    // Check if Plaid credentials are configured
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      console.log('Plaid credentials not configured, using mock accounts');
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
      
      return res.status(200).json({
        accounts: mockAccounts,
        total_balance: mockAccounts.reduce((sum, acc) => sum + acc.balance, 0),
      });
    }

    // Fetch real accounts from Plaid sandbox
    const response = await plaidClient.accountsGet({
      access_token: access_token,
    });
    
    // Transform Plaid accounts to our format
    const accounts = response.data.accounts.map(account => ({
      id: account.account_id,
      name: account.name || account.official_name || `${account.type} ${account.subtype}`,
      type: account.type,
      subtype: account.subtype,
      balance: account.balances.current || 0,
      institution: {
        name: account.institution_name || 'Unknown Bank',
        logo: null // Plaid doesn't provide logos in sandbox
      }
    }));
    
    console.log(`Fetched ${accounts.length} real accounts for user: ${userId}`);
    
    res.status(200).json({
      accounts: accounts,
      total_balance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
