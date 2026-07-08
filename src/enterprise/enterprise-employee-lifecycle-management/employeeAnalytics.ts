export interface EmployeeAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  onboardingEmployees: number;
  exitedEmployees: number;
}

export function calculateRetentionRate(
  analytics: EmployeeAnalytics
): number {
  if (!analytics.totalEmployees) return 0;

  return Math.round(
    ((analytics.totalEmployees - analytics.exitedEmployees) /
      analytics.totalEmployees) *
      100
  );
}
