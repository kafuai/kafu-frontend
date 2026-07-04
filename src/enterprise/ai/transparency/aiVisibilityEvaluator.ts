import { AITransparencyAudience } from "./aiTransparencyTypes";
import { AIVisibilityPolicy } from "./aiVisibilityPolicy";

export interface AIVisibilityEvaluationInput {
  audience: AITransparencyAudience;
  policy: AIVisibilityPolicy;
}

export interface AIVisibilityEvaluationResult {
  audienceAllowed: boolean;
  canViewDataSources: boolean;
  canViewLimitations: boolean;
  canViewConfidence: boolean;
  canViewHumanReviewStatus: boolean;
  canViewPolicyConstraints: boolean;
}

export function evaluateAIVisibility(
  input: AIVisibilityEvaluationInput,
): AIVisibilityEvaluationResult {
  const audienceAllowed = input.policy.allowedAudiences.includes(
    input.audience,
  );

  return {
    audienceAllowed,
    canViewDataSources: audienceAllowed && input.policy.allowDataSources,
    canViewLimitations: audienceAllowed && input.policy.allowLimitations,
    canViewConfidence: audienceAllowed && input.policy.allowConfidence,
    canViewHumanReviewStatus:
      audienceAllowed && input.policy.allowHumanReviewStatus,
    canViewPolicyConstraints:
      audienceAllowed && input.policy.allowPolicyConstraints,
  };
}