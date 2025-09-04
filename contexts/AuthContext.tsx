'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User, AuthState, AuthAction, LoginCredentials, RegisterCredentials } from '@/types/auth';

// Step 3: Create initial authentication state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Step 4: Create authentication reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Step 5: Create authentication context
const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
} | null>(null);

// Step 6: Mock authentication service (in a real app, this would call your API)
const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, validate against your backend
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Demo User',
        createdAt: new Date(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      return { user, token };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const user: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date(),
    };
    
    const token = 'mock-jwt-token-' + Date.now();
    return { user, token };
  }
};

// Step 7: Create authentication provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Step 8: Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth-token');
        const userData = localStorage.getItem('user-data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          localStorage.setItem('user-id', user.id);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      } finally {
        setIsHydrated(true);
      }
    };

    checkAuth();
  }, []);

  // Step 9: Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { user, token } = await authService.login(credentials);
      
      // Store in localStorage
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-data', JSON.stringify(user));
      localStorage.setItem('user-id', user.id);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // Step 10: Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { user, token } = await authService.register(credentials);
      
      // Store in localStorage
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-data', JSON.stringify(user));
      localStorage.setItem('user-id', user.id);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // Step 11: Logout function
  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    localStorage.removeItem('user-id');
    dispatch({ type: 'LOGOUT' });
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 12: Create custom hook for authentication
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}