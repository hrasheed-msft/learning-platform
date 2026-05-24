// Child Auth Types

export interface ChildLoginRequest {
  username: string;
  password: string;
}

export interface ChildMember {
  id: string;
  name: string;
  ageCategory: string;
  avatarUrl?: string | null;
  familyId?: string;
  age?: number;
  username?: string;
}

export interface ChildAuthResponse {
  accessToken: string;
  refreshToken?: string | null;
  member: ChildMember;
  family?: {
    id: string;
    name: string;
  };
}

export interface SetCredentialsRequest {
  username: string;
  password: string;
}

export interface SetCredentialsResponse {
  username: string;
  message: string;
}
