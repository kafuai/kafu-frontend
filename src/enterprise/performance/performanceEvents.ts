import { PerformanceSeverity } from "./performanceTypes";

export type PerformanceEventType =
  | "profile_created"
  | "baseline_created"
  | "bottleneck_detected"
  | "optimization_recommended"
  | "resource_optimized"
  | "cache_optimized"
  | "query_optimized";

export type PerformanceEvent = {
  id: string;
  organizationId: string;
  type: PerformanceEventType;
  severity: PerformanceSeverity;
  message: string;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
};

export function createPerformanceEvent(
  event: Omit<PerformanceEvent, "occurredAt">,
): PerformanceEvent {
  return {
    ...event,
    occurredAt: new Date(),
  };
}