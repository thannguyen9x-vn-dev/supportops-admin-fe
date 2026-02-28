import { env } from "@/lib/config/env";

const REFRESH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=")[1] ?? "");
}

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

    return localStorage.getItem(env.REFRESH_TOKEN_KEY) ?? getCookieValue(env.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(env.REFRESH_TOKEN_KEY, token);
      document.cookie = `${env.REFRESH_TOKEN_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${REFRESH_TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
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
      document.cookie = `${env.REFRESH_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

export const tokenManager = new TokenManager();
