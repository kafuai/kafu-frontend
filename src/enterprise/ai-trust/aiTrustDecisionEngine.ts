import { AITrustProfile } from "./aiTrustProfile";
import { evaluateAITrustProfile } from "./aiTrustEvaluator";
import { createAITrustDecision, AITrustDecision } from "./aiTrustDecision";

export function decideAITrust(
  decisionId: string,
  profile: AITrustProfile,
  minimumScore = 70,
): AITrustDecision {
  const evaluation = evaluateAITrustProfile(profile, minimumScore);

  return createAITrustDecision(
    decisionId,
    profile.id,
    evaluation.score,
    evaluation.level,
    evaluation.failedSignals.length,
  );
}