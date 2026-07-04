import {
  MonitoringCheckResult,
  MonitoringSeverity,
  MonitoringStatus,
  MonitoringTarget,
} from "./monitoringTypes";

export type HealthCheckInput = {
  target: MonitoringTarget;
  healthy: boolean;
  message?: string;
  severity?: MonitoringSeverity;
  metadata?: Record<string, unknown>;
};

export function createHealthCheckResult(
  input: HealthCheckInput,
): MonitoringCheckResult {
  const status: MonitoringStatus = input.healthy ? "healthy" : "unhealthy";

  return {
    id: `${input.target.id}-health-${Date.now()}`,
    target: input.target,
    status,
    severity: input.severity ?? (input.healthy ? "info" : "critical"),
    message:
      input.message ??
      (input.healthy
        ? `${input.target.name} is healthy.`
        : `${input.target.name} is unhealthy.`),
    checkedAt: new Date(),
    metadata: input.metadata,
  };
}

export function calculateHealthStatus(
  checks: MonitoringCheckResult[],
): MonitoringStatus {
  if (checks.length === 0) return "unknown";

  if (checks.some((check) => check.status === "unhealthy")) {
    return "unhealthy";
  }

  if (checks.some((check) => check.status === "degraded")) {
    return "degraded";
  }

  if (checks.every((check) => check.status === "healthy")) {
    return "healthy";
  }

  return "unknown";
}