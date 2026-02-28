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

  clear(): void {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(env.ACCESS_TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

export const tokenManager = new TokenManager();
