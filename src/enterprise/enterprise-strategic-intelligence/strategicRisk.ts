import {
  StrategicRecommendation,
  StrategicRiskLevel,
} from "./strategicIntelligenceTypes";

export interface StrategicRiskAssessment {
  id: string;
  sourceRecommendationId: string;
  level: StrategicRiskLevel;
  score: number;
  mitigation: string;
}

export function assessStrategicRisks(
  recommendations: StrategicRecommendation[],
): StrategicRiskAssessment[] {
  return recommendations.map((recommendation) => ({
    id: `risk-${recommendation.id}`,
    sourceRecommendationId: recommendation.id,
    level: recommendation.riskLevel,
    score: getStrategicRiskScore(recommendation.riskLevel),
    mitigation: buildStrategicMitigation(recommendation.riskLevel),
  }));
}

function getStrategicRiskScore(level: StrategicRiskLevel): number {
  switch (level) {
    case "critical":
      return 100;
    case "high":
      return 75;
    case "medium":
      return 50;
    case "low":
      return 25;
    default:
      return 0;
  }
}

function buildStrategicMitigation(level: StrategicRiskLevel): string {
  switch (level) {
    case "critical":
      return "Require executive review, phased rollout, and continuous risk monitoring.";
    case "high":
      return "Require leadership approval and defined mitigation ownership.";
    case "medium":
      return "Track through quarterly strategy review.";
    case "low":
      return "Monitor as part of standard strategic reporting.";
    default:
      return "No mitigation required.";
  }
}