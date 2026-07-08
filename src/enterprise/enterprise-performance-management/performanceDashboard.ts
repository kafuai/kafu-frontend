export interface PerformanceDashboard {
  employees: number;
  averageScore: number;
  completionRate: number;
  generatedAt: string;
}

export function createPerformanceDashboard(
  dashboard: PerformanceDashboard
): PerformanceDashboard {
  return {
    ...dashboard,
    generatedAt: new Date().toISOString(),
  };
}
