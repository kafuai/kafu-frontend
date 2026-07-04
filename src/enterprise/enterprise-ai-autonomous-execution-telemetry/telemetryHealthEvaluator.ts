import type { TelemetrySignal } from "./telemetryTypes";
import { aggregateTelemetrySignals } from "./telemetryAggregator";

export type TelemetryHealthStatus = "healthy" | "degraded" | "unstable" | "critical";

export interface TelemetryHealthEvaluation {
  readonly executionId: string;
  readonly status: TelemetryHealthStatus;
  readonly score: number;
  readonly reasons: string[];
}

export function evaluateTelemetryHealth(
  executionId: string,
  signals: readonly TelemetrySignal[]
): TelemetryHealthEvaluation {
  const aggregation = aggregateTelemetrySignals(executionId, signals);
  const reasons: string[] = [];

  let score = 100;

  score -= aggregation.bySeverity.critical * 30;
  score -= aggregation.bySeverity.high * 15;
  score -= aggregation.bySeverity.medium * 5;

  if (aggregation.byType.execution_failed) {
    reasons.push("Execution failure telemetry was detected.");
  }

  if (aggregation.byType.anomaly_signal_detected) {
    reasons.push("Anomaly telemetry signals were detected.");
  }

  if (aggregation.byType.latency_observed && aggregation.byType.latency_observed >= 3) {
    reasons.push("Repeated latency telemetry was observed.");
  }

  const normalizedScore = Math.max(0, Math.min(100, score));

  return {
    executionId,
    score: normalizedScore,
    status:
      normalizedScore >= 90
        ? "healthy"
        : normalizedScore >= 70
          ? "degraded"
          : normalizedScore >= 40
            ? "unstable"
            : "critical",
    reasons,
  };
}