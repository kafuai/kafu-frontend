export interface TalentReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createTalentReport(
  report: TalentReport
): TalentReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function countTalentMetrics(
  report: TalentReport
): number {
  return Object.keys(report.metrics).length;
}
