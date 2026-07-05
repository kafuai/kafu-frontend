import type { Workload } from "./workload";

export interface WorkloadPolicy {
  readonly id: string;
  readonly name: string;
  readonly maxUtilizationRatio: number;
}

export function isWorkloadWithinPolicy(
  workload: Workload,
  policy: WorkloadPolicy,
): boolean {
  if (workload.capacityMinutes <= 0) {
    return false;
  }

  return workload.assignedMinutes / workload.capacityMinutes <= policy.maxUtilizationRatio;
}