export interface WorkforceReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createWorkforceReport(
  report: WorkforceReport
): WorkforceReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function countReportMetrics(
  report: WorkforceReport
): number {
  return Object.keys(report.metrics).length;
}
