import { ObservabilityAggregationSummary } from "./observabilityAggregation";
import { ObservabilityDiagnosticReport } from "./observabilityTypes";

export type ObservabilityDashboardModel = {
  generatedAt: Date;
  summary: ObservabilityAggregationSummary;
  latestDiagnostic?: ObservabilityDiagnosticReport;
  status: "healthy" | "degraded" | "unhealthy";
};

export function createObservabilityDashboardModel(
  summary: ObservabilityAggregationSummary,
  latestDiagnostic?: ObservabilityDiagnosticReport,
): ObservabilityDashboardModel {
  return {
    generatedAt: new Date(),
    summary,
    latestDiagnostic,
    status: latestDiagnostic?.status ?? "healthy",
  };
}