import type { NavGroup } from "../../types";
import { SidebarItem } from "./SidebarItem";
import styles from "./sidebar.module.css";

type SidebarGroupProps = {
  group: NavGroup;
  locale: string;
  pathname: string;
  isCollapsed: boolean;
  groupLabel: string;
};

export function SidebarGroup({
  group,
  locale,
  pathname,
  isCollapsed,
  groupLabel,
}: SidebarGroupProps) {
  return (
    <div className={styles.group}>
      {!isCollapsed ? <span className={styles.groupLabel}>{groupLabel}</span> : null}
      {group.items.map((item) => (
        <SidebarItem
          key={item.href}
          item={item}
          locale={locale}
          pathname={pathname}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  );
}

