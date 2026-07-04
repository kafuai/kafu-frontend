import {
  AIExecutionMonitoringMetric,
  AIExecutionMonitoringStatus,
} from "./aiAutonomousExecutionMonitoringTypes";
import {
  AIExecutionMonitoringSignal,
  createAIExecutionMonitoringSignal,
} from "./aiExecutionMonitoringSignal";
import { AIExecutionMonitoringSnapshot } from "./aiExecutionMonitoringSnapshot";

export interface AIExecutionMonitoringHealthAssessment {
  executionId: string;
  status: AIExecutionMonitoringStatus;
  score: number;
  signals: AIExecutionMonitoringSignal[];
  assessedAt: Date;
}

export interface AssessAIExecutionMonitoringHealthInput {
  snapshot: AIExecutionMonitoringSnapshot;
  minimumHealthyScore?: number;
  degradedScoreThreshold?: number;
  source?: string;
}

function metricHealthScore(metric: AIExecutionMonitoringMetric): number {
  if (typeof metric.target !== "number" || metric.target <= 0) {
    return 1;
  }

  return Math.max(0, Math.min(1, metric.value / metric.target));
}

function calculateHealthScore(metrics: AIExecutionMonitoringMetric[]): number {
  if (metrics.length === 0) {
    return 1;
  }

  const totalWeight = metrics.reduce(
    (total, metric) => total + (metric.weight ?? 1),
    0,
  );

  if (totalWeight <= 0) {
    return 1;
  }

  return (
    metrics.reduce((total, metric) => {
      return total + metricHealthScore(metric) * (metric.weight ?? 1);
    }, 0) / totalWeight
  );
}

function resolveHealthStatus(
  score: number,
  minimumHealthyScore: number,
  degradedScoreThreshold: number,
  hasCriticalSignals: boolean,
): AIExecutionMonitoringStatus {
  if (hasCriticalSignals) {
    return "blocked";
  }

  if (score < degradedScoreThreshold) {
    return "degraded";
  }

  if (score < minimumHealthyScore) {
    return "watch";
  }

  return "healthy";
}

export function assessAIExecutionMonitoringHealth(
  input: AssessAIExecutionMonitoringHealthInput,
): AIExecutionMonitoringHealthAssessment {
  const minimumHealthyScore = input.minimumHealthyScore ?? 0.85;
  const degradedScoreThreshold = input.degradedScoreThreshold ?? 0.55;
  const assessedAt = new Date();
  const score = calculateHealthScore(input.snapshot.metrics);

  const hasCriticalSignals = input.snapshot.signals.some(
    (signal) => signal.severity === "critical" && signal.confidence >= 0.7,
  );

  const status = resolveHealthStatus(
    score,
    minimumHealthyScore,
    degradedScoreThreshold,
    hasCriticalSignals,
  );

  const signals =
    status === "healthy"
      ? []
      : [
          createAIExecutionMonitoringSignal({
            executionId: input.snapshot.context.executionId,
            type: "health",
            severity: status === "degraded" || status === "blocked" ? "critical" : "warning",
            message: `Execution health status resolved as ${status} with score ${score.toFixed(
              2,
            )}.`,
            confidence: 0.9,
            observedAt: assessedAt,
            source: input.source ?? "ai-execution-monitoring-health",
            metadata: {
              snapshotId: input.snapshot.id,
              score,
              minimumHealthyScore,
              degradedScoreThreshold,
            },
          }),
        ];

  return {
    executionId: input.snapshot.context.executionId,
    status,
    score,
    signals,
    assessedAt,
  };
}