import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("pages");
  return <div>{t("dashboardComingSoon")}</div>;
}

