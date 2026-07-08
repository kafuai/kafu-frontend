export interface WorkforceAllocation {
  employeeId: string;
  assignment: string;
  percentage: number;
}

export function isValidAllocation(
  allocation: WorkforceAllocation
): boolean {
  return (
    allocation.percentage > 0 &&
    allocation.percentage <= 100
  );
}

export function normalizeAllocation(
  allocation: WorkforceAllocation
): WorkforceAllocation {
  return {
    ...allocation,
    percentage: Math.min(
      allocation.percentage,
      100
    ),
  };
}
