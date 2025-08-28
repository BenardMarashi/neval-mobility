// src/components/FirebaseStatus.tsx - NEW FILE
import React, { useEffect, useState } from 'react';
import { isFirebaseInitialized } from '../services/firebase';

const FirebaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const checkStatus = () => {
      setStatus(isFirebaseInitialized() ? 'connected' : 'error');
    };
    
    // Check after a short delay to allow initialization
    setTimeout(checkStatus, 1000);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: '8px 16px',
        background: status === 'connected' ? '#4caf50' : status === 'error' ? '#f44336' : '#ff9800',
        color: 'white',
        fontSize: '12px',
        borderRadius: '4px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      {status === 'connected' && '✅ Firebase Connected'}
      {status === 'error' && '❌ Firebase Error - Check .env.local'}
      {status === 'checking' && '⏳ Checking Firebase...'}
    </div>
  );
};

export default FirebaseStatus;