import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { setToken, getToken, removeToken } from '../utils/storage';
import toast from 'react-hot-toast';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  handleTokenExpired: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    console.log('🔍 AuthContext: Checking authentication...');
    try {
      const token = getToken();
      console.log('🔑 AuthContext: Token check:', {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0
      });
      
      if (token) {
        console.log('📤 AuthContext: Validating token...');
        const userData = await authService.validateToken(token);
        console.log('✅ AuthContext: Token valid, user data:', {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName,
          profilePicture: userData.profilePicture
        });
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('❌ AuthContext: No token found, clearing auth state');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.log('💥 AuthContext: Token validation failed:', {
        error: error.message,
        status: error.status
      });
      
      // If token expired, show re-login modal
      if (error.status === 401 || error.message?.includes('expired')) {
        handleTokenExpired();
      } else {
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTokenExpired = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    toast.error('Session expired. Please login again.');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    console.log('🚀 AuthContext: Login attempt for:', email);
    try {
      const response = await authService.login(email, password, rememberMe);
      console.log('✅ AuthContext: Login successful:', {
        hasToken: !!response.accessToken,
        user: response.user
      });
      
      setToken(response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('eduniaa_refresh_token', response.refreshToken);
      }
      
      // Fetch user data to ensure we have complete user info
      try {
        console.log('📤 AuthContext: Validating new token...');
        const userData = await authService.validateToken(response.accessToken);
        console.log('✅ AuthContext: Token validation successful');
        setUser(userData);
      } catch (validationError) {
        console.log('⚠️ AuthContext: Token validation failed, using response data');
        // Fallback to response user data if validation fails
        setUser(response.user);
      }
      
      setIsAuthenticated(true);
      console.log('🏆 AuthContext: Login process complete');
      
      // Show success message based on current domain
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes('localhost')) {
        toast.success('Login successful! Welcome to EduNiaa');
      } else {
        toast.success(response.message || 'Login successful!');
      }
      
      return response;
    } catch (error: any) {
      console.log('💥 AuthContext: Login failed:', error);
      toast.error(error.error || 'Login failed');
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log('🚀 AuthContext: Starting registration...');
      const response = await authService.register(userData);
      console.log('✅ AuthContext: Registration response:', {
        hasAccessToken: !!response.accessToken,
        hasUser: !!response.user,
        message: response.message
      });
      
      // Auto-login after registration
      if (response.accessToken) {
        console.log('🔑 AuthContext: Setting token and user...');
        setToken(response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('eduniaa_refresh_token', response.refreshToken);
        }
        setUser(response.user);
        setIsAuthenticated(true);
        console.log('✅ AuthContext: Auto-login completed');
      } else {
        console.log('❌ AuthContext: No access token in response');
      }
      
      toast.success(response.message || 'Registration successful! Welcome to EduNiaa.');
      return response;
    } catch (error: any) {
      console.log('💥 AuthContext: Registration failed:', error);
      toast.error(error.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const handleSetUser = (userData: User | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
  };

  const setTokens = async (accessToken: string, refreshToken: string) => {
    console.log('🔄 AuthContext: Setting tokens...');
    try {
      setToken(accessToken);
      localStorage.setItem('eduniaa_refresh_token', refreshToken);
      console.log('💾 AuthContext: Tokens stored, validating...');
      
      const userData = await authService.validateToken(accessToken);
      console.log('✅ AuthContext: User data received:', userData.email);
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      console.log('🎉 AuthContext: Authentication complete');
    } catch (error) {
      console.error('💥 AuthContext: Failed to set tokens:', error);
      removeToken();
      localStorage.removeItem('eduniaa_refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = getToken();
    if (token && isAuthenticated) {
      try {
        const userData = await authService.validateToken(token);
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    setUser: handleSetUser,
    setTokens,
    refreshUser,
    handleTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};









