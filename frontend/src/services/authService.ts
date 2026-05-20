import api, { authApi } from './api';
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
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    // Use authApi (no interceptor) to prevent 401 on logout from triggering refresh loop
    try {
      const { useAuthStore } = await import('@/stores/authStore');
      const token = useAuthStore.getState().accessToken;
      await authApi.post('/auth/logout', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // Ignore logout errors - user is logged out locally regardless
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
    // Use authApi (no interceptor) — a 401 here must NOT trigger another refresh attempt
    const response = await authApi.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
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
