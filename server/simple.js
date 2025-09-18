const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// CORS preflight test
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Mock Plaid endpoints
app.post('/plaid/link/token/create', (req, res) => {
  console.log('Creating link token for user:', req.body.userId);
  res.json({ 
    link_token: 'test-link-token-' + Date.now(),
    expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
  });
});

app.post('/plaid/item/public_token/exchange', (req, res) => {
  console.log('Exchanging public token:', req.body.public_token);
  res.json({ 
    item_id: 'test-item-' + Date.now(),
    access_token: 'test-access-token-' + Date.now()
  });
});

app.get('/plaid/accounts', (req, res) => {
  console.log('Fetching accounts for user:', req.query.userId);
  res.json({ 
    accounts: [
      {
        id: 'test-checking-' + Date.now(),
        type: 'checking',
        name: 'Test Checking Account',
        balance: 1500.00,
        apr: undefined,
        minPayment: undefined
      },
      {
        id: 'test-savings-' + Date.now(),
        type: 'savings',
        name: 'Test Savings Account',
        balance: 5000.00,
        apr: undefined,
        minPayment: undefined
      }
    ]
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`🚀 Simple server running on port ${port}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET  /test`);
  console.log(`   POST /plaid/link/token/create`);
  console.log(`   POST /plaid/item/public_token/exchange`);
  console.log(`   GET  /plaid/accounts`);
});
