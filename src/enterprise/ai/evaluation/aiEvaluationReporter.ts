import { AIEvaluationRun } from "./aiEvaluationTypes";

export interface AIEvaluationSummaryReport {
  organizationId: string;
  runId: string;
  runName: string;
  totalSamples: number;
  passedSamples: number;
  failedSamples: number;
  averageScore: number;
  generatedAt: Date;
}

export function generateEvaluationSummaryReport(
  run: AIEvaluationRun,
): AIEvaluationSummaryReport {
  const totalSamples = run.results.length;

  const passedSamples = run.results.filter(
    (result) => result.passed,
  ).length;

  const failedSamples = totalSamples - passedSamples;

  const averageScore =
    totalSamples === 0
      ? 0
      : run.results.reduce(
          (sum, result) => sum + result.percentageScore,
          0,
        ) / totalSamples;

  return {
    organizationId: run.organizationId,
    runId: run.id,
    runName: run.name,
    totalSamples,
    passedSamples,
    failedSamples,
    averageScore,
    generatedAt: new Date(),
  };
}