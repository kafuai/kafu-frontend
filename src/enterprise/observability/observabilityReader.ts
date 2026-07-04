import {
  ObservabilityAlert,
  ObservabilityHealthCheck,
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";
import { ObservabilityRegistryState } from "./observabilityRegistry";

export function getObservabilityLogs(
  state: ObservabilityRegistryState,
): ObservabilityLogEntry[] {
  return state.logs;
}

export function getObservabilityMetrics(
  state: ObservabilityRegistryState,
): ObservabilityMetric[] {
  return state.metrics;
}

export function getObservabilityTraces(
  state: ObservabilityRegistryState,
): ObservabilityTraceSpan[] {
  return state.traces;
}

export function getObservabilityHealthChecks(
  state: ObservabilityRegistryState,
): ObservabilityHealthCheck[] {
  return state.healthChecks;
}

export function getActiveObservabilityAlerts(
  state: ObservabilityRegistryState,
): ObservabilityAlert[] {
  return state.alerts.filter((alert) => !alert.resolved);
}

export function getObservabilityTelemetryEvents(
  state: ObservabilityRegistryState,
): ObservabilityTelemetryEvent[] {
  return state.telemetry;
}