export type AIDecisionPriority = "low" | "medium" | "high" | "critical";

export type AIDecisionRiskLevel = "low" | "medium" | "high" | "severe";

export type AIDecisionConfidenceLevel = "low" | "medium" | "high" | "very_high";

export type AIDecisionStatus =
  | "draft"
  | "evaluated"
  | "selected"
  | "rejected"
  | "deferred"
  | "blocked";

export type AIDecisionOutcome =
  | "approve"
  | "reject"
  | "defer"
  | "escalate"
  | "request_more_data";

export type AIDecisionCriterionType =
  | "business_value"
  | "strategic_alignment"
  | "risk"
  | "cost"
  | "feasibility"
  | "urgency"
  | "customer_impact"
  | "operational_impact"
  | "compliance";

export interface AIDecisionScore {
  value: number;
  reason: string;
}