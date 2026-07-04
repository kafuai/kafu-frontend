import type { TelemetrySignal } from "./telemetryTypes";
import { classifyTelemetrySeverity } from "./telemetryClassifier";

export function enrichTelemetrySignal(signal: TelemetrySignal): TelemetrySignal {
  const classifiedSeverity = classifyTelemetrySeverity(signal);

  return {
    ...signal,
    severity: classifiedSeverity,
    metadata: {
      ...signal.metadata,
      classifiedSeverity,
      actionable: classifiedSeverity === "high" || classifiedSeverity === "critical",
      enrichedAt: new Date().toISOString(),
    },
  };
}

export function enrichTelemetrySignals(
  signals: readonly TelemetrySignal[]
): TelemetrySignal[] {
  return signals.map(enrichTelemetrySignal);
}