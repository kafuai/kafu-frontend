import {
  AIExecutionMonitoringMetric,
  AIExecutionMonitoringSeverity,
} from "./aiAutonomousExecutionMonitoringTypes";
import {
  AIExecutionMonitoringSignal,
  createAIExecutionMonitoringSignal,
} from "./aiExecutionMonitoringSignal";
import { AIExecutionMonitoringSnapshot } from "./aiExecutionMonitoringSnapshot";

export interface AIExecutionMonitoringRiskAssessment {
  executionId: string;
  riskScore: number;
  severity: AIExecutionMonitoringSeverity;
  drivers: string[];
  signals: AIExecutionMonitoringSignal[];
  assessedAt: Date;
}

export interface AssessAIExecutionMonitoringRiskInput {
  snapshot: AIExecutionMonitoringSnapshot;
  source?: string;
  criticalRiskThreshold?: number;
  warningRiskThreshold?: number;
}

function calculateMetricRisk(metric: AIExecutionMonitoringMetric): number {
  if (typeof metric.target !== "number" || metric.target <= 0) {
    return 0;
  }

  const gap = Math.max(0, metric.target - metric.value) / metric.target;
  return Math.max(0, Math.min(1, gap)) * (metric.weight ?? 1);
}

function resolveRiskSeverity(
  riskScore: number,
  criticalRiskThreshold: number,
  warningRiskThreshold: number,
): AIExecutionMonitoringSeverity {
  if (riskScore >= criticalRiskThreshold) {
    return "critical";
  }

  if (riskScore >= warningRiskThreshold) {
    return "warning";
  }

  return "info";
}

export function assessAIExecutionMonitoringRisk(
  input: AssessAIExecutionMonitoringRiskInput,
): AIExecutionMonitoringRiskAssessment {
  const criticalRiskThreshold = input.criticalRiskThreshold ?? 0.7;
  const warningRiskThreshold = input.warningRiskThreshold ?? 0.35;
  const assessedAt = new Date();

  const metricRiskTotal = input.snapshot.metrics.reduce(
    (total, metric) => total + calculateMetricRisk(metric),
    0,
  );

  const totalWeight = input.snapshot.metrics.reduce(
    (total, metric) => total + (metric.weight ?? 1),
    0,
  );

  const signalRisk =
    input.snapshot.signals.filter((signal) => signal.severity === "critical")
      .length * 0.25 +
    input.snapshot.signals.filter((signal) => signal.severity === "warning")
      .length *
      0.1;

  const riskScore = Math.max(
    0,
    Math.min(
      1,
      (totalWeight > 0 ? metricRiskTotal / totalWeight : 0) + signalRisk,
    ),
  );

  const severity = resolveRiskSeverity(
    riskScore,
    criticalRiskThreshold,
    warningRiskThreshold,
  );

  const drivers = [
    ...input.snapshot.metrics
      .filter((metric) => calculateMetricRisk(metric) > 0)
      .map((metric) => metric.name),
    ...input.snapshot.signals
      .filter((signal) => signal.severity !== "info")
      .map((signal) => signal.type),
  ];

  const signals =
    severity === "info"
      ? []
      : [
          createAIExecutionMonitoringSignal({
            executionId: input.snapshot.context.executionId,
            type: "risk",
            severity,
            message: `Execution risk detected with score ${riskScore.toFixed(
              2,
            )}.`,
            confidence: 0.88,
            observedAt: assessedAt,
            source: input.source ?? "ai-execution-monitoring-risk",
            metadata: {
              snapshotId: input.snapshot.id,
              riskScore,
              drivers,
              criticalRiskThreshold,
              warningRiskThreshold,
            },
          }),
        ];

  return {
    executionId: input.snapshot.context.executionId,
    riskScore,
    severity,
    drivers,
    signals,
    assessedAt,
  };
}