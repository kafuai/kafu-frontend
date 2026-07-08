export interface EmployeeLifecycleReport {
  employeeId: string;
  summary: string;
  recommendations: string[];
  generatedAt: string;
}

export function createEmployeeLifecycleReport(
  report: EmployeeLifecycleReport
): EmployeeLifecycleReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function hasRecommendations(
  report: EmployeeLifecycleReport
): boolean {
  return report.recommendations.length > 0;
}
