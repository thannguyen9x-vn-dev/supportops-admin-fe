import { getTranslations } from "next-intl/server";

export default async function ReportsPerformancePage() {
  const t = await getTranslations("pages");
  return <div>{t("reportsPerformanceComingSoon")}</div>;
}

