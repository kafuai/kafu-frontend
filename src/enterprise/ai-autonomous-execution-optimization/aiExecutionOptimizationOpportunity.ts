import {
  AIExecutionOptimizationAuditMetadata,
  AIExecutionOptimizationFeasibilityEstimate,
  AIExecutionOptimizationImpactEstimate,
  AIExecutionOptimizationOpportunityType,
  AIExecutionOptimizationPriority,
  AIExecutionOptimizationStatus,
} from "./aiAutonomousExecutionOptimizationTypes";
import {
  AIExecutionOptimizationSignal,
  calculateAIExecutionOptimizationDrift,
} from "./aiExecutionOptimizationSignal";

export interface AIExecutionOptimizationOpportunity {
  id: string;
  signalId: string;
  sourceExecutionId: string;
  type: AIExecutionOptimizationOpportunityType;
  title: string;
  summary: string;
  priority: AIExecutionOptimizationPriority;
  impact: AIExecutionOptimizationImpactEstimate;
  feasibility: AIExecutionOptimizationFeasibilityEstimate;
  status: AIExecutionOptimizationStatus;
  metadata: AIExecutionOptimizationAuditMetadata;
}

export interface AIExecutionOptimizationOpportunityInput {
  id: string;
  signal: AIExecutionOptimizationSignal;
  type?: AIExecutionOptimizationOpportunityType;
  title?: string;
  summary?: string;
  priority?: AIExecutionOptimizationPriority;
  impact: AIExecutionOptimizationImpactEstimate;
  feasibility: AIExecutionOptimizationFeasibilityEstimate;
}

export function createAIExecutionOptimizationOpportunity(
  input: AIExecutionOptimizationOpportunityInput,
): AIExecutionOptimizationOpportunity {
  if (!input.id.trim()) {
    throw new Error("Execution optimization opportunity id is required");
  }

  return {
    id: input.id,
    signalId: input.signal.id,
    sourceExecutionId: input.signal.sourceExecutionId,
    type: input.type ?? mapSignalTypeToOpportunityType(input.signal),
    title: input.title ?? createOptimizationOpportunityTitle(input.signal),
    summary: input.summary ?? createOptimizationOpportunitySummary(input.signal),
    priority: input.priority ?? inferOptimizationPriority(input.signal),
    impact: normalizeOptimizationImpact(input.impact),
    feasibility: {
      ...input.feasibility,
      confidence: clampOptimizationRatio(input.feasibility.confidence),
    },
    status: "identified",
    metadata: {
      ...input.signal.metadata,
      createdAt: new Date(),
    },
  };
}

export function mapSignalTypeToOpportunityType(
  signal: AIExecutionOptimizationSignal,
): AIExecutionOptimizationOpportunityType {
  switch (signal.type) {
    case "latency_increase":
    case "throughput_drop":
      return "performance";
    case "failure_rate_increase":
    case "execution_instability":
      return "reliability";
    case "cost_drift":
      return "cost";
    case "resource_pressure":
    case "queue_backlog":
      return "capacity";
    case "sla_risk":
      return "sla_protection";
    default:
      return "stability";
  }
}

export function inferOptimizationPriority(
  signal: AIExecutionOptimizationSignal,
): AIExecutionOptimizationPriority {
  const drift = calculateAIExecutionOptimizationDrift(signal);
  const pressure = signal.severity * 0.55 + signal.confidence * 0.25 + Math.min(1, drift) * 0.2;

  if (pressure >= 0.85) {
    return "critical";
  }

  if (pressure >= 0.7) {
    return "high";
  }

  if (pressure >= 0.45) {
    return "medium";
  }

  return "low";
}

function createOptimizationOpportunityTitle(signal: AIExecutionOptimizationSignal): string {
  return `Optimize ${signal.metricName} for execution ${signal.sourceExecutionId}`;
}

function createOptimizationOpportunitySummary(signal: AIExecutionOptimizationSignal): string {
  const drift = calculateAIExecutionOptimizationDrift(signal);

  return [
    `Detected ${signal.type} on ${signal.metricName}.`,
    `Observed value: ${signal.observedValue}.`,
    `Baseline value: ${signal.baselineValue}.`,
    `Estimated drift: ${Number(drift.toFixed(4))}.`,
  ].join(" ");
}

function normalizeOptimizationImpact(
  impact: AIExecutionOptimizationImpactEstimate,
): AIExecutionOptimizationImpactEstimate {
  return {
    performanceGain: clampOptimizationRatio(impact.performanceGain),
    reliabilityGain: clampOptimizationRatio(impact.reliabilityGain),
    costReduction: clampOptimizationRatio(impact.costReduction),
    slaProtection: clampOptimizationRatio(impact.slaProtection),
  };
}

function clampOptimizationRatio(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}