import { AITrustEvidence } from "./aiTrustTypes";

export interface AIReliabilityTrustInput {
  uptimePercentage: number;
  incidentCount: number;
  rollbackAvailable: boolean;
  monitoringEnabled: boolean;
  evidence: AITrustEvidence[];
}

export interface AIReliabilityTrustResult {
  score: number;
  reliable: boolean;
  risks: string[];
  evidence: AITrustEvidence[];
  evaluatedAt: Date;
}

export function evaluateAIReliabilityTrust(
  input: AIReliabilityTrustInput,
): AIReliabilityTrustResult {
  let score = Math.min(50, Math.max(0, input.uptimePercentage / 2));
  const risks: string[] = [];

  if (input.incidentCount === 0) score += 20;
  else if (input.incidentCount <= 2) score += 10;
  else risks.push("High AI incident count detected.");

  if (input.rollbackAvailable) score += 15;
  else risks.push("Rollback capability is missing.");

  if (input.monitoringEnabled) score += 15;
  else risks.push("Trust monitoring is not enabled.");

  const normalizedScore = Math.round(Math.min(100, score) * 100) / 100;

  return {
    score: normalizedScore,
    reliable: normalizedScore >= 75 && risks.length === 0,
    risks,
    evidence: input.evidence,
    evaluatedAt: new Date(),
  };
}