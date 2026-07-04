import {
  ObservabilityAlert,
  ObservabilityDiagnosticReport,
  ObservabilityHealthCheck,
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";
import { ObservabilityRegistryState } from "./observabilityRegistry";

export function collectObservabilityLog(
  state: ObservabilityRegistryState,
  log: ObservabilityLogEntry,
): ObservabilityRegistryState {
  return {
    ...state,
    logs: [...state.logs, log],
  };
}

export function collectObservabilityMetric(
  state: ObservabilityRegistryState,
  metric: ObservabilityMetric,
): ObservabilityRegistryState {
  return {
    ...state,
    metrics: [...state.metrics, metric],
  };
}

export function collectObservabilityTrace(
  state: ObservabilityRegistryState,
  trace: ObservabilityTraceSpan,
): ObservabilityRegistryState {
  return {
    ...state,
    traces: [...state.traces, trace],
  };
}

export function collectObservabilityHealthCheck(
  state: ObservabilityRegistryState,
  healthCheck: ObservabilityHealthCheck,
): ObservabilityRegistryState {
  return {
    ...state,
    healthChecks: [...state.healthChecks, healthCheck],
  };
}

export function collectObservabilityDiagnostic(
  state: ObservabilityRegistryState,
  diagnostic: ObservabilityDiagnosticReport,
): ObservabilityRegistryState {
  return {
    ...state,
    diagnostics: [...state.diagnostics, diagnostic],
  };
}

export function collectObservabilityAlert(
  state: ObservabilityRegistryState,
  alert: ObservabilityAlert,
): ObservabilityRegistryState {
  return {
    ...state,
    alerts: [...state.alerts, alert],
  };
}

export function collectObservabilityTelemetry(
  state: ObservabilityRegistryState,
  telemetry: ObservabilityTelemetryEvent,
): ObservabilityRegistryState {
  return {
    ...state,
    telemetry: [...state.telemetry, telemetry],
  };
}