export type AIAutonomousGovernanceRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousGovernanceDecision =
  | "approved"
  | "approved_with_controls"
  | "requires_human_review"
  | "blocked";

export type AIAutonomousGovernancePolicySeverity =
  | "advisory"
  | "mandatory"
  | "blocking";

export type AIAutonomousGovernanceControlType =
  | "human_approval"
  | "audit_required"
  | "restricted_execution"
  | "rollback_required"
  | "monitoring_required"
  | "explainability_required";

export interface AIAutonomousGovernanceContext {
  organizationId: string;
  executionId: string;
  actorId: string;
  capabilityId: string;
  objective: string;
  environment: "development" | "staging" | "production";
  requestedAt: Date;
  metadata?: Record<string, unknown>;
}