export type AIExecutionOptimizationSignalType =
  | "latency_increase"
  | "throughput_drop"
  | "failure_rate_increase"
  | "cost_drift"
  | "resource_pressure"
  | "sla_risk"
  | "queue_backlog"
  | "execution_instability";

export type AIExecutionOptimizationOpportunityType =
  | "performance"
  | "reliability"
  | "cost"
  | "capacity"
  | "stability"
  | "sla_protection";

export type AIExecutionOptimizationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionOptimizationRiskLevel =
  | "low"
  | "medium"
  | "high";

export type AIExecutionOptimizationComplexity =
  | "low"
  | "medium"
  | "high";

export type AIExecutionOptimizationStatus =
  | "identified"
  | "scored"
  | "recommended"
  | "planned"
  | "blocked";

export interface AIExecutionOptimizationImpactEstimate {
  performanceGain: number;
  reliabilityGain: number;
  costReduction: number;
  slaProtection: number;
}

export interface AIExecutionOptimizationFeasibilityEstimate {
  implementationComplexity: AIExecutionOptimizationComplexity;
  operationalRisk: AIExecutionOptimizationRiskLevel;
  confidence: number;
}

export interface AIExecutionOptimizationAuditMetadata {
  createdAt: Date;
  createdBy: string;
  sourceMilestone?: string;
  sourceLayer?: string;
}