export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1",
  ACCESS_TOKEN_KEY: "supportops_access_token"
} as const;
