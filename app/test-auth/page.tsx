'use client';

import { useState } from 'react';
import { api } from '@/lib/services/api';

export default function TestAuth() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('🔄 Testing login...');
      console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE);
      
      const response = await api.post('/api/user/login', {
        email: 'testuser@example.com',
        password: 'test123'
      });
      
      console.log('✅ Success response:', response.data);
      setResult(`✅ Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.log('❌ Error:', error);
      console.log('❌ Error response:', error?.response);
      console.log('❌ Error data:', error?.response?.data);
      setResult(`❌ Error: ${error?.message}\nResponse: ${JSON.stringify(error?.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testInvalidLogin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('🔄 Testing invalid login...');
      
      const response = await api.post('/api/user/login', {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
      
      console.log('✅ Unexpected success:', response.data);
      setResult(`⚠️ Unexpected success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.log('❌ Expected error:', error);
      console.log('❌ Error response:', error?.response);
      console.log('❌ Error data:', error?.response?.data);
      setResult(`✅ Expected error: ${error?.message}\nResponse: ${JSON.stringify(error?.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Valid Login'}
        </button>
        
        <button
          onClick={testInvalidLogin}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Invalid Login'}
        </button>
      </div>
      
      <div className="mb-4">
        <strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE || 'Not set'}
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
