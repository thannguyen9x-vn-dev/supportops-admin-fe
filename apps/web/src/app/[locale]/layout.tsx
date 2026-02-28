import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthProvider } from "@/lib/auth/AuthContext";
import { locales } from "../../i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
<<<<<<< Updated upstream
      <div data-locale={locale}>{children}</div>
=======
      <AuthProvider>{children}</AuthProvider>
>>>>>>> Stashed changes
    </NextIntlClientProvider>
  );
}
