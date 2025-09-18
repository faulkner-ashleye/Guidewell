import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Simple test query to check if Supabase is accessible
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        setStatus('error');
        setMessage(`Connection failed: ${error.message}`);
      } else {
        setStatus('connected');
        setMessage('Supabase connection successful!');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(`Connection error: ${err.message}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      margin: '16px 0',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ 
          display: 'inline-block', 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: getStatusColor(),
          marginRight: '8px'
        }}></span>
        <strong>Supabase Status:</strong>
      </div>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>
        {status === 'checking' ? 'Checking connection...' : message}
      </div>
      {status === 'error' && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#dc2626'
        }}>
          <strong>Note:</strong> You may need to set up your database schema in Supabase first.
          Check the SUPABASE_SETUP.md file for instructions.
        </div>
      )}
    </div>
  );
}



