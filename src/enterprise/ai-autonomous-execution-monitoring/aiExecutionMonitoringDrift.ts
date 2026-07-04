import {
  AIExecutionMonitoringMetric,
  AIExecutionMonitoringSeverity,
} from "./aiAutonomousExecutionMonitoringTypes";
import {
  AIExecutionMonitoringSignal,
  createAIExecutionMonitoringSignal,
} from "./aiExecutionMonitoringSignal";
import { AIExecutionMonitoringSnapshot } from "./aiExecutionMonitoringSnapshot";

export interface AIExecutionMonitoringDriftAssessment {
  executionId: string;
  driftScore: number;
  severity: AIExecutionMonitoringSeverity;
  driftedMetrics: string[];
  signals: AIExecutionMonitoringSignal[];
  assessedAt: Date;
}

export interface AssessAIExecutionMonitoringDriftInput {
  currentSnapshot: AIExecutionMonitoringSnapshot;
  baselineSnapshot?: AIExecutionMonitoringSnapshot;
  source?: string;
  warningDriftThreshold?: number;
  criticalDriftThreshold?: number;
}

function getMetricValue(
  metrics: AIExecutionMonitoringMetric[],
  name: string,
): number | undefined {
  return metrics.find((metric) => metric.name === name)?.value;
}

function resolveDriftSeverity(
  driftScore: number,
  warningDriftThreshold: number,
  criticalDriftThreshold: number,
): AIExecutionMonitoringSeverity {
  if (driftScore >= criticalDriftThreshold) {
    return "critical";
  }

  if (driftScore >= warningDriftThreshold) {
    return "warning";
  }

  return "info";
}

export function assessAIExecutionMonitoringDrift(
  input: AssessAIExecutionMonitoringDriftInput,
): AIExecutionMonitoringDriftAssessment {
  const warningDriftThreshold = input.warningDriftThreshold ?? 0.2;
  const criticalDriftThreshold = input.criticalDriftThreshold ?? 0.45;
  const assessedAt = new Date();

  if (!input.baselineSnapshot) {
    return {
      executionId: input.currentSnapshot.context.executionId,
      driftScore: 0,
      severity: "info",
      driftedMetrics: [],
      signals: [],
      assessedAt,
    };
  }

  const driftValues = input.currentSnapshot.metrics.map((metric) => {
    const baselineValue = getMetricValue(
      input.baselineSnapshot?.metrics ?? [],
      metric.name,
    );

    if (typeof baselineValue !== "number" || baselineValue === 0) {
      return {
        name: metric.name,
        drift: 0,
      };
    }

    return {
      name: metric.name,
      drift: Math.abs(metric.value - baselineValue) / Math.abs(baselineValue),
    };
  });

  const driftScore =
    driftValues.length === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            driftValues.reduce((total, metric) => total + metric.drift, 0) /
              driftValues.length,
          ),
        );

  const severity = resolveDriftSeverity(
    driftScore,
    warningDriftThreshold,
    criticalDriftThreshold,
  );

  const driftedMetrics = driftValues
    .filter((metric) => metric.drift >= warningDriftThreshold)
    .map((metric) => metric.name);

  const signals =
    severity === "info"
      ? []
      : [
          createAIExecutionMonitoringSignal({
            executionId: input.currentSnapshot.context.executionId,
            type: "drift",
            severity,
            message: `Execution monitoring drift detected with score ${driftScore.toFixed(
              2,
            )}.`,
            confidence: 0.86,
            observedAt: assessedAt,
            source: input.source ?? "ai-execution-monitoring-drift",
            metadata: {
              currentSnapshotId: input.currentSnapshot.id,
              baselineSnapshotId: input.baselineSnapshot.id,
              driftScore,
              driftedMetrics,
              warningDriftThreshold,
              criticalDriftThreshold,
            },
          }),
        ];

  return {
    executionId: input.currentSnapshot.context.executionId,
    driftScore,
    severity,
    driftedMetrics,
    signals,
    assessedAt,
  };
}