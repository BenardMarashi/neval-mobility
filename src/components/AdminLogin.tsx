// src/components/AdminLogin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdmin } from '../services/firebase';
import './AdminLogin.css';

interface AdminLoginProps {
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInAdmin(email, password);
      onClose();
      navigate('/admin/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Admin Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;