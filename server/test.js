const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/plaid/link/token/create', (req, res) => {
  res.json({ link_token: 'test-token-123' });
});

const port = 3001;
app.listen(port, () => {
  console.log(`🚀 Test server running on port ${port}`);
});






