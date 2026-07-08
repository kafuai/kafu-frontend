import { AdminConsoleContext } from "./adminConsoleTypes";

export interface AdminDashboard {
  tenantId: string;
  totalUsers: number;
  activeSessions: number;
  openIssues: number;
  refreshedAt: Date;
}

export function createAdminDashboard(
  context: AdminConsoleContext,
  totalUsers: number,
  activeSessions: number,
  openIssues: number,
): AdminDashboard {
  return {
    tenantId: context.tenantId,
    totalUsers,
    activeSessions,
    openIssues,
    refreshedAt: new Date(),
  };
}
