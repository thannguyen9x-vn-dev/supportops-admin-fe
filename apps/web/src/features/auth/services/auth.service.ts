import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse
} from "@supportops/contracts";

import { ENDPOINTS, apiClient } from "@/lib/api";

export const authService = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data, { skipAuth: true }),

  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data, { skipAuth: true }),

  refresh: () => apiClient.post<RefreshTokenResponse>(ENDPOINTS.AUTH.REFRESH, undefined, { skipAuth: true }),

  logout: () => apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT)
};
