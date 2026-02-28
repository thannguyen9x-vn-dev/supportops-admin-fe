export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  tenantId: string;
  tenantName: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export interface RegisterResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";
