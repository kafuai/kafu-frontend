export interface WorkforceUtilization {
  department: string;
  allocatedHours: number;
  availableHours: number;
}

export function calculateWorkforceUtilization(
  utilization: WorkforceUtilization
): number {
  if (!utilization.availableHours) return 0;

  return Math.round(
    (utilization.allocatedHours /
      utilization.availableHours) *
      100
  );
}
