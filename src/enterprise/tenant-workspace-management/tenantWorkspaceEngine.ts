import type { TenantAnalytics } from "./tenantAnalytics";
import { calculateTenantActivityRate } from "./tenantAnalytics";

export interface TenantWorkspaceEngineResult {
  activityRate: number;
  evaluatedAt: Date;
}

export function evaluateTenantWorkspace(
  analytics: TenantAnalytics,
): TenantWorkspaceEngineResult {
  return {
    activityRate: calculateTenantActivityRate(analytics),
    evaluatedAt: new Date(),
  };
}