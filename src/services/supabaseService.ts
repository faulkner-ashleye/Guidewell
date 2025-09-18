import { supabase, User, Account, Transaction } from '../lib/supabase';

export class SupabaseService {
  // User operations
  static async createUser(userId: string, email?: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .upsert({ id: userId, email }, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    
    return data;
  }

  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  }

  // Account operations
  static async createAccount(accountData: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .insert(accountData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating account:', error);
      return null;
    }
    
    return data;
  }

  static async getUserAccounts(userId: string): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
    
    return data || [];
  }

  static async updateAccountBalance(accountId: string, balance: number): Promise<boolean> {
    const { error } = await supabase
      .from('accounts')
      .update({ balance })
      .eq('id', accountId);
    
    if (error) {
      console.error('Error updating account balance:', error);
      return false;
    }
    
    return true;
  }

  // Transaction operations
  static async createTransaction(transactionData: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .upsert(transactionData, { onConflict: 'account_id,plaid_transaction_id' })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
    
    return data;
  }

  static async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data || [];
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        accounts!inner(user_id)
      `)
      .eq('accounts.user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
    
    return data || [];
  }
}