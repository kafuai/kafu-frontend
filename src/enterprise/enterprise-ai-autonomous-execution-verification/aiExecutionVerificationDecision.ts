import {
  AIExecutionVerificationFinding,
  AIExecutionVerificationResult,
  AIExecutionVerificationStatus,
} from "./aiExecutionVerificationTypes";
import { AIExecutionVerificationScore } from "./aiExecutionVerificationScoring";

export function createAIExecutionVerificationDecision(
  executionId: string,
  validationId: string,
  score: AIExecutionVerificationScore,
  findings: AIExecutionVerificationFinding[],
  verifiedEvidenceCount: number
): AIExecutionVerificationResult {
  const blockingFindingCount = findings.filter(
    (f) => f.isBlocking
  ).length;

  let status: AIExecutionVerificationStatus = "verified";

  if (blockingFindingCount > 0) {
    status = "unverified";
  } else if (score.finalScore < 0.5) {
    status = "inconclusive";
  } else if (score.finalScore < 0.8) {
    status = "partially_verified";
  }

  return {
    executionId,
    validationId,
    status,
    score: score.finalScore,
    confidence: score.confidence,
    verifiedEvidenceCount,
    blockingFindingCount,
    generatedAt: new Date().toISOString(),
  };
}