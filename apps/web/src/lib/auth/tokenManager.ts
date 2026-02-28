import { env } from "@/lib/config/env";

class TokenManager {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    if (this.accessToken) {
      return this.accessToken;
    }

    const stored = sessionStorage.getItem(env.ACCESS_TOKEN_KEY);
    if (stored) {
      this.accessToken = stored;
      return stored;
    }

    return null;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(env.ACCESS_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(env.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(env.REFRESH_TOKEN_KEY, token);
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clear(): void {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(env.ACCESS_TOKEN_KEY);
      localStorage.removeItem(env.REFRESH_TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

export const tokenManager = new TokenManager();
