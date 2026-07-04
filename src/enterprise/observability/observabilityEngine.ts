import {
  ObservabilityAlert,
  ObservabilityDiagnosticReport,
  ObservabilityHealthCheck,
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";

export type ObservabilitySnapshot = {
  logs: ObservabilityLogEntry[];
  metrics: ObservabilityMetric[];
  traces: ObservabilityTraceSpan[];
  healthChecks: ObservabilityHealthCheck[];
  diagnostics: ObservabilityDiagnosticReport[];
  alerts: ObservabilityAlert[];
  telemetry: ObservabilityTelemetryEvent[];
};

export function createObservabilitySnapshot(
  snapshot: Partial<ObservabilitySnapshot> = {},
): ObservabilitySnapshot {
  return {
    logs: snapshot.logs ?? [],
    metrics: snapshot.metrics ?? [],
    traces: snapshot.traces ?? [],
    healthChecks: snapshot.healthChecks ?? [],
    diagnostics: snapshot.diagnostics ?? [],
    alerts: snapshot.alerts ?? [],
    telemetry: snapshot.telemetry ?? [],
  };
}

export function hasObservabilityIssues(
  snapshot: ObservabilitySnapshot,
): boolean {
  return (
    snapshot.logs.some((log) => log.severity === "error" || log.severity === "critical") ||
    snapshot.healthChecks.some((check) => check.status !== "healthy") ||
    snapshot.alerts.some((alert) => !alert.resolved)
  );
}