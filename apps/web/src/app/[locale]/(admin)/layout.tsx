import type { ReactNode } from "react";

import { DashboardLayout } from "@/features/layout/components/DashboardLayout/DashboardLayout";
import { AuthProvider } from "@/lib/auth/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
