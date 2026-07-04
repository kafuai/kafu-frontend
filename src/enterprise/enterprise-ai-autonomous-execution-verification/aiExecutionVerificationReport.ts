import {
  AIExecutionVerificationEvidence,
  AIExecutionVerificationFinding,
  AIExecutionVerificationResult,
} from "./aiExecutionVerificationTypes";
import { calculateAIExecutionVerificationEvidenceStrength } from "./aiExecutionVerificationEvidence";

export interface AIExecutionVerificationReport {
  executionId: string;
  validationId: string;
  status: AIExecutionVerificationResult["status"];
  score: number;
  confidence: number;
  evidenceSummary: {
    total: number;
    reliable: number;
    averageStrength: number;
  };
  findingsSummary: {
    total: number;
    blocking: number;
  };
  generatedAt: string;
}

const clamp = (v: number): number => Math.max(0, Math.min(1, v));

export function createAIExecutionVerificationReport(
  result: AIExecutionVerificationResult,
  evidence: AIExecutionVerificationEvidence[],
  findings: AIExecutionVerificationFinding[] = []
): AIExecutionVerificationReport {
  const strengths = evidence.map(calculateAIExecutionVerificationEvidenceStrength);

  const averageStrength =
    strengths.length === 0
      ? 0
      : strengths.reduce((sum, value) => sum + value, 0) / strengths.length;

  return {
    executionId: result.executionId,
    validationId: result.validationId,
    status: result.status,
    score: clamp(result.score),
    confidence: clamp(result.confidence),
    evidenceSummary: {
      total: evidence.length,
      reliable: evidence.filter(
        (item) => calculateAIExecutionVerificationEvidenceStrength(item) >= 0.6
      ).length,
      averageStrength: clamp(averageStrength),
    },
    findingsSummary: {
      total: findings.length,
      blocking: findings.filter((finding) => finding.isBlocking).length,
    },
    generatedAt: new Date().toISOString(),
  };
}