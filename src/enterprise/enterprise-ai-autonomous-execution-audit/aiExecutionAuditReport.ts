import { AIAutonomousExecutionAuditTrail } from "./aiExecutionAuditTrail";

export interface AIAutonomousExecutionAuditReport {
  tenantId: string;
  executionId: string;
  generatedAt: Date;
  eventCount: number;
  criticalCount: number;
  failedCount: number;
  reviewRequiredCount: number;
  auditHealthScore: number;
  summary: string;
}

export function generateAIAutonomousExecutionAuditReport(
  trail: AIAutonomousExecutionAuditTrail,
): AIAutonomousExecutionAuditReport {
  const negativeSignals =
    trail.criticalEvents * 3 +
    trail.failedEvents * 2 +
    trail.requiresReviewEvents;

  const auditHealthScore = Math.max(
    0,
    Math.min(100, 100 - negativeSignals * 5),
  );

  return {
    tenantId: trail.tenantId,
    executionId: trail.executionId,
    generatedAt: new Date(),
    eventCount: trail.totalEvents,
    criticalCount: trail.criticalEvents,
    failedCount: trail.failedEvents,
    reviewRequiredCount: trail.requiresReviewEvents,
    auditHealthScore,
    summary:
      auditHealthScore >= 90
        ? "Audit trail is healthy with minimal execution risk."
        : auditHealthScore >= 70
          ? "Audit trail is acceptable but contains execution signals requiring attention."
          : "Audit trail indicates elevated execution audit risk and should be reviewed.",
  };
}