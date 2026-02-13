import { getTranslations } from "next-intl/server";

export default async function ReportsOverviewPage() {
  const t = await getTranslations("pages");
  return <div>{t("reportsOverviewComingSoon")}</div>;
}

