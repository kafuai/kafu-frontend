export type AIExecutionSimulationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export type AIExecutionSimulationOutcome =
  | "success"
  | "partial-success"
  | "neutral"
  | "failure";

export type AIExecutionSimulationRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AIExecutionSimulationMetrics {
  probabilityOfSuccess: number;
  estimatedDurationMs: number;
  estimatedCost: number;
  estimatedBenefit: number;
  confidence: number;
}

export interface AIExecutionSimulationRisk {
  id: string;
  name: string;
  description: string;
  level: AIExecutionSimulationRiskLevel;
  probability: number;
  impact: number;
}

export interface AIExecutionSimulationResult {
  outcome: AIExecutionSimulationOutcome;
  metrics: AIExecutionSimulationMetrics;
  risks: AIExecutionSimulationRisk[];
  recommendations: string[];
}