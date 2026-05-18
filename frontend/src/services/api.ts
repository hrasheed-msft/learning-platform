import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useFamilyStore } from '@/stores/familyStore';

// Create axios instance
// Note: Backend API is at /api/v1, Vite proxy forwards /api to localhost:3000
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token and active member header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const { selectedMember } = useFamilyStore.getState();
    if (selectedMember?.id) {
      config.headers['x-active-member-id'] = selectedMember.id;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 403 with NO_ACTIVE_MEMBER — redirect to learner picker
    if (error.response?.status === 403) {
      const data = error.response.data as { error?: string } | undefined;
      if (data?.error === 'NO_ACTIVE_MEMBER') {
        window.location.href = '/select-learner';
        return Promise.reject(new Error('No active learner selected'));
      }
    }

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshAuth();
        const { accessToken } = useAuthStore.getState();
        
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = getErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

// Helper to extract error message
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as { message?: string; error?: string | { message?: string } };
    const errorField = typeof data.error === 'string' ? data.error : data.error?.message;
    const message = data.message || errorField || 'An error occurred';
    console.error('API Error Response:', { status: error.response.status, data, message });
    return message;
  }
  if (error.message) {
    console.error('API Error Message:', error.message);
    return error.message;
  }
  console.error('API Unknown Error:', error);
  return 'An unexpected error occurred';
}

export default api;
