import type { Workload, WorkloadStatus } from "./workload";

export interface CreateWorkloadOptions {
  id: string;
  resourceId: string;
  capability: string;
  assignedMinutes: number;
  capacityMinutes: number;
  status?: WorkloadStatus;
}

export function createWorkload(
  options: CreateWorkloadOptions,
): Workload {
  return {
    id: options.id,
    resourceId: options.resourceId,
    capability: options.capability,
    assignedMinutes: options.assignedMinutes,
    capacityMinutes: options.capacityMinutes,
    status: options.status ?? "normal",
  };
}