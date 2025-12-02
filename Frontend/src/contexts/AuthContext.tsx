import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const MOCK_USER: User = {
  id: 'u1',
  email: 'warden@university.edu',
  name: 'Admin Warden',
  avatar: undefined,
  role: 'admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('hostel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      const accessToken = data.access_token;
      localStorage.setItem('hostel_access_token', accessToken);

      // fetch user info
      const me = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const meData = await me.json();
      const authUser: User = {
        id: meData.id,
        email: meData.email,
        name: meData.name,
        avatar: meData.avatar,
        role: meData.role as 'admin' | 'staff',
      };
      setUser(authUser);
      localStorage.setItem('hostel_user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock Google OAuth - in production, this would redirect to:
      // GET /api/auth/google -> Google OAuth -> /api/auth/google/callback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const googleUser: User = {
        ...MOCK_USER,
        name: 'Google User',
        email: 'user@gmail.com',
      };
      setUser(googleUser);
      localStorage.setItem('hostel_user', JSON.stringify(googleUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('hostel_access_token');
      await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
      console.warn('Logout request failed', e);
    }
    setUser(null);
    localStorage.removeItem('hostel_user');
    localStorage.removeItem('hostel_access_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
