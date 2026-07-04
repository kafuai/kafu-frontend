import {
  EnterpriseRiskLikelihood,
  EnterpriseRiskSeverity,
} from "./riskTypes";

export interface EnterpriseRiskScore {
  severityScore: number;
  likelihoodScore: number;
  totalScore: number;
  rating: "low" | "medium" | "high" | "critical";
}

const severityScores: Record<EnterpriseRiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const likelihoodScores: Record<EnterpriseRiskLikelihood, number> = {
  rare: 1,
  unlikely: 2,
  possible: 3,
  likely: 4,
  almostCertain: 5,
};

export function calculateEnterpriseRiskScore(params: {
  severity: EnterpriseRiskSeverity;
  likelihood: EnterpriseRiskLikelihood;
}): EnterpriseRiskScore {
  const severityScore = severityScores[params.severity];
  const likelihoodScore = likelihoodScores[params.likelihood];
  const totalScore = severityScore * likelihoodScore;

  return {
    severityScore,
    likelihoodScore,
    totalScore,
    rating: resolveEnterpriseRiskRating(totalScore),
  };
}

export function resolveEnterpriseRiskRating(
  totalScore: number,
): EnterpriseRiskScore["rating"] {
  if (totalScore >= 16) {
    return "critical";
  }

  if (totalScore >= 10) {
    return "high";
  }

  if (totalScore >= 5) {
    return "medium";
  }

  return "low";
}