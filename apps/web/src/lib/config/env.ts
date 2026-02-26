export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
  ACCESS_TOKEN_KEY: "supportops_access_token",
  REFRESH_TOKEN_KEY: "supportops_refresh_token"
} as const;
