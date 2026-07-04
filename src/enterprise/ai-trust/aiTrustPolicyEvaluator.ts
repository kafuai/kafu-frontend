import { AITrustProfile } from "./aiTrustProfile";
import { AITrustPolicy, isAITrustPolicySatisfied } from "./aiTrustPolicy";

export interface AITrustPolicyEvaluation {
  policyId: string;
  profileId: string;
  satisfied: boolean;
  score: number;
  missingCategories: string[];
  evaluatedAt: Date;
}

export function evaluateAITrustPolicy(
  profile: AITrustProfile,
  policy: AITrustPolicy,
): AITrustPolicyEvaluation {
  const presentCategories = profile.signals.map((signal) => signal.category);

  const missingCategories = policy.requiredSignalCategories.filter(
    (category) => !presentCategories.includes(category),
  );

  return {
    policyId: policy.id,
    profileId: profile.id,
    satisfied: isAITrustPolicySatisfied(profile.trustScore.score, presentCategories, policy),
    score: profile.trustScore.score,
    missingCategories,
    evaluatedAt: new Date(),
  };
}