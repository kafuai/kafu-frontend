import {
  PerformanceMetric,
  PerformanceProfile,
  PerformanceStatus,
} from "./performanceTypes";

export type CreatePerformanceProfileInput = {
  id: string;
  organizationId: string;
  serviceName: string;
  metrics?: PerformanceMetric[];
};

export function createPerformanceProfile(
  input: CreatePerformanceProfileInput,
): PerformanceProfile {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    serviceName: input.serviceName,
    status: resolvePerformanceStatus(input.metrics ?? []),
    metrics: input.metrics ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function resolvePerformanceStatus(
  metrics: PerformanceMetric[],
): PerformanceStatus {
  const hasCriticalMetric = metrics.some((metric) => metric.value < 0);

  if (hasCriticalMetric) return "critical";
  if (metrics.length === 0) return "degraded";

  return "healthy";
}