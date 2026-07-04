import {
  AIObservabilitySignal,
  AIObservabilityStatus,
} from "./aiObservabilityTypes";

export interface AIModelObservabilityHealth {
  modelProvider?: string;
  modelName?: string;
  modelVersion?: string;
  status: AIObservabilityStatus;
  totalSignals: number;
  errorSignals: number;
  criticalSignals: number;
  averageLatencyMs: number;
  averageQualityScore: number;
  averageDriftScore: number;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function evaluateAIModelObservabilityHealth(
  signals: AIObservabilitySignal[],
): AIModelObservabilityHealth {
  const latencyValues = signals
    .filter((signal) => signal.type === "latency")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  const qualityValues = signals
    .filter((signal) => signal.type === "quality")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  const driftValues = signals
    .filter((signal) => signal.type === "drift")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  const criticalSignals = signals.filter(
    (signal) => signal.severity === "critical",
  ).length;

  const errorSignals = signals.filter((signal) => signal.type === "error").length;

  const status: AIObservabilityStatus =
    criticalSignals > 0
      ? "unhealthy"
      : errorSignals > 0
        ? "degraded"
        : average(driftValues) >= 0.3
          ? "at_risk"
          : "healthy";

  return {
    modelProvider: signals[0]?.metadata.modelProvider,
    modelName: signals[0]?.metadata.modelName,
    modelVersion: signals[0]?.metadata.modelVersion,
    status,
    totalSignals: signals.length,
    errorSignals,
    criticalSignals,
    averageLatencyMs: average(latencyValues),
    averageQualityScore: average(qualityValues),
    averageDriftScore: average(driftValues),
  };
}