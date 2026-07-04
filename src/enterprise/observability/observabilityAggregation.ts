import {
  ObservabilityMetric,
  ObservabilitySeverity,
} from "./observabilityTypes";
import { ObservabilityRegistryState } from "./observabilityRegistry";

export type ObservabilityAggregationSummary = {
  totalLogs: number;
  totalMetrics: number;
  totalTraces: number;
  totalHealthChecks: number;
  activeAlerts: number;
  logsBySeverity: Record<ObservabilitySeverity, number>;
};

export function aggregateObservabilityState(
  state: ObservabilityRegistryState,
): ObservabilityAggregationSummary {
  return {
    totalLogs: state.logs.length,
    totalMetrics: state.metrics.length,
    totalTraces: state.traces.length,
    totalHealthChecks: state.healthChecks.length,
    activeAlerts: state.alerts.filter((alert) => !alert.resolved).length,
    logsBySeverity: {
      debug: state.logs.filter((log) => log.severity === "debug").length,
      info: state.logs.filter((log) => log.severity === "info").length,
      warning: state.logs.filter((log) => log.severity === "warning").length,
      error: state.logs.filter((log) => log.severity === "error").length,
      critical: state.logs.filter((log) => log.severity === "critical").length,
    },
  };
}

export function calculateMetricAverage(
  metrics: ObservabilityMetric[],
): number {
  if (metrics.length === 0) return 0;

  return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
}