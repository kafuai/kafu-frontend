import {
  ObservabilityAggregationSummary,
} from "./observabilityAggregation";

export function createObservabilitySummaryReport(
  summary: ObservabilityAggregationSummary,
): string {
  return [
    "Observability Summary Report",
    `Total Logs: ${summary.totalLogs}`,
    `Total Metrics: ${summary.totalMetrics}`,
    `Total Traces: ${summary.totalTraces}`,
    `Total Health Checks: ${summary.totalHealthChecks}`,
    `Active Alerts: ${summary.activeAlerts}`,
    `Debug Logs: ${summary.logsBySeverity.debug}`,
    `Info Logs: ${summary.logsBySeverity.info}`,
    `Warning Logs: ${summary.logsBySeverity.warning}`,
    `Error Logs: ${summary.logsBySeverity.error}`,
    `Critical Logs: ${summary.logsBySeverity.critical}`,
  ].join("\n");
}