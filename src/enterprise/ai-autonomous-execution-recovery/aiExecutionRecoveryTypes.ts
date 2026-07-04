export type AIExecutionRecoveryFailureType =
  | "timeout"
  | "dependency_failure"
  | "validation_failure"
  | "policy_violation"
  | "resource_exhaustion"
  | "execution_exception"
  | "data_integrity_issue"
  | "unknown";

export type AIExecutionRecoverySeverity = "low" | "medium" | "high" | "critical";

export type AIExecutionRecoveryStatus =
  | "detected"
  | "assessed"
  | "planned"
  | "in_progress"
  | "recovered"
  | "failed"
  | "escalated";

export type AIExecutionRecoveryStrategy =
  | "retry"
  | "fallback"
  | "rollback"
  | "skip"
  | "manual_escalation"
  | "compensating_action"
  | "halt_execution";

export interface AIExecutionRecoveryAuditMetadata {
  createdAt: Date;
  createdBy: string;
  sourceMilestone?: string;
  correlationId?: string;
}