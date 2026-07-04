import { AITrustEvidence } from "./aiTrustTypes";

export interface AIProvenanceTrustInput {
  datasetLineageAvailable: boolean;
  modelLineageAvailable: boolean;
  trainingSourceVerified: boolean;
  deploymentSourceVerified: boolean;
  evidence: AITrustEvidence[];
}

export interface AIProvenanceTrustResult {
  score: number;
  verified: boolean;
  gaps: string[];
  evidence: AITrustEvidence[];
  evaluatedAt: Date;
}

export function evaluateAIProvenanceTrust(
  input: AIProvenanceTrustInput,
): AIProvenanceTrustResult {
  let score = 0;
  const gaps: string[] = [];

  if (input.datasetLineageAvailable) score += 25;
  else gaps.push("Dataset lineage is unavailable.");

  if (input.modelLineageAvailable) score += 25;
  else gaps.push("Model lineage is unavailable.");

  if (input.trainingSourceVerified) score += 25;
  else gaps.push("Training source is not verified.");

  if (input.deploymentSourceVerified) score += 25;
  else gaps.push("Deployment source is not verified.");

  return {
    score,
    verified: score >= 75 && gaps.length === 0,
    gaps,
    evidence: input.evidence,
    evaluatedAt: new Date(),
  };
}