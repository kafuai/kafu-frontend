import { EntitlementSummary } from "./entitlementSummary";

export interface EntitlementReport {
  id: string;
  tenantId: string;
  summary: EntitlementSummary;
  generatedAt: Date;
}

export function generateEntitlementReport(
  id: string,
  summary: EntitlementSummary,
): EntitlementReport {
  return {
    id,
    tenantId: summary.tenantId,
    summary,
    generatedAt: new Date(),
  };
}