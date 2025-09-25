const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Check if environment variables are loaded
console.log('Environment check:');
console.log('PLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID ? 'Set' : 'Missing');
console.log('PLAID_SECRET:', process.env.PLAID_SECRET ? 'Set' : 'Missing');
console.log('PLAID_ENV:', process.env.PLAID_ENV || 'sandbox');

const cfg = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaid = new PlaidApi(cfg);

// 1) Create link token
app.post('/plaid/link/token/create', async (req, res) => {
  try {
    console.log('Creating link token for user:', req.body?.userId);
    const userId = req.body?.userId || 'demo-user-123';
    const r = await plaid.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Guidewell',
      products: ['auth', 'transactions', 'liabilities'],
      country_codes: ['US'],
      language: 'en',
    });
    console.log('Link token created successfully');
    res.json({ link_token: r.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token', details: error.message });
  }
});

// 2) Exchange public token (simplified - no database storage)
app.post('/plaid/item/public_token/exchange', async (req, res) => {
  try {
    console.log('Exchanging public token');
    const { public_token, userId = 'demo-user-123' } = req.body || {};
    const ex = await plaid.itemPublicTokenExchange({ public_token });
    console.log('Public token exchanged successfully');
    res.json({ 
      item_id: ex.data.item_id,
      access_token: ex.data.access_token 
    });
  } catch (error) {
    console.error('Error in token exchange:', error);
    res.status(500).json({ error: 'Token exchange failed', details: error.message });
  }
});

// 3) Fetch accounts (simplified - using access token directly)
app.get('/plaid/accounts', async (req, res) => {
  try {
    const { access_token, userId = 'demo-user-123' } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }
    
    console.log('Fetching accounts for user:', userId);
    
    const [acct, liab] = await Promise.all([
      plaid.accountsGet({ access_token }),
      plaid.liabilitiesGet({ access_token }).catch(() => ({ data: { liabilities: {} } })),
    ]);

    const accounts = acct.data.accounts.map((a) => ({
      id: a.account_id,
      type:
        a.type === 'depository' ? (a.subtype === 'savings' ? 'savings' : 'checking') :
        a.type === 'credit' ? 'credit_card' :
        a.type === 'loan' ? 'loan' :
        a.type === 'investment' ? 'investment' : 'checking',
      name: a.name || a.official_name || `${a.type} ${a.subtype}`,
      balance: a.balances.current || 0,
      apr: undefined,
      minPayment: undefined,
      institutionId: a.institution_id,
      institutionName: a.institution_name,
    }));

    const cc = liab.data.liabilities?.credit || [];
    const student = liab.data.liabilities?.student || [];

    for (const c of cc) {
      const i = accounts.findIndex((a) => a.id === c.account_id);
      if (i >= 0) {
        accounts[i].apr = c.aprs?.purchase_apr || c.apr || accounts[i].apr;
        accounts[i].minPayment = c.minimum_payment_amount || accounts[i].minPayment;
      }
    }
    for (const s of student) {
      const i = accounts.findIndex((a) => a.id === s.account_id);
      if (i >= 0) {
        accounts[i].apr = s.interest_rate_percentage || accounts[i].apr;
        accounts[i].minPayment = s.minimum_payment_amount || accounts[i].minPayment;
      }
    }

    console.log('Accounts fetched successfully:', accounts.length, 'accounts');
    res.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`🚀 Simple Plaid API running on port ${port}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   POST /plaid/link/token/create`);
  console.log(`   POST /plaid/item/public_token/exchange`);
  console.log(`   GET /plaid/accounts`);
  console.log(`   GET /health`);
});