import {
  ObservabilityHealthCheck,
  ObservabilityStatus,
} from "./observabilityTypes";

export function createObservabilityHealthCheck(
  name: string,
  status: ObservabilityStatus,
  details?: Record<string, unknown>,
): ObservabilityHealthCheck {
  return {
    id: crypto.randomUUID(),
    name,
    status,
    checkedAt: new Date(),
    details,
  };
}

export function isObservabilityHealthIssue(
  healthCheck: ObservabilityHealthCheck,
): boolean {
  return healthCheck.status === "degraded" || healthCheck.status === "unhealthy";
}