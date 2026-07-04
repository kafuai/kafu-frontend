import {
  AIEvaluationResult,
  AIEvaluationRiskLevel,
} from "./aiEvaluationTypes";

export interface AIEvaluationAnalytics {
  averageScore: number;
  passRate: number;
  highestScore: number;
  lowestScore: number;
  riskDistribution: Record<AIEvaluationRiskLevel, number>;
}

export function analyzeEvaluationResults(
  results: AIEvaluationResult[],
): AIEvaluationAnalytics {
  if (results.length === 0) {
    return {
      averageScore: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0,
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
    };
  }

  const scores = results.map((r) => r.percentageScore);

  const passed = results.filter((r) => r.passed).length;

  const riskDistribution = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  } satisfies Record<AIEvaluationRiskLevel, number>;

  for (const result of results) {
    riskDistribution[result.riskLevel]++;
  }

  return {
    averageScore:
      scores.reduce((a, b) => a + b, 0) / scores.length,
    passRate: (passed / results.length) * 100,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    riskDistribution,
  };
}