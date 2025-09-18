import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || 'https://wweuekmcecbbxtrlqown.supabase.co'
const supabaseAnonKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZXVla21jZWNiYnh0cmxxb3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4OTAwNDcsImV4cCI6MjA3MzQ2NjA0N30.RHQQp-9nth7LqbfJBs3znVN_bpZTWRoSm5xUOfyN88Y'

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  user_id: string
  plaid_item_id: string
  plaid_access_token: string
  account_id: string
  account_name: string
  account_type: string
  account_subtype: string
  balance?: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  account_id: string
  plaid_transaction_id: string
  amount: number
  date: string
  name: string
  merchant_name?: string
  category?: string[]
  created_at: string
}


