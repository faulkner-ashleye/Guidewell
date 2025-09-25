# Plaid Connection Setup Guide

## Issues Fixed

✅ **Fixed duplicate server endpoints** - Corrected route paths in `server/index.ts`
✅ **Added missing dependencies** - Added Express, Plaid, and TypeScript dependencies
✅ **Created environment template** - Added `.env.example` with required variables
✅ **Added development scripts** - Added server and concurrent development scripts

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Plaid Credentials
1. Go to [Plaid Dashboard](https://dashboard.plaid.com/)
2. Create a new application or use existing one
3. Get your **Client ID** and **Secret** from the dashboard
4. Make sure you're in **Sandbox** environment for testing

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual credentials:
   ```env
   PLAID_CLIENT_ID=your_actual_client_id
   PLAID_SECRET=your_actual_secret
   PLAID_ENV=sandbox
   ```

### 4. Start the Development Environment
```bash
# Start both server and React app concurrently
npm run dev

# Or start them separately:
# Terminal 1: Start server
npm run server

# Terminal 2: Start React app
npm start
```

## Server Endpoints

The server now has the correct endpoints:

- `POST /plaid/link/token/create` - Creates link token
- `POST /plaid/item/public_token/exchange` - Exchanges public token for access token
- `GET /plaid/accounts` - Fetches user accounts
- `POST /plaid/institution/logo` - Fetches institution logos

## Testing the Connection

1. Start the development environment
2. Navigate to the onboarding flow
3. Click "Connect with Plaid"
4. Use Plaid's sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`

## Troubleshooting

### Common Issues:

1. **"Plaid unavailable" button**: Check that server is running on port 3001
2. **CORS errors**: Ensure server is running and CORS is configured
3. **Environment variables not loaded**: Make sure `.env` file exists in project root
4. **Dependencies missing**: Run `npm install` to install all dependencies

### Debug Steps:

1. Check server logs for errors
2. Verify environment variables are loaded
3. Test server endpoints directly with curl/Postman
4. Check browser console for frontend errors

## Production Considerations

- Use `PLAID_ENV=production` for live environment
- Store credentials securely (not in code)
- Implement proper error handling
- Add rate limiting and security headers
- Use HTTPS in production
