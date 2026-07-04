import { AITrustEvidence } from "./aiTrustTypes";

export interface AIExplainabilityTrustInput {
  explanationAvailable: boolean;
  explanationCompleteness: number;
  featureAttributionAvailable: boolean;
  decisionTraceAvailable: boolean;
  evidence: AITrustEvidence[];
}

export interface AIExplainabilityTrustResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  evidence: AITrustEvidence[];
  evaluatedAt: Date;
}

export function evaluateAIExplainabilityTrust(
  input: AIExplainabilityTrustInput,
): AIExplainabilityTrustResult {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (input.explanationAvailable) {
    score += 30;
    strengths.push("Explanation is available.");
  } else {
    weaknesses.push("Explanation is not available.");
  }

  score += Math.min(30, Math.max(0, input.explanationCompleteness * 30));

  if (input.featureAttributionAvailable) {
    score += 20;
    strengths.push("Feature attribution is available.");
  } else {
    weaknesses.push("Feature attribution is missing.");
  }

  if (input.decisionTraceAvailable) {
    score += 20;
    strengths.push("Decision trace is available.");
  } else {
    weaknesses.push("Decision trace is missing.");
  }

  return {
    score: Math.round(score * 100) / 100,
    strengths,
    weaknesses,
    evidence: input.evidence,
    evaluatedAt: new Date(),
  };
}