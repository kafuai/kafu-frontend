export type AIExecutionValidationSeverity =
  | "info"
  | "warning"
  | "critical"
  | "blocking";

export type AIExecutionValidationStatus =
  | "valid"
  | "partially_valid"
  | "invalid"
  | "requires_review";

export type AIExecutionValidationDecision =
  | "approved"
  | "approved_with_warnings"
  | "rejected"
  | "manual_review_required";

export type AIExecutionValidationCategory =
  | "simulation_integrity"
  | "assumption_alignment"
  | "risk_consistency"
  | "outcome_feasibility"
  | "policy_compliance"
  | "execution_readiness";

export interface AIExecutionValidationContext {
  validationId: string;
  executionId: string;
  simulationId?: string;
  tenantId?: string;
  createdBy: string;
  createdAt: string;
  sourceMilestone?: string;
}

export interface AIExecutionValidationEvidence {
  evidenceId: string;
  label: string;
  value: string | number | boolean;
  confidence: number;
  source: string;
}

export interface AIExecutionValidationMetrics {
  integrityScore: number;
  assumptionScore: number;
  feasibilityScore: number;
  riskScore: number;
  readinessScore: number;
}

export interface AIExecutionValidationSummary {
  status: AIExecutionValidationStatus;
  decision: AIExecutionValidationDecision;
  confidence: number;
  blockingIssueCount: number;
  criticalIssueCount: number;
  warningIssueCount: number;
  passedRuleCount: number;
  failedRuleCount: number;
}