"use client";

import { Avatar } from "@mui/material";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { mockUser } from "@/shared/mock/user";
import { navigationConfig } from "../../config/navigation";
import { useSidebar } from "../../context/SidebarContext";
import { SidebarGroup } from "./SidebarGroup";
import styles from "./sidebar.module.css";

export function Sidebar() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();
  const t = useTranslations();

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  return (
    <>
      {isMobileOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          onClick={closeMobileSidebar}
          aria-label={t("header.closeNavigationAriaLabel")}
        />
      ) : null}
      <aside
        className={[
          styles.sidebar,
          isCollapsed ? styles.collapsed : "",
          isMobileOpen ? styles.mobileOpen : "",
        ].join(" ")}
      >
        <div className={styles.brand}>
          <span className={styles.brandMark}>D</span>
          {!isCollapsed ? <span className={styles.brandName}>SupportOps</span> : null}
        </div>

        <nav className={styles.nav}>
          {navigationConfig.map((group) => (
            <SidebarGroup
              key={group.groupLabel}
              group={group}
              locale={locale}
              pathname={pathname}
              isCollapsed={isCollapsed}
              groupLabel={t(group.groupLabel)}
            />
          ))}
        </nav>

        {!isCollapsed ? (
          <div className={styles.footer}>
            <Avatar sx={{ width: 36, height: 36 }}>{mockUser.initials}</Avatar>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{mockUser.name}</p>
              <p className={styles.userRole}>{mockUser.role}</p>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
