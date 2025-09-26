// Vercel serverless function for fetching Plaid institution logos
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { institutionId } = req.body;

    if (!institutionId) {
      return res.status(400).json({ error: 'Institution ID is required' });
    }

    // Check if Plaid credentials are configured
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      console.log('Plaid credentials not configured, using mock institution data');
      return res.status(200).json({
        logo: null,
        name: 'Mock Bank',
        primaryColor: '#0066CC',
        url: 'https://example.com'
      });
    }

    // Fetch real institution data from Plaid
    const response = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US']
    });

    console.log(`Fetched institution data for: ${institutionId}`);
    
    res.status(200).json({
      logo: response.data.institution.logo,
      name: response.data.institution.name,
      primaryColor: response.data.institution.primary_color,
      url: response.data.institution.url
    });
  } catch (error) {
    console.error('Error fetching institution logo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
