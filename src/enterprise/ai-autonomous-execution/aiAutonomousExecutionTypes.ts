export type AIAutonomousExecutionStatus =
  | "draft"
  | "ready"
  | "running"
  | "waiting_approval"
  | "blocked"
  | "completed"
  | "failed"
  | "cancelled";

export type AIAutonomousExecutionTaskStatus =
  | "pending"
  | "ready"
  | "running"
  | "waiting_approval"
  | "blocked"
  | "completed"
  | "failed"
  | "skipped";

export type AIAutonomousExecutionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousExecutionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousExecutionApprovalMode =
  | "none"
  | "human_required"
  | "policy_required";

export type AIAutonomousExecutionDecision =
  | "execute"
  | "request_approval"
  | "block"
  | "skip";