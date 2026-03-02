import type { AuthUser } from "@supportops/contracts";

export const mockUser: AuthUser = {
  id: "user-1",
  email: "admin@supportops.dev",
  firstName: "SupportOps",
  lastName: "Admin",
  avatarUrl: null,
  role: "ADMIN",
  tenantId: "tenant-1",
  tenantName: "SupportOps"
};
