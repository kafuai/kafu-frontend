import { AIEvaluationRun } from "./aiEvaluationTypes";

export type EvaluationTrend =
  | "improving"
  | "stable"
  | "declining";

export interface EvaluationTrendResult {
  trend: EvaluationTrend;
  firstAverage: number;
  lastAverage: number;
  delta: number;
}

export function evaluateTrend(
  runs: AIEvaluationRun[],
): EvaluationTrendResult {
  if (runs.length < 2) {
    return {
      trend: "stable",
      firstAverage: 0,
      lastAverage: 0,
      delta: 0,
    };
  }

  const averages = runs.map((run) => {
    if (run.results.length === 0) {
      return 0;
    }

    return (
      run.results.reduce(
        (sum, result) => sum + result.percentageScore,
        0,
      ) / run.results.length
    );
  });

  const firstAverage = averages[0];
  const lastAverage = averages[averages.length - 1];
  const delta = lastAverage - firstAverage;

  let trend: EvaluationTrend = "stable";

  if (delta > 5) {
    trend = "improving";
  } else if (delta < -5) {
    trend = "declining";
  }

  return {
    trend,
    firstAverage,
    lastAverage,
    delta,
  };
}