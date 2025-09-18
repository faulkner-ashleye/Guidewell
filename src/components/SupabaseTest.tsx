import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SupabaseService } from '../services/supabaseService';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        setConnectionStatus('error');
        setTestResults(prev => [...prev, `❌ Connection failed: ${error.message}`]);
      } else {
        setConnectionStatus('connected');
        setTestResults(prev => [...prev, '✅ Supabase connection successful']);
      }
    } catch (err) {
      setConnectionStatus('error');
      setTestResults(prev => [...prev, `❌ Connection error: ${err}`]);
    }
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Create Test User',
        test: async () => {
          const user = await SupabaseService.createUser('test-user-123', 'test@example.com');
          return user ? '✅ User created successfully' : '❌ Failed to create user';
        }
      },
      {
        name: 'Fetch Test User',
        test: async () => {
          const user = await SupabaseService.getUser('test-user-123');
          return user ? '✅ User fetched successfully' : '❌ Failed to fetch user';
        }
      },
      {
        name: 'Create Test Account',
        test: async () => {
          const account = await SupabaseService.createAccount({
            user_id: 'test-user-123',
            plaid_item_id: 'test-item-123',
            plaid_access_token: 'test-token-123',
            account_id: 'test-account-123',
            account_name: 'Test Account',
            account_type: 'checking',
            account_subtype: 'checking',
            balance: 1000.00
          });
          return account ? '✅ Account created successfully' : '❌ Failed to create account';
        }
      },
      {
        name: 'Fetch User Accounts',
        test: async () => {
          const accounts = await SupabaseService.getUserAccounts('test-user-123');
          return accounts.length > 0 ? '✅ Accounts fetched successfully' : '❌ No accounts found';
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, `${test.name}: ${result}`]);
      } catch (error) {
        setTestResults(prev => [...prev, `${test.name}: ❌ Test failed - ${error}`]);
      }
    }

    setIsRunningTests(false);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9fafb'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>
        Supabase Integration Test
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <span style={{ 
          display: 'inline-block', 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: getStatusColor(),
          marginRight: '8px'
        }}></span>
        Status: {connectionStatus === 'checking' ? 'Checking...' : 
                connectionStatus === 'connected' ? 'Connected' : 'Error'}
      </div>

      <button 
        onClick={runTests}
        disabled={isRunningTests || connectionStatus === 'error'}
        style={{
          padding: '8px 16px',
          backgroundColor: connectionStatus === 'connected' ? '#3b82f6' : '#9ca3af',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
          marginBottom: '16px'
        }}
      >
        {isRunningTests ? 'Running Tests...' : 'Run Database Tests'}
      </button>

      {testResults.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          borderRadius: '4px',
          border: '1px solid #d1d5db'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Test Results:</h4>
          {testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '4px', fontFamily: 'monospace' }}>
              {result}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
        <p><strong>Note:</strong> Make sure you have:</p>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Created the database tables using the schema.sql file</li>
          <li>Set up your environment variables (.env file)</li>
          <li>Configured Row Level Security policies</li>
        </ul>
      </div>
    </div>
  );
}



