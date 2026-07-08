export interface PerformanceAnalytics {
  totalEmployees: number;
  averageScore: number;
  completionRate: number;
}

export function calculatePerformanceHealth(
  analytics: PerformanceAnalytics
): number {
  return Math.round(
    analytics.averageScore
  );
}

export function hasPerformanceData(
  analytics: PerformanceAnalytics
): boolean {
  return analytics.totalEmployees > 0;
}
