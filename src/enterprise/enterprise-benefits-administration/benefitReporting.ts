export interface BenefitReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createBenefitReport(
  report: BenefitReport
): BenefitReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function countBenefitReportMetrics(
  report: BenefitReport
): number {
  return Object.keys(report.metrics).length;
}
