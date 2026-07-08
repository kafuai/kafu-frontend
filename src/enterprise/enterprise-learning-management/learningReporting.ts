export interface LearningReport {
  title: string;
  summary: string;
  metrics: Record<string, number>;
  generatedAt: string;
}

export function createLearningReport(
  report: LearningReport
): LearningReport {
  return {
    ...report,
    generatedAt: new Date().toISOString(),
  };
}

export function countLearningMetrics(
  report: LearningReport
): number {
  return Object.keys(report.metrics).length;
}
