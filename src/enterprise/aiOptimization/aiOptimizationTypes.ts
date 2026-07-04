export type AIOptimizationTargetType =
  | "prompt"
  | "model"
  | "routing"
  | "context"
  | "memory"
  | "retrieval"
  | "tool_calling"
  | "token_usage"
  | "latency"
  | "cost"
  | "quality"
  | "accuracy"
  | "safety"
  | "reliability"
  | "explainability";

export type AIOptimizationObjectiveType =
  | "reduce_cost"
  | "reduce_latency"
  | "reduce_tokens"
  | "increase_accuracy"
  | "increase_quality"
  | "increase_reliability"
  | "increase_safety"
  | "increase_user_satisfaction"
  | "increase_roi"
  | "reduce_hallucination"
  | "improve_context_efficiency"
  | "improve_model_selection";

export type AIOptimizationPriority = "low" | "medium" | "high" | "critical";

export type AIOptimizationStatus =
  | "draft"
  | "recommended"
  | "approved"
  | "in_progress"
  | "validated"
  | "failed"
  | "rolled_back";

export type AIOptimizationRiskLevel = "low" | "medium" | "high" | "critical";

export type AIOptimizationImpactLevel = "low" | "medium" | "high" | "transformational";

export type AIOptimizationEffortLevel = "low" | "medium" | "high";

export interface AIOptimizationMetricSnapshot {
  accuracyScore?: number;
  qualityScore?: number;
  safetyScore?: number;
  reliabilityScore?: number;
  hallucinationRate?: number;
  averageLatencyMs?: number;
  averageTokensUsed?: number;
  averageCostUsd?: number;
  userSatisfactionScore?: number;
  roiScore?: number;
}

export interface AIOptimizationExpectedImpact {
  costReductionPercent?: number;
  latencyReductionPercent?: number;
  tokenReductionPercent?: number;
  accuracyIncreasePercent?: number;
  qualityIncreasePercent?: number;
  safetyIncreasePercent?: number;
  reliabilityIncreasePercent?: number;
  hallucinationReductionPercent?: number;
  roiIncreasePercent?: number;
}

export interface AIOptimizationEvidence {
  source: string;
  description: string;
  metric?: keyof AIOptimizationMetricSnapshot;
  value?: number;
  confidence: number;
}

export interface AIOptimizationTrace {
  createdAt: Date;
  createdBy: string;
  reason: string;
  evidence: AIOptimizationEvidence[];
}