"use client";

import type { AuthUser, LoginRequest, RegisterRequest } from "@supportops/contracts";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ENDPOINTS, apiClient } from "@/lib/api";

import { tokenManager } from "./tokenManager";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          const { data } = await apiClient.get<AuthUser>(ENDPOINTS.USERS.ME);
          setUser(data);
        } catch {
          tokenManager.clear();
        }
      }
      setIsLoading(false);
    };

    void init();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const { data } = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>(ENDPOINTS.AUTH.LOGIN, credentials, { skipAuth: true });

    tokenManager.setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const { data } = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>(ENDPOINTS.AUTH.REGISTER, payload, { skipAuth: true });

    tokenManager.setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    void apiClient.post(ENDPOINTS.AUTH.LOGOUT).catch(() => {
      return;
    });
    tokenManager.clear();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout
    }),
    [isLoading, login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
