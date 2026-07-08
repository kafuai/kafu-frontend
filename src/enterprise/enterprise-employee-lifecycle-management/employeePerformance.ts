export interface EmployeePerformanceRecord {
  employeeId: string;
  score: number;
  goalsCompleted: number;
  goalsTotal: number;
}

export function calculatePerformanceRate(
  record: EmployeePerformanceRecord
): number {
  if (!record.goalsTotal) return 0;

  return Math.round(
    (record.goalsCompleted / record.goalsTotal) * 100
  );
}
