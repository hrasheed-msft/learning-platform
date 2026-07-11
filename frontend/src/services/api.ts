import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useFamilyStore } from '@/stores/familyStore';

/**
 * Extended request config that allows callers to suppress the interceptor's
 * hard-navigation behavior (window.location.href) on 401/403 errors.
 * Audio and other background requests use this so failures show inline errors
 * rather than navigating the user away from their current page.
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean;
}

// Create axios instance
// Note: Backend API is at /api/v1, Vite proxy forwards /api to localhost:3000
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Separate axios instance for auth operations (refresh/logout) that bypasses
// the response interceptor to prevent infinite retry loops.
export const authApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Token refresh state — prevents concurrent refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onRefreshComplete(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function waitForRefresh(): Promise<string | null> {
  return new Promise((resolve) => {
    refreshSubscribers.push(resolve);
  });
}

// Request interceptor - add auth token and active member header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken: parentAccessToken } = useAuthStore.getState();
    const { accessToken: childAccessToken } = useChildAuthStore.getState();
    const accessToken = parentAccessToken || childAccessToken;

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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; skipAuthRedirect?: boolean };
    const skipRedirect = originalRequest?.skipAuthRedirect === true;

    // Handle 403 with NO_ACTIVE_MEMBER — redirect to learner picker
    if (error.response?.status === 403) {
      const data = error.response.data as { error?: string } | undefined;
      if (data?.error === 'NO_ACTIVE_MEMBER') {
        if (!skipRedirect) {
          window.location.href = '/select-learner';
        }
        return Promise.reject(new Error('No active learner selected'));
      }
    }

    // Handle 401 Unauthorized - try to refresh token (once only)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const childAuth = useChildAuthStore.getState();
      if (childAuth.isChildSession) {
        if (!skipRedirect) {
          childAuth.logout();
          window.location.href = '/child-login';
        }
        return Promise.reject(error);
      }

      const { refreshToken, accessToken } = useAuthStore.getState();

      // No tokens at all — go straight to login, don't attempt refresh
      if (!refreshToken && !accessToken) {
        if (!skipRedirect) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // If a refresh is already in progress, wait for it instead of firing another
      if (isRefreshing) {
        const newToken = await waitForRefresh();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        await useAuthStore.getState().refreshAuth();
        const { accessToken: newToken } = useAuthStore.getState();

        isRefreshing = false;
        onRefreshComplete(newToken);

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshComplete(null);
        if (!skipRedirect) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors — preserve the original AxiosError so callers
    // that need response.status (e.g. ParentPinModal 429 lockout check) still work.
    const message = getErrorMessage(error);
    error.message = message;
    return Promise.reject(error);
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
