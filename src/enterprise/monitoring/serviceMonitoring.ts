import {
  MonitoringCheckResult,
  MonitoringStatus,
  MonitoringTarget,
} from "./monitoringTypes";
import { createHealthCheckResult } from "./healthMonitoring";

export type ServiceMonitoringInput = {
  serviceId: string;
  serviceName: string;
  organizationId?: string;
  environment?: string;
  isAvailable: boolean;
  latencyMs?: number;
  errorRate?: number;
  metadata?: Record<string, unknown>;
};

export function monitorService(
  input: ServiceMonitoringInput,
): MonitoringCheckResult {
  const target: MonitoringTarget = {
    id: input.serviceId,
    name: input.serviceName,
    type: "service",
    organizationId: input.organizationId,
    environment: input.environment,
  };

  const degraded =
    input.isAvailable &&
    ((input.latencyMs !== undefined && input.latencyMs > 1000) ||
      (input.errorRate !== undefined && input.errorRate > 0.05));

  const status: MonitoringStatus = !input.isAvailable
    ? "unhealthy"
    : degraded
      ? "degraded"
      : "healthy";

  return createHealthCheckResult({
    target,
    healthy: status === "healthy",
    severity:
      status === "healthy" ? "info" : status === "degraded" ? "warning" : "critical",
    message: buildServiceMonitoringMessage(input, status),
    metadata: {
      latencyMs: input.latencyMs,
      errorRate: input.errorRate,
      ...input.metadata,
    },
  });
}

function buildServiceMonitoringMessage(
  input: ServiceMonitoringInput,
  status: MonitoringStatus,
): string {
  if (status === "healthy") {
    return `${input.serviceName} is operating normally.`;
  }

  if (status === "degraded") {
    return `${input.serviceName} is available but degraded.`;
  }

  return `${input.serviceName} is unavailable or unhealthy.`;
}