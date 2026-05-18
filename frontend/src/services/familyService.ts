import api from './api';
import type { Family, FamilyMember, CreateMemberRequest, InviteAdminRequest, User } from '@/types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Note: Backend routes use /family (not /families) and don't require familyId in URL
// The familyId is derived from the authenticated user's token
export const familyService = {
  async getFamily(_familyId: string): Promise<Family> {
    const response = await api.get<ApiResponse<Family>>('/family');
    return response.data.data;
  },

  async updateFamily(_familyId: string, data: Partial<Family>): Promise<Family> {
    const response = await api.put<ApiResponse<Family>>('/family', data);
    return response.data.data;
  },

  async getMembers(_familyId: string): Promise<FamilyMember[]> {
    const response = await api.get<ApiResponse<FamilyMember[]>>('/family/members');
    return response.data.data;
  },

  async addMember(_familyId: string, data: CreateMemberRequest): Promise<FamilyMember> {
    const response = await api.post<ApiResponse<FamilyMember>>('/family/members', data);
    return response.data.data;
  },

  async updateMember(
    _familyId: string,
    memberId: string,
    data: Partial<CreateMemberRequest>
  ): Promise<FamilyMember> {
    const response = await api.put<ApiResponse<FamilyMember>>(
      `/family/members/${memberId}`,
      data
    );
    return response.data.data;
  },

  async removeMember(_familyId: string, memberId: string): Promise<void> {
    await api.delete(`/family/members/${memberId}`);
  },

  async switchMember(memberId: string): Promise<{ accessToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      `/family/members/${memberId}/switch`
    );
    return response.data.data;
  },

  async getMemberProgress(memberId: string): Promise<unknown> {
    const response = await api.get<ApiResponse<unknown>>(
      `/family/members/${memberId}/progress`
    );
    return response.data.data;
  },

  // Note: Admin management endpoints may need to be added to the backend
  async getAdmins(_familyId: string): Promise<User[]> {
    // This endpoint may not exist in the current backend
    console.warn('getAdmins: endpoint not yet implemented in backend');
    return [];
  },

  async inviteAdmin(_familyId: string, _data: InviteAdminRequest): Promise<{ message: string }> {
    // This endpoint may not exist in the current backend
    console.warn('inviteAdmin: endpoint not yet implemented in backend');
    return { message: 'Not implemented' };
  },

  async removeAdmin(_familyId: string, _adminId: string): Promise<void> {
    // This endpoint may not exist in the current backend
    console.warn('removeAdmin: endpoint not yet implemented in backend');
  },

  async acceptAdminInvite(_token: string): Promise<{ message: string }> {
    // This endpoint may not exist in the current backend
    console.warn('acceptAdminInvite: endpoint not yet implemented in backend');
    return { message: 'Not implemented' };
  },

  async getLearners(): Promise<FamilyMember[]> {
    const response = await api.get<ApiResponse<FamilyMember[]>>('/family/learners');
    return response.data.data;
  },

  async selfEnroll(): Promise<FamilyMember> {
    const response = await api.post<ApiResponse<FamilyMember>>('/family/self-enroll');
    return response.data.data;
  },
};
