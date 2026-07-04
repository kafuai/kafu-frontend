import type { TelemetrySeverity, TelemetrySignal } from "./telemetryTypes";

export function classifyTelemetrySeverity(signal: TelemetrySignal): TelemetrySeverity {
  if (signal.type === "execution_failed") return "critical";
  if (signal.type === "anomaly_signal_detected") return "high";
  if (signal.type === "policy_signal_detected") return "medium";
  if (signal.type === "latency_observed") return "medium";

  return signal.severity;
}

export function isActionableTelemetrySignal(signal: TelemetrySignal): boolean {
  return (
    signal.severity === "critical" ||
    signal.severity === "high" ||
    signal.type === "anomaly_signal_detected" ||
    signal.type === "execution_failed"
  );
}