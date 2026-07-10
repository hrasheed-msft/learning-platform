// User & Family Types

export type UserRole = 'primary_admin' | 'admin';
export type AgeCategory = 'young_children' | 'children' | 'teens' | 'adults';
export type SubscriptionStatus = 'free' | 'active' | 'expired';

export interface Family {
  id: string;
  name: string;
  primaryAdminId: string;
  createdAt: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: string;
}

export interface User {
  id: string;
  familyId: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  age: number;
  ageCategory: AgeCategory;
  avatarUrl?: string;
  createdAt: string;
  isActive?: boolean;
  isAccountOwner?: boolean;
}

export interface CreateMemberRequest {
  name: string;
  age: number;
  avatarUrl?: string;
}

export interface InviteAdminRequest {
  email: string;
}

// Auth Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  familyName: string;
  contactName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  family: Family;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
