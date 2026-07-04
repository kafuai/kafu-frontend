import { AIEvaluationRun } from "./aiEvaluationTypes";

export interface AIEvaluationBenchmark {
  id: string;
  organizationId: string;
  name: string;
  targetScore: number;
  minimumPassRate: number;
}

export interface BenchmarkComparisonResult {
  meetsScoreTarget: boolean;
  meetsPassRateTarget: boolean;
  averageScore: number;
  passRate: number;
}

export function compareEvaluationToBenchmark(
  run: AIEvaluationRun,
  benchmark: AIEvaluationBenchmark,
): BenchmarkComparisonResult {
  const total = run.results.length;

  if (total === 0) {
    return {
      meetsScoreTarget: false,
      meetsPassRateTarget: false,
      averageScore: 0,
      passRate: 0,
    };
  }

  const averageScore =
    run.results.reduce((sum, r) => sum + r.percentageScore, 0) / total;

  const passed = run.results.filter((r) => r.passed).length;
  const passRate = (passed / total) * 100;

  return {
    meetsScoreTarget: averageScore >= benchmark.targetScore,
    meetsPassRateTarget: passRate >= benchmark.minimumPassRate,
    averageScore,
    passRate,
  };
}