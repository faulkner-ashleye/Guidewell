import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // adjust origin to your dev client
app.use(express.json());

const cfg = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});
const plaid = new PlaidApi(cfg);

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wweuekmcecbbxtrlqown.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// 1) Create link token
app.post('/plaid/link/token/create', async (req: Request, res: Response) => {
  const userId = (req.body?.userId as string) || 'demo-user-123';
  const r = await plaid.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'Guidewell',
    products: ['auth', 'transactions', 'liabilities'] as any,
    country_codes: ['US'] as any,
    language: 'en',
  });
  res.json({ link_token: r.data.link_token });
});

// 2) Exchange public token
app.post('/plaid/link/token/create', async (req: Request, res: Response) => {
  try {
    const { public_token, userId = 'demo-user-123' } = req.body || {};
    const ex = await plaid.itemPublicTokenExchange({ public_token });
    
    // Store or update user in Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({ id: userId }, { onConflict: 'id' })
      .select()
      .single();
    
    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    
    // Store access token and item_id in accounts table
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .upsert({
        user_id: userId,
        plaid_item_id: ex.data.item_id,
        plaid_access_token: ex.data.access_token,
        account_id: ex.data.item_id, // Using item_id as account_id for now
        account_name: 'Plaid Item',
        account_type: 'item',
        account_subtype: 'item'
      }, { onConflict: 'user_id,account_id' })
      .select()
      .single();
    
    if (accountError) {
      console.error('Error storing account:', accountError);
      return res.status(500).json({ error: 'Failed to store account' });
    }
    
    res.json({ item_id: ex.data.item_id });
  } catch (error) {
    console.error('Error in token exchange:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// 3) Fetch accounts + liabilities and map
app.post('/plaid/link/token/create', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'demo-user-123';
    
    // Get access token from Supabase
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('plaid_access_token')
      .eq('user_id', userId)
      .single();
    
    if (accountError || !accountData) {
      return res.status(404).json({ error: 'No linked item found' });
    }
    
    const [acct, liab] = await Promise.all([
      plaid.accountsGet({ access_token: accountData.plaid_access_token }),
      plaid.liabilitiesGet({ access_token: accountData.plaid_access_token }).catch(() => ({ data: { liabilities: {} as any } })),
    ]);

  const accounts = acct.data.accounts.map((a: any) => ({
    id: a.account_id,
    type:
      a.type === 'depository' ? (a.subtype === 'savings' ? 'savings' : 'checking') :
      a.type === 'credit' ? 'credit_card' :
      a.type === 'loan' ? 'loan' :
      a.type === 'investment' ? 'investment' : 'checking',
    name: a.name || a.official_name || `${a.type} ${a.subtype}`,
    balance: a.balances.current || 0,
    apr: undefined as number | undefined,
    minPayment: undefined as number | undefined,
  }));

  const cc = liab.data.liabilities?.credit || [];
  const student = liab.data.liabilities?.student || [];

  for (const c of cc) {
    const i = accounts.findIndex((a: any) => a.id === c.account_id);
    if (i >= 0) {
      accounts[i].apr = c.aprs?.purchase_apr || (c as any).apr || accounts[i].apr;
    accounts[i].minPayment = c.minimum_payment_amount || accounts[i].minPayment;
    }
  }
  for (const s of student) {
    const i = accounts.findIndex((a: any) => a.id === s.account_id);
    if (i >= 0) {
      accounts[i].apr = s.interest_rate_percentage || accounts[i].apr;
      accounts[i].minPayment = s.minimum_payment_amount || accounts[i].minPayment;
    }
  }

    res.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
  console.log(`📡 Plaid endpoints available:`);
  console.log(`   POST /plaid/link/token/create`);
  console.log(`   POST /plaid/item/public_token/exchange`);
  console.log(`   GET /plaid/accounts`);
});
