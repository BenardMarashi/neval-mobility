// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;