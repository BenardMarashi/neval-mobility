// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isUserAdmin } from '../services/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // ULTRA-THINK: Check admin status
      if (user) {
        const adminStatus = await isUserAdmin(user);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};