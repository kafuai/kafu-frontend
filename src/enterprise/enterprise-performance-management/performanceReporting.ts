export interface PerformanceReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createPerformanceReport(
  report: PerformanceReport
): PerformanceReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function countPerformanceMetrics(
  report: PerformanceReport
): number {
  return Object.keys(report.metrics).length;
}
