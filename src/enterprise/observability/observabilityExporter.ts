import { ObservabilitySnapshot } from "./observabilityEngine";
import { ObservabilityRegistryState } from "./observabilityRegistry";

export function exportObservabilityState(
  state: ObservabilityRegistryState,
): ObservabilitySnapshot {
  return {
    logs: state.logs,
    metrics: state.metrics,
    traces: state.traces,
    healthChecks: state.healthChecks,
    diagnostics: state.diagnostics,
    alerts: state.alerts,
    telemetry: state.telemetry,
  };
}

export function exportObservabilityStateAsJson(
  state: ObservabilityRegistryState,
): string {
  return JSON.stringify(exportObservabilityState(state));
}