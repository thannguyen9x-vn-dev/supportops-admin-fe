import type { ReactNode } from "react";

import { DashboardLayout } from "../../../features/layout/components/DashboardLayout/DashboardLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

