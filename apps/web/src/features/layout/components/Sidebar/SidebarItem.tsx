"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type { NavItem } from "../../types";
import styles from "./sidebar.module.css";

type SidebarItemProps = {
  item: NavItem;
  locale: string;
  pathname: string;
  isCollapsed: boolean;
};

export function SidebarItem({ item, locale, pathname, isCollapsed }: SidebarItemProps) {
  const t = useTranslations();
  const fullHref = `/${locale}${item.href}`;
  const hasChildren = Boolean(item.children?.length);
  const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`);
  const [isOpen, setIsOpen] = useState(isActive);

  if (hasChildren) {
    return (
      <div className={styles.itemGroup}>
        <button
          type="button"
          className={`${styles.item} ${isActive ? styles.active : ""}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={t(item.label)}
          title={t(item.label)}
        >
          <span className={styles.icon}>{item.icon}</span>
          {!isCollapsed ? (
            <>
              <span className={styles.label}>{t(item.label)}</span>
              <ExpandMoreIcon
                className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
                fontSize="small"
              />
            </>
          ) : null}
        </button>

        {isOpen && !isCollapsed ? (
          <div className={styles.submenu}>
            {item.children?.map((child) => {
              const childHref = `/${locale}${child.href}`;
              const isChildActive = pathname === childHref;

              return (
                <Link
                  key={child.href}
                  href={childHref}
                  className={`${styles.subitem} ${isChildActive ? styles.active : ""}`}
                >
                  <span className={styles.label}>{t(child.label)}</span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Link
      href={fullHref}
      className={`${styles.item} ${isActive ? styles.active : ""}`}
      aria-label={t(item.label)}
      title={t(item.label)}
    >
      <span className={styles.icon}>{item.icon}</span>
      {!isCollapsed ? (
        <>
          <span className={styles.label}>{t(item.label)}</span>
          {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
        </>
      ) : null}
    </Link>
  );
}

