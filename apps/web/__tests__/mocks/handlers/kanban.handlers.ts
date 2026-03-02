import { http, HttpResponse } from "msw";

import { mockBoards } from "../data/boards";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const kanbanHandlers = [
  http.get(`${BASE}/boards`, () => HttpResponse.json({ data: mockBoards }))
];
