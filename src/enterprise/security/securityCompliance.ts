import { SecurityAuditRecord } from "./securityTypes";
import { SecurityMetricsSnapshot, createSecurityMetricsSnapshot } from "./securityMetrics";

export interface SecurityComplianceSnapshot {
  organizationId: string;
  metrics: SecurityMetricsSnapshot;
  compliant: boolean;
  generatedAt: Date;
}

export function createSecurityComplianceSnapshot(
  organizationId: string,
  records: SecurityAuditRecord[],
): SecurityComplianceSnapshot {
  const metrics = createSecurityMetricsSnapshot(records);

  return {
    organizationId,
    metrics,
    compliant: metrics.criticalEvents === 0,
    generatedAt: new Date(),
  };
}