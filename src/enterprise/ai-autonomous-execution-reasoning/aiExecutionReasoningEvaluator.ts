import { AIExecutionReasoningChain } from "./aiExecutionReasoningChain";
import { AIExecutionReasoningScore } from "./aiExecutionReasoningTypes";

export interface AIExecutionReasoningEvaluation {
  score: AIExecutionReasoningScore;
  summary: string;
  evaluatedAt: Date;
}

export function evaluateAIExecutionReasoningChain(
  chain: AIExecutionReasoningChain,
): AIExecutionReasoningEvaluation {
  const evidenceStrength =
    chain.steps.reduce((sum, step) => sum + step.evidence.length, 0) /
    Math.max(chain.steps.length, 1);

  const normalizedEvidence = Math.min(evidenceStrength / 5, 1);

  const score: AIExecutionReasoningScore = {
    confidence:
      chain.confidence === "very_high"
        ? 1
        : chain.confidence === "high"
          ? 0.85
          : chain.confidence === "medium"
            ? 0.65
            : chain.confidence === "low"
              ? 0.4
              : 0.15,
    evidenceStrength: normalizedEvidence,
    constraintFit: 0.8,
    riskExposure: 0.25,
    executionReadiness: 0.8,
  };

  return {
    score,
    evaluatedAt: new Date(),
    summary: `Confidence ${(score.confidence * 100).toFixed(
      0,
    )}% | Evidence ${(score.evidenceStrength * 100).toFixed(0)}%`,
  };
}