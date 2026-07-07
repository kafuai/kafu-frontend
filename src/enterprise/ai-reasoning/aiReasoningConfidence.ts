import {
  AIReasoningConfidence,
  AIReasoningScore,
} from "./aiReasoningTypes";

export function deriveAIReasoningConfidence(
  score: AIReasoningScore,
): AIReasoningConfidence {
  const overall =
    score.confidence * 0.5 +
    score.consistency * 0.3 +
    score.evidenceCoverage * 0.2;

  if (overall >= 0.90) return "very_high";
  if (overall >= 0.75) return "high";
  if (overall >= 0.50) return "medium";

  return "low";
}