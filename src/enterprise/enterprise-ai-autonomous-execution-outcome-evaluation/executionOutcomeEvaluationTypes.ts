export type ExecutionOutcomeEvaluationStatus =
  | "successful"
  | "partially_successful"
  | "underperforming"
  | "failed"
  | "extended"
  | "closed";

export type ExecutionOutcomeEvaluationSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutionOutcomeDecision =
  | "close"
  | "extend"
  | "correct"
  | "reassess"
  | "terminate";

export type ExecutionOutcomeMetricType =
  | "financial"
  | "operational"
  | "strategic"
  | "customer"
  | "employee"
  | "risk"
  | "compliance"
  | "quality";

export interface ExecutionOutcomeMetric {
  metricId: string;
  type: ExecutionOutcomeMetricType;
  title: string;

  targetValue: number;
  actualValue: number;

  weight: number;
  higherIsBetter: boolean;

  mandatory: boolean;
  achieved: boolean;

  unit?: string | null;
  description?: string | null;
}

export interface ExecutionOutcomeBenefit {
  benefitId: string;
  title: string;

  expectedValue: number;
  realizedValue: number;

  realized: boolean;
  strategic: boolean;

  description?: string | null;
}

export interface ExecutionOutcomeObjective {
  objectiveId: string;
  title: string;

  targetScore: number;
  actualScore: number;

  achieved: boolean;
  mandatory: boolean;
}

export interface ExecutionOutcomeEvidence {
  evidenceId: string;
  title: string;
  source: string;

  verified: boolean;
  confidenceScore: number;

  description?: string | null;
}

export interface ExecutionOutcomeRisk {
  riskId: string;
  title: string;

  severity: ExecutionOutcomeEvaluationSeverity;
  active: boolean;
  materialized: boolean;

  description?: string | null;
}
