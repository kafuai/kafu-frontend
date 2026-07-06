import { AIRecommendationContext } from "../types/aiRecommendationTypes";

export interface AIRecommendationPolicyResult {
  allowed: boolean;
  reasons: string[];
}

export function evaluateAIRecommendationPolicy(
  context: AIRecommendationContext,
): AIRecommendationPolicyResult {
  const reasons: string[] = [];

  if (!context.organizationId) {
    reasons.push("Missing organization id.");
  }

  if (!context.objective) {
    reasons.push("Missing recommendation objective.");
  }

  if (!context.requestedBy) {
    reasons.push("Missing recommendation requester.");
  }

  if (!Array.isArray(context.signals) || context.signals.length === 0) {
    reasons.push("At least one recommendation signal is required.");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}