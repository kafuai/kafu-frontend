import { EntitlementMetrics } from "./entitlementMetrics";
import { EntitlementSummary } from "./entitlementSummary";

export interface EntitlementDashboard {
  tenantId: string;
  metrics: EntitlementMetrics;
  summary: EntitlementSummary;
  refreshedAt: Date;
}

export function createEntitlementDashboard(
  tenantId: string,
  metrics: EntitlementMetrics,
  summary: EntitlementSummary,
): EntitlementDashboard {
  return {
    tenantId,
    metrics,
    summary,
    refreshedAt: new Date(),
  };
}