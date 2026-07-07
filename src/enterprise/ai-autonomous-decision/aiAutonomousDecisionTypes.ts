export type AIAutonomousDecisionStatus =
  | "draft"
  | "evaluating"
  | "evaluated"
  | "selected"
  | "approved"
  | "rejected"
  | "deferred"
  | "blocked"
  | "executed"
  | "cancelled";

export type AIAutonomousDecisionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousDecisionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "severe";

export type AIDecisionRiskLevel = AIAutonomousDecisionRiskLevel;

export type AIDecisionConfidenceLevel =
  | "low"
  | "medium"
  | "high"
  | "very_high";

export type AIDecisionApprovalMode =
  | "autonomous"
  | "human_review"
  | "executive_approval";

export type AIDecisionOutcome =
  | "approved"
  | "approve"
  | "rejected"
  | "reject"
  | "deferred"
  | "defer"
  | "requires_review"
  | "requires_mitigation"
  | "request_more_data"
  | "escalate"
  | "blocked"
  | "cancelled";

export interface AIDecisionCriterionScoreValue {
  value: number;
  reason: string;
}

export interface AIAutonomousDecisionMetadata {
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}