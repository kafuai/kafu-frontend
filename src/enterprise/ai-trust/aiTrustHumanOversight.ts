import { AITrustEvidence } from "./aiTrustTypes";

export interface AIHumanOversightTrustInput {
  reviewerAssigned: boolean;
  escalationPathAvailable: boolean;
  overrideAvailable: boolean;
  reviewSlaHours: number;
  evidence: AITrustEvidence[];
}

export interface AIHumanOversightTrustResult {
  score: number;
  oversightReady: boolean;
  gaps: string[];
  evidence: AITrustEvidence[];
  evaluatedAt: Date;
}

export function evaluateAIHumanOversightTrust(
  input: AIHumanOversightTrustInput,
): AIHumanOversightTrustResult {
  let score = 0;
  const gaps: string[] = [];

  if (input.reviewerAssigned) score += 30;
  else gaps.push("Human reviewer is not assigned.");

  if (input.escalationPathAvailable) score += 25;
  else gaps.push("Escalation path is unavailable.");

  if (input.overrideAvailable) score += 25;
  else gaps.push("Human override is unavailable.");

  if (input.reviewSlaHours <= 24) score += 20;
  else if (input.reviewSlaHours <= 72) score += 10;
  else gaps.push("Human review SLA is too slow.");

  return {
    score,
    oversightReady: score >= 75 && gaps.length === 0,
    gaps,
    evidence: input.evidence,
    evaluatedAt: new Date(),
  };
}