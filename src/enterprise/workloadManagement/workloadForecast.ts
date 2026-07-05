import type { WorkloadStatus } from "./workload";

export interface WorkloadForecast {
  readonly resourceId: string;
  readonly forecastedAssignedMinutes: number;
  readonly forecastedCapacityMinutes: number;
  readonly expectedStatus: WorkloadStatus;
}

export function createWorkloadForecast(
  resourceId: string,
  forecastedAssignedMinutes: number,
  forecastedCapacityMinutes: number,
): WorkloadForecast {
  const ratio =
    forecastedCapacityMinutes <= 0
      ? 1
      : forecastedAssignedMinutes / forecastedCapacityMinutes;

  const expectedStatus: WorkloadStatus =
    ratio >= 1 ? "overloaded" : ratio >= 0.8 ? "elevated" : "normal";

  return {
    resourceId,
    forecastedAssignedMinutes,
    forecastedCapacityMinutes,
    expectedStatus,
  };
}