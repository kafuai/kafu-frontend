import {
  PerformanceBaseline,
  PerformanceMetricType,
} from "./performanceTypes";

export type CreatePerformanceBaselineInput = {
  id: string;
  organizationId: string;
  serviceName: string;
  metricType: PerformanceMetricType;
  expectedValue: number;
  tolerancePercentage?: number;
};

export function createPerformanceBaseline(
  input: CreatePerformanceBaselineInput,
): PerformanceBaseline {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    serviceName: input.serviceName,
    metricType: input.metricType,
    expectedValue: input.expectedValue,
    tolerancePercentage: input.tolerancePercentage ?? 10,
    createdAt: now,
    updatedAt: now,
  };
}

export function isMetricOutsideBaseline(
  value: number,
  baseline: PerformanceBaseline,
): boolean {
  const tolerance = baseline.expectedValue * (baseline.tolerancePercentage / 100);
  const minimum = baseline.expectedValue - tolerance;
  const maximum = baseline.expectedValue + tolerance;

  return value < minimum || value > maximum;
}