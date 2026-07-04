import { SecurityAuditRecord } from "./securityTypes";

export interface SecurityMetricsSnapshot {
  totalAuditRecords: number;
  criticalEvents: number;
  warningEvents: number;
  infoEvents: number;
  generatedAt: Date;
}

export function createSecurityMetricsSnapshot(
  records: SecurityAuditRecord[],
): SecurityMetricsSnapshot {
  return {
    totalAuditRecords: records.length,
    criticalEvents: records.filter((record) => record.severity === "critical")
      .length,
    warningEvents: records.filter((record) => record.severity === "warning")
      .length,
    infoEvents: records.filter((record) => record.severity === "info").length,
    generatedAt: new Date(),
  };
}