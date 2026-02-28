import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, locales } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always"
});

const publicPaths = ["/login", "/register", "/forgot-password", "/pricing", "/reset-password"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, "") || "/";
  const response = intlMiddleware(request);
  const localeMatch = pathname.match(/^\/(en|vi)(\/|$)/);
  const locale = localeMatch?.[1] ?? defaultLocale;
  const isHomeRoute = pathWithoutLocale === "/";
  const isPublicRoute = publicPaths.some((path) => pathWithoutLocale.startsWith(path));
  const hasRefreshToken = request.cookies.has("supportops_refresh_token");

  if (!isHomeRoute && !isPublicRoute && !hasRefreshToken) {
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    redirectUrl.searchParams.set("next", pathWithoutLocale);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublicRoute && hasRefreshToken && ["/login", "/register"].includes(pathWithoutLocale)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
