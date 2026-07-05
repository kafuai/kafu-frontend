export type WorkloadStatus = "normal" | "elevated" | "overloaded";

export interface Workload {
  readonly id: string;
  readonly resourceId: string;
  readonly capability: string;
  readonly assignedMinutes: number;
  readonly capacityMinutes: number;
  readonly status: WorkloadStatus;
}