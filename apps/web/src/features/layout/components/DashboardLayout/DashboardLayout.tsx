import type { ReactNode } from "react";

import { SidebarProvider } from "../../context/SidebarContext";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./dashboard-layout.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

