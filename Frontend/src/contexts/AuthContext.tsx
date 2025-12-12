import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ------------------------
  // Fetch current user on mount
  // ------------------------
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user || data); // adapt depending on backend response
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ------------------------
  // Login
  // ------------------------
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // important for httpOnly cookie
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // fetch user info after login
      const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: 'include',
      });
      if (!meRes.ok) throw new Error('Failed to fetch user info');
      const meData = await meRes.json();
      setUser(meData.user || meData);

      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------
  // Logout
  // ------------------------
  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout failed', err);
    } finally {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------
// Hook to use auth
// ------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
