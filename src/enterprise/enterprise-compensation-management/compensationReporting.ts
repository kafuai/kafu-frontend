export interface CompensationReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createCompensationReport(
  report: CompensationReport
): CompensationReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function countCompensationMetrics(
  report: CompensationReport
): number {
  return Object.keys(report.metrics).length;
}
