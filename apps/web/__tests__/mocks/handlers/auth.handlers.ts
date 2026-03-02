import { http, HttpResponse } from "msw";

import { mockUser } from "../data/users";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const authHandlers = [
  http.post(`${BASE}/auth/login`, async () =>
    HttpResponse.json({
      data: {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        expiresIn: 3600,
        user: mockUser
      }
    })
  ),
  http.post(`${BASE}/auth/register`, async () =>
    HttpResponse.json({
      data: {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        expiresIn: 3600,
        user: mockUser
      }
    })
  ),
  http.post(`${BASE}/auth/refresh`, async () =>
    HttpResponse.json({
      data: {
        accessToken: "test-access-token",
        expiresIn: 3600
      }
    })
  ),
  http.get(`${BASE}/users/me`, () => HttpResponse.json({ data: mockUser }))
];
