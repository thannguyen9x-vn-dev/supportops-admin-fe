import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always"
});

const publicPaths = ["/login", "/register", "/forgot-password", "/pricing", "/reset-password"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = intlMiddleware(request);

  const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, "") || "/";
  const isPublicRoute = publicPaths.some((path) => pathWithoutLocale.startsWith(path));
  const hasRefreshToken = request.cookies.has("supportops_refresh_token");

  if (!isPublicRoute && !hasRefreshToken) {
    // Soft guard only: access token is stored client-side and verified in AuthContext.
    // If you later move refresh token to httpOnly cookie, enable redirect here.
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
