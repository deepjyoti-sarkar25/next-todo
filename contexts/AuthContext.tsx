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

// Step 6: Authentication service that calls our API
const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
};

// Step 7: Create authentication provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Step 8: Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        
        if (token) {
          // Verify token with server
          const user = await authService.getCurrentUser();
          if (user) {
            localStorage.setItem('user-id', user._id);
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user-data');
            localStorage.removeItem('user-id');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
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
      localStorage.setItem('user-id', user._id);
      
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
      localStorage.setItem('user-id', user._id);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // Step 11: Logout function
  const logout = () => {
    try {
      console.log('Logout initiated...');
      
      // Clear localStorage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      localStorage.removeItem('user-id');
      console.log('localStorage cleared');
      
      // Clear all cookies (more comprehensive approach)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      console.log('Cookies cleared');
      
      // Dispatch logout action
      dispatch({ type: 'LOGOUT' });
      console.log('Logout action dispatched');
      
      // Force a page reload to ensure server-side auth is cleared
      console.log('Redirecting to home page...');
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, try to redirect
      window.location.href = '/';
    }
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