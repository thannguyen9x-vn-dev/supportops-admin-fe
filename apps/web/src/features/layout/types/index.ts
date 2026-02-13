import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  children?: NavItem[];
};

export type NavGroup = {
  groupLabel: string;
  items: NavItem[];
};

