import { AIRecommendationSignal } from "../types/aiRecommendationTypes";

export function calculateAIRecommendationScore(
  signal: AIRecommendationSignal,
): number {
  const impact = normalizeScore(signal.impactScore);
  const urgency = normalizeScore(signal.urgencyScore);
  const priorityWeight = getPriorityWeight(signal.priority);
  const confidenceWeight = getConfidenceWeight(signal.confidence);

  return Math.round(
    (impact * 0.4 +
      urgency * 0.3 +
      priorityWeight * 0.2 +
      confidenceWeight * 0.1) *
      100,
  );
}

function normalizeScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}

function getPriorityWeight(
  priority: AIRecommendationSignal["priority"],
): number {
  switch (priority) {
    case "critical":
      return 1;
    case "high":
      return 0.8;
    case "medium":
      return 0.6;
    case "low":
      return 0.4;
    default:
      return 0.5;
  }
}

function getConfidenceWeight(
  confidence: AIRecommendationSignal["confidence"],
): number {
  switch (confidence) {
    case "high":
      return 0.9;
    case "medium":
      return 0.6;
    case "low":
      return 0.4;
    default:
      return 0.5;
  }
}