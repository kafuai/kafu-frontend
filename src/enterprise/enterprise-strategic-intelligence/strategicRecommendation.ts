import {
  StrategicRecommendation,
  StrategicRiskLevel,
} from "./strategicIntelligenceTypes";
import { StrategicOption } from "./strategicOption";

export function createStrategicRecommendationsFromOptions(
  options: StrategicOption[],
): StrategicRecommendation[] {
  return options.map((option) => ({
    id: `recommendation-${option.id}`,
    title: option.title.replace("Strategic Option:", "Strategic Recommendation:"),
    description: option.rationale,
    expectedImpact: normalizeStrategicImpact(option.score / 100),
    riskLevel: inferStrategicRiskLevel(option.score),
  }));
}

function normalizeStrategicImpact(value: number): number {
  return Math.max(0, Math.min(value, 1));
}

function inferStrategicRiskLevel(score: number): StrategicRiskLevel {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}