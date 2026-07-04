import {
  MonitoringCheckResult,
  MonitoringStatus,
} from "./monitoringTypes";

export type AvailabilitySummary = {
  totalChecks: number;
  healthyChecks: number;
  degradedChecks: number;
  unhealthyChecks: number;
  availabilityPercentage: number;
  overallStatus: MonitoringStatus;
};

export function calculateAvailability(
  checks: MonitoringCheckResult[],
): AvailabilitySummary {
  const healthyChecks = checks.filter(
    (c) => c.status === "healthy",
  ).length;

  const degradedChecks = checks.filter(
    (c) => c.status === "degraded",
  ).length;

  const unhealthyChecks = checks.filter(
    (c) => c.status === "unhealthy",
  ).length;

  const totalChecks = checks.length;

  const availabilityPercentage =
    totalChecks === 0
      ? 100
      : (healthyChecks / totalChecks) * 100;

  const overallStatus: MonitoringStatus =
    unhealthyChecks > 0
      ? "unhealthy"
      : degradedChecks > 0
        ? "degraded"
        : "healthy";

  return {
    totalChecks,
    healthyChecks,
    degradedChecks,
    unhealthyChecks,
    availabilityPercentage,
    overallStatus,
  };
}