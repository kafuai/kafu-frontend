export type AIExecutionDecisionSignalType =
  | "reasoning_gap"
  | "execution_risk"
  | "optimization_opportunity"
  | "policy_constraint"
  | "resource_pressure"
  | "quality_signal"
  | "recovery_need";

export type AIExecutionDecisionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionDecisionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionDecisionOptionStatus =
  | "proposed"
  | "eligible"
  | "rejected"
  | "selected";

export interface AIExecutionDecisionAuditMetadata {
  createdBy: string;
  createdAt: Date;
  sourceMilestone?: string;
  correlationId?: string;
}

export interface AIExecutionDecisionScore {
  confidence: number;
  impact: number;
  urgency: number;
  feasibility: number;
  risk: number;
  total: number;
}

export interface AIExecutionDecisionConstraint {
  id: string;
  description: string;
  blocking: boolean;
  severity: AIExecutionDecisionRiskLevel;
}