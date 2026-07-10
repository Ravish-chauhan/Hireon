export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface ApiError {
  error: string;
}