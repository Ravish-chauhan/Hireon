import api from './api';

export const authService = {
  register: async (userData: any): Promise<any> => {
    const { name, email, phone, password } = userData;
    const response = await api.post('/auth/register', {
      fullName: name,
      email,
      phone,
      password
    });
    return response.data;
  },

  login: async (email: string, password: string, rememberMe: boolean = false): Promise<any> => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  verifyRegistrationOTP: async (tempToken: string, otp: string): Promise<any> => {
    return await api.post('/auth/verify-registration-otp', { tempToken, otp });
  },

  resendRegistrationOTP: async (tempToken: string): Promise<any> => {
    return await api.post('/auth/resend-registration-otp', { tempToken });
  },

  verifyEmail: async (token: string): Promise<any> => {
    return await api.get(`/auth/verify-email?token=${token}`);
  },

  validateToken: async (token: string): Promise<any> => {
    console.log('🔍 AuthService: Validating token...', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 20) + '...'
    });
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ AuthService: Token validation response:', {
        hasData: !!response,
        userEmail: response?.data?.email,
        userId: response?.data?.id
      });
      return response.data;
    } catch (error: any) {
      console.error('💥 AuthService: Token validation failed:', {
        status: error.status,
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  requestPasswordReset: async (email: string): Promise<any> => {
    return await api.post('/auth/request-reset', { email });
  },

  resetPassword: async (token: string, password: string): Promise<any> => {
    return await api.post('/auth/reset-password', { token, password });
  },

  refreshToken: async (refreshToken: string): Promise<any> => {
    return await api.post('/auth/refresh', { refreshToken });
  },

  logout: async (): Promise<any> => {
    return await api.post('/auth/logout');
  },
};
