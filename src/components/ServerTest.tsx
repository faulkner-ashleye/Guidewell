import { useEffect, useState } from 'react';

export default function ServerTest() {
  const [status, setStatus] = useState<string>('Testing...');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const testServer = async () => {
      try {
        console.log('Testing server connection...');
        const response = await fetch('http://localhost:3001/test');
        const data = await response.json();
        setStatus('✅ Server connected!');
        setDetails(JSON.stringify(data, null, 2));
        console.log('Server test successful:', data);
      } catch (error: any) {
        setStatus('❌ Server connection failed');
        setDetails(error.message);
        console.error('Server test failed:', error);
      }
    };

    testServer();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Server Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
        {details}
      </pre>
    </div>
  );
}






