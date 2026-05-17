// Child Auth Types

import type { AgeCategory } from './user';

export interface ChildLoginRequest {
  username: string;
  password: string;
}

export interface ChildMember {
  id: string;
  familyId: string;
  name: string;
  age: number;
  ageCategory: AgeCategory;
  avatarUrl?: string;
  username: string;
}

export interface ChildAuthResponse {
  token: string;
  refreshToken: string;
  member: ChildMember;
}

export interface SetCredentialsRequest {
  username: string;
  password: string;
}

export interface SetCredentialsResponse {
  username: string;
  message: string;
}
