import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { DashboardLayout } from "@/features/layout/components/DashboardLayout/DashboardLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
