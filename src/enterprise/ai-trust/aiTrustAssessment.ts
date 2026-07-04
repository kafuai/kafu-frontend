import { AITrustLevel } from "./aiTrustTypes";
import { AITrustEvaluationResult } from "./aiTrustEvaluator";

export interface AITrustAssessment {
  id: string;
  profileId: string;
  score: number;
  level: AITrustLevel;
  passed: boolean;
  summary: string;
  requiredActions: string[];
  assessedAt: Date;
}

export function createAITrustAssessment(
  id: string,
  evaluation: AITrustEvaluationResult,
): AITrustAssessment {
  const requiredActions = evaluation.failedSignals.map(
    (signal) => `Improve trust signal: ${signal.name}`,
  );

  return {
    id,
    profileId: evaluation.profileId,
    score: evaluation.score,
    level: evaluation.level,
    passed: evaluation.passed,
    summary: evaluation.passed
      ? "AI trust evaluation passed."
      : "AI trust evaluation requires remediation.",
    requiredActions,
    assessedAt: new Date(),
  };
}