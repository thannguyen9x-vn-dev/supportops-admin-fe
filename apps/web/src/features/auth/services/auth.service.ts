import type {
  AuthMessageResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  ResetPasswordRequest,
  RegisterRequest,
  RegisterResponse
} from "@supportops/contracts";

import { ENDPOINTS, apiClient } from "@/lib/api";

export const authService = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data, { skipAuth: true }),

  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data, { skipAuth: true }),

  refresh: (refreshToken?: string) =>
    apiClient.post<RefreshTokenResponse>(
      ENDPOINTS.AUTH.REFRESH,
      refreshToken ? { refreshToken } : undefined,
      { skipAuth: true }
    ),

  logout: () => apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<AuthMessageResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD, data, { skipAuth: true }),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<AuthMessageResponse>(ENDPOINTS.AUTH.RESET_PASSWORD, data, { skipAuth: true })
};
