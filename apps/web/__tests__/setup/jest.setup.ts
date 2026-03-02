import "@testing-library/jest-dom";

import { server } from "../mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
  useFormatter: () => ({
    number: (value: number) => String(value),
    dateTime: (value: Date) => value.toISOString()
  })
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefresh = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
    back: mockBack,
    prefetch: jest.fn()
  }),
  usePathname: () => "/en/dashboard",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: "en" })
}));

(globalThis as unknown as { mockRouter: unknown }).mockRouter = {
  push: mockPush,
  replace: mockReplace,
  refresh: mockRefresh,
  back: mockBack
};
