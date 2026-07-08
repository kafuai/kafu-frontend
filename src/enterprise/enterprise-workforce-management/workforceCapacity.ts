export interface WorkforceCapacity {
  department: string;
  current: number;
  maximum: number;
}

export function calculateUtilization(
  capacity: WorkforceCapacity
): number {
  if (!capacity.maximum) return 0;

  return Math.round(
    (capacity.current / capacity.maximum) * 100
  );
}
