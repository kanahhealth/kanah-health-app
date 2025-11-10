import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import mockUsers from '@/data/mockUsers.json';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (token && userData) {
        // Verify token is still valid (you can add API call here)
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check against mock users
      const users = mockUsers as MockUser[];
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const user: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };
      const mockToken = 'mock_token_' + Date.now();

      // Store auth data
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));

      setUser(user);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user already exists
      const users = mockUsers as MockUser[];
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: String(Date.now()), // Simple ID generation
        email,
        name: name || email.split('@')[0],
      };
      const mockToken = 'mock_token_' + Date.now();

      // Store auth data
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(newUser));

      setUser(newUser);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkAuth,
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

