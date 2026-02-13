import { getTranslations } from "next-intl/server";

export default async function ProjectsPage() {
  const t = await getTranslations("pages");
  return <div>{t("projectsComingSoon")}</div>;
}

