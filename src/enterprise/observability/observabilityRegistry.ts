import {
  ObservabilityAlert,
  ObservabilityDiagnosticReport,
  ObservabilityHealthCheck,
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";

export type ObservabilityRegistryState = {
  logs: ObservabilityLogEntry[];
  metrics: ObservabilityMetric[];
  traces: ObservabilityTraceSpan[];
  healthChecks: ObservabilityHealthCheck[];
  diagnostics: ObservabilityDiagnosticReport[];
  alerts: ObservabilityAlert[];
  telemetry: ObservabilityTelemetryEvent[];
};

export function createObservabilityRegistryState(): ObservabilityRegistryState {
  return {
    logs: [],
    metrics: [],
    traces: [],
    healthChecks: [],
    diagnostics: [],
    alerts: [],
    telemetry: [],
  };
}

export function clearObservabilityRegistryState(
  state: ObservabilityRegistryState,
): ObservabilityRegistryState {
  return {
    ...state,
    logs: [],
    metrics: [],
    traces: [],
    healthChecks: [],
    diagnostics: [],
    alerts: [],
    telemetry: [],
  };
}