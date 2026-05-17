import api from './api';
import type {
  ChildLoginRequest,
  ChildAuthResponse,
  SetCredentialsRequest,
  SetCredentialsResponse,
} from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const childAuthService = {
  async childLogin(credentials: ChildLoginRequest): Promise<ChildAuthResponse> {
    const response = await api.post<ApiResponse<ChildAuthResponse>>(
      '/auth/child-login',
      credentials
    );
    return response.data.data;
  },

  async setCredentials(
    memberId: string,
    data: SetCredentialsRequest
  ): Promise<SetCredentialsResponse> {
    const response = await api.post<ApiResponse<SetCredentialsResponse>>(
      `/family/members/${memberId}/credentials`,
      data
    );
    return response.data.data;
  },
};
