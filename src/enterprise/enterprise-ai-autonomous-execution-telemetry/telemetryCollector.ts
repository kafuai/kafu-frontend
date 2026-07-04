import type { TelemetrySignal, TelemetrySummary } from "./telemetryTypes";

export function collectTelemetrySignal(
  signal: Omit<TelemetrySignal, "id" | "timestamp">
): TelemetrySignal {
  return {
    ...signal,
    id: `telemetry_${signal.executionId}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`,
    timestamp: new Date().toISOString(),
  };
}

export function summarizeTelemetrySignals(
  executionId: string,
  signals: readonly TelemetrySignal[]
): TelemetrySummary {
  const relatedSignals = signals.filter((signal) => signal.executionId === executionId);

  return {
    executionId,
    totalSignals: relatedSignals.length,
    criticalSignals: relatedSignals.filter((signal) => signal.severity === "critical").length,
    highSignals: relatedSignals.filter((signal) => signal.severity === "high").length,
    anomalySignals: relatedSignals.filter(
      (signal) => signal.type === "anomaly_signal_detected"
    ).length,
    latestTimestamp: relatedSignals
      .map((signal) => signal.timestamp)
      .sort()
      .at(-1),
  };
}