
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { toast } from 'sonner';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// This would be replaced with actual authentication when connected to Supabase
// For now, we'll use localStorage for demo purposes
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('taskUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('taskUser');
      }
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'demo@example.com' && password === 'password') {
        const user = { id: '1', name: 'Demo User', email };
        localStorage.setItem('taskUser', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        toast.success('Logged in successfully');
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
        toast.error('Invalid email or password');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed' });
      toast.error('Login failed');
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = { id: Date.now().toString(), name, email };
      localStorage.setItem('taskUser', JSON.stringify(user));
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
      toast.success('Registered successfully');
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: 'Registration failed' });
      toast.error('Registration failed');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('taskUser');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
