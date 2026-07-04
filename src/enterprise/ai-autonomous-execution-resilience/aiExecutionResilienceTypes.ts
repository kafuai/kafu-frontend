export type AIExecutionResilienceLevel =
  | "excellent"
  | "strong"
  | "stable"
  | "fragile"
  | "critical";

export type AIExecutionResilienceRisk =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "severe";

export type AIExecutionResilienceDegradationReason =
  | "repeated_failure"
  | "slow_recovery"
  | "fallback_unavailable"
  | "retry_pressure"
  | "monitoring_gap"
  | "optimization_regression"
  | "coordination_instability"
  | "unknown";

export type AIExecutionResilienceAction =
  | "continue_execution"
  | "increase_monitoring"
  | "activate_fallback"
  | "reduce_retry_pressure"
  | "pause_execution"
  | "escalate";

export interface AIExecutionResilienceSignal {
  id: string;
  executionId: string;
  source: string;
  reason: AIExecutionResilienceDegradationReason;
  risk: AIExecutionResilienceRisk;
  confidence: number;
  observedAt: Date;
  description?: string;
}

export interface AIExecutionResilienceScore {
  stability: number;
  recoveryReadiness: number;
  fallbackReadiness: number;
  monitoringCoverage: number;
  retrySafety: number;
  overall: number;
}

export interface AIExecutionResilienceRecommendation {
  action: AIExecutionResilienceAction;
  priority: number;
  reason: string;
}