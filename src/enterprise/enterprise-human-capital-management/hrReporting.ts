export interface HRReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createHRReport(
  report: HRReport
): HRReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function reportMetricCount(
  report: HRReport
): number {
  return Object.keys(report.metrics).length;
}
