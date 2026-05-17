import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Login attempt with email:', credentials.email);
      console.log('API URL:', import.meta.env.VITE_API_URL || '/api/v1');
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors - user should still be logged out locally
      console.error('Logout error:', error);
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data);
    return { message: response.data.message || 'Password reset email sent' };
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data);
    return { message: response.data.message || 'Password reset successfully' };
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.get<ApiResponse<{ message: string }>>(`/auth/verify-email/${token}`);
    return { message: response.data.message || 'Email verified successfully' };
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },

  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/resend-verification');
    return { message: response.data.message || 'Verification email sent' };
  },
};
