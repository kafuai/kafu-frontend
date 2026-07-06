import { AIEnterpriseLearningProfile } from "./aiEnterpriseLearningProfile";

export interface AIEnterpriseLearningReadinessResult {
  organizationId: string;
  ready: boolean;
  score: number;
  reasons: string[];
  evaluatedAt: Date;
}

export function evaluateAIEnterpriseLearningReadiness(
  profile: AIEnterpriseLearningProfile,
): AIEnterpriseLearningReadinessResult {
  const reasons: string[] = [];
  let score = 0;

  if (profile.totalSignals >= 10) {
    score += 30;
  } else {
    reasons.push("Not enough learning signals captured.");
  }

  if (profile.totalFeedback >= 5) {
    score += 25;
  } else {
    reasons.push("Not enough feedback captured.");
  }

  if (profile.totalInsights >= 3) {
    score += 25;
  } else {
    reasons.push("Not enough learning insights generated.");
  }

  if (profile.highConfidenceSignals > profile.negativeSignals) {
    score += 20;
  } else {
    reasons.push("Negative or mixed learning signals still require attention.");
  }

  return {
    organizationId: profile.organizationId,
    ready: score >= 70,
    score,
    reasons,
    evaluatedAt: new Date(),
  };
}