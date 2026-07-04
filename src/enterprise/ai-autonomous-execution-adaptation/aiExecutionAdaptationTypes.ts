export type AIExecutionAdaptationSignalType =
  | "performance_degradation"
  | "risk_increase"
  | "execution_delay"
  | "resource_constraint"
  | "quality_drop"
  | "priority_shift"
  | "recovery_repeat"
  | "resilience_threshold_breach";

export type AIExecutionAdaptationSeverity = "low" | "medium" | "high" | "critical";

export type AIExecutionAdaptationAction =
  | "continue"
  | "reprioritize"
  | "rebalance"
  | "retry_with_adjustment"
  | "reduce_scope"
  | "increase_validation"
  | "escalate"
  | "pause_execution";

export type AIExecutionAdaptationConfidence = "low" | "medium" | "high";

export interface AIExecutionAdaptationMetricSnapshot {
  throughputScore?: number;
  reliabilityScore?: number;
  recoveryScore?: number;
  resilienceScore?: number;
  qualityScore?: number;
  riskScore?: number;
  delayScore?: number;
}

export interface AIExecutionAdaptationContext {
  executionId: string;
  milestoneId?: string;
  layerId?: string;
  createdBy: string;
  observedAt: Date;
  metrics: AIExecutionAdaptationMetricSnapshot;
  notes?: string[];
}