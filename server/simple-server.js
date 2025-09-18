const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple Plaid endpoints (without Supabase for now)
app.post('/plaid/link/token/create', async (req, res) => {
  res.json({ 
    link_token: 'test-token',
    message: 'Plaid integration coming soon'
  });
});

app.post('/plaid/item/public_token/exchange', async (req, res) => {
  res.json({ 
    item_id: 'test-item-id',
    message: 'Token exchange successful'
  });
});

app.get('/plaid/accounts', async (req, res) => {
  res.json({ 
    accounts: [],
    message: 'No accounts found'
  });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET /test (health check)`);
  console.log(`   POST /plaid/link/token/create`);
  console.log(`   POST /plaid/item/public_token/exchange`);
  console.log(`   GET /plaid/accounts`);
});

module.exports = app;
