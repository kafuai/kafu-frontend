export type AIExecutionPredictionSignalType =
  | "success_indicator"
  | "failure_indicator"
  | "delay_indicator"
  | "risk_indicator"
  | "optimization_indicator"
  | "resource_indicator"
  | "quality_indicator";

export type AIExecutionPredictionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionPredictionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionPredictionScenarioStatus =
  | "proposed"
  | "eligible"
  | "rejected"
  | "selected";

export interface AIExecutionPredictionAuditMetadata {
  createdBy: string;
  createdAt: Date;
  sourceMilestone?: string;
  correlationId?: string;
}

export interface AIExecutionPredictionScore {
  successProbability: number;
  failureProbability: number;
  delayProbability: number;
  riskProbability: number;
  optimizationPotential: number;
  confidence: number;
  total: number;
}

export interface AIExecutionPredictionConstraint {
  id: string;
  description: string;
  blocking: boolean;
  severity: AIExecutionPredictionRiskLevel;
}