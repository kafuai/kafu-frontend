import {
  AIEvaluationCriterion,
  AIEvaluationGrade,
  AIEvaluationRiskLevel,
  AIEvaluationScore,
} from "./aiEvaluationTypes";

export interface EvaluationCalculationResult {
  totalScore: number;
  maximumScore: number;
  percentageScore: number;
  grade: AIEvaluationGrade;
  riskLevel: AIEvaluationRiskLevel;
  passed: boolean;
}

export function calculateEvaluationResult(
  criteria: AIEvaluationCriterion[],
  scores: AIEvaluationScore[],
): EvaluationCalculationResult {
  let totalScore = 0;
  let maximumScore = 0;
  let requiredFailed = false;

  for (const criterion of criteria) {
    const score = scores.find((s) => s.criterionId === criterion.id);

    if (!score) {
      continue;
    }

    totalScore += score.weightedScore;
    maximumScore += criterion.maximumScore * criterion.weight;

    if (criterion.isRequired && !score.passed) {
      requiredFailed = true;
    }
  }

  const percentageScore =
    maximumScore === 0 ? 0 : (totalScore / maximumScore) * 100;

  return {
    totalScore,
    maximumScore,
    percentageScore,
    grade: resolveEvaluationGrade(percentageScore),
    riskLevel: resolveEvaluationRiskLevel(percentageScore),
    passed: !requiredFailed && percentageScore >= 70,
  };
}

export function resolveEvaluationGrade(
  percentage: number,
): AIEvaluationGrade {
  if (percentage >= 95) return "excellent";
  if (percentage >= 85) return "good";
  if (percentage >= 70) return "acceptable";
  if (percentage >= 50) return "weak";
  return "failed";
}

export function resolveEvaluationRiskLevel(
  percentage: number,
): AIEvaluationRiskLevel {
  if (percentage >= 90) return "low";
  if (percentage >= 75) return "medium";
  if (percentage >= 60) return "high";
  return "critical";
}