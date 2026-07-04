import {
  AIExecutionVerificationEvidence,
  AIExecutionVerificationFinding,
} from "./aiExecutionVerificationTypes";
import { calculateAIExecutionVerificationEvidenceStrength } from "./aiExecutionVerificationEvidence";

export interface AIExecutionVerificationScore {
  evidenceScore: number;
  findingPenalty: number;
  finalScore: number;
  confidence: number;
}

const clamp = (v: number): number => Math.max(0, Math.min(1, v));

export function scoreAIExecutionVerification(
  evidence: AIExecutionVerificationEvidence[],
  findings: AIExecutionVerificationFinding[] = []
): AIExecutionVerificationScore {
  const evidenceScore =
    evidence.length === 0
      ? 0
      : evidence.reduce(
          (sum, item) =>
            sum + calculateAIExecutionVerificationEvidenceStrength(item),
          0
        ) / evidence.length;

  const findingPenalty = Math.min(findings.length * 0.08, 0.6);

  const finalScore = clamp(evidenceScore - findingPenalty);

  return {
    evidenceScore: clamp(evidenceScore),
    findingPenalty,
    finalScore,
    confidence: clamp(finalScore),
  };
}