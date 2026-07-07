export interface ReportingAuditEntry {
  id: string;
  reportId: string;
  action: "created" | "generated" | "viewed" | "delivered" | "failed";
  actorId: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export function createReportingAuditEntry(
  entry: Omit<ReportingAuditEntry, "occurredAt">,
): ReportingAuditEntry {
  return {
    ...entry,
    occurredAt: new Date().toISOString(),
  };
}
