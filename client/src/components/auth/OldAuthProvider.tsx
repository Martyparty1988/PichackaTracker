import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { CONSTANTS } from '@/lib/constants';

interface User {
  id: number;
  username: string;
  displayName: string;
  avatarInitials: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve(),
  logout: () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get stored user data
        const storedUser = localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_USER);
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Or fetch from API if token exists
          const token = localStorage.getItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
          
          if (token) {
            const response = await apiRequest('GET', '/api/auth/me');
            const userData = await response.json();
            
            setUser(userData);
            localStorage.setItem(CONSTANTS.STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_USER);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const data = await response.json();
      
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, data.token);
      
      if (rememberMe) {
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
      }
      
      setUser(data.user);
    } catch (error) {
      throw new Error('Nesprávné přihlašovací údaje');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.AUTH_USER);
      setUser(null);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
