import {
  ObservabilityDiagnosticReport,
  ObservabilityHealthCheck,
  ObservabilityStatus,
} from "./observabilityTypes";

export function createObservabilityDiagnosticReport(
  healthChecks: ObservabilityHealthCheck[],
): ObservabilityDiagnosticReport {
  const findings = healthChecks
    .filter((check) => check.status !== "healthy")
    .map((check) => `${check.name}: ${check.status}`);

  const status: ObservabilityStatus =
    findings.length === 0
      ? "healthy"
      : healthChecks.some((check) => check.status === "unhealthy")
        ? "unhealthy"
        : "degraded";

  return {
    id: crypto.randomUUID(),
    generatedAt: new Date(),
    status,
    summary:
      findings.length === 0
        ? "All observability health checks are healthy."
        : "Observability issues detected.",
    findings,
  };
}