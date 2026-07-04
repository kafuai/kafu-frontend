import {
  ObservabilityContext,
  ObservabilityLogEntry,
  ObservabilitySeverity,
} from "./observabilityTypes";

export function createObservabilityLogEntry(
  severity: ObservabilitySeverity,
  message: string,
  context: ObservabilityContext,
  metadata?: Record<string, unknown>,
): ObservabilityLogEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    severity,
    message,
    context,
    metadata,
  };
}

export function isCriticalObservabilityLog(
  entry: ObservabilityLogEntry,
): boolean {
  return entry.severity === "critical" || entry.severity === "error";
}