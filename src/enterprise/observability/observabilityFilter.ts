import {
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilitySeverity,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";

export function filterObservabilityLogsBySeverity(
  logs: ObservabilityLogEntry[],
  severity: ObservabilitySeverity,
): ObservabilityLogEntry[] {
  return logs.filter((log) => log.severity === severity);
}

export function filterObservabilityMetricsByName(
  metrics: ObservabilityMetric[],
  name: string,
): ObservabilityMetric[] {
  return metrics.filter((metric) => metric.name === name);
}

export function filterObservabilityTracesByTraceId(
  traces: ObservabilityTraceSpan[],
  traceId: string,
): ObservabilityTraceSpan[] {
  return traces.filter((trace) => trace.traceId === traceId);
}

export function filterObservabilityTelemetryByType(
  telemetry: ObservabilityTelemetryEvent[],
  type: string,
): ObservabilityTelemetryEvent[] {
  return telemetry.filter((event) => event.type === type);
}