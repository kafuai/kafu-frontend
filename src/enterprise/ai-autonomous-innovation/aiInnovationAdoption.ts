import { AIInnovationExperiment } from "./aiInnovationExperiment";
import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { calculateAIInnovationExperimentProgress } from "./aiInnovationExperiment";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export type AIInnovationAdoptionDecisionStatus =
  | "adopt"
  | "iterate"
  | "reject"
  | "hold";

export interface AIInnovationAdoptionDecision {
  opportunityId: string;
  experimentId?: string;
  decision: AIInnovationAdoptionDecisionStatus;
  confidence: number;
  reason: string;
  decidedAt: Date;
}

export function decideAIInnovationAdoption(
  opportunity: AIInnovationOpportunity,
  experiment?: AIInnovationExperiment,
): AIInnovationAdoptionDecision {
  const opportunityScore = scoreAIInnovationOpportunity(opportunity).totalScore;
  const experimentProgress = experiment
    ? calculateAIInnovationExperimentProgress(experiment)
    : 0;

  const confidence = experiment
    ? opportunityScore * 0.45 + experimentProgress * 0.55
    : opportunityScore * 0.7;

  if (confidence >= 0.75 && experiment?.status === "completed") {
    return {
      opportunityId: opportunity.id,
      experimentId: experiment.id,
      decision: "adopt",
      confidence,
      reason: "Experiment completed with strong evidence and adoption-ready confidence.",
      decidedAt: new Date(),
    };
  }

  if (confidence >= 0.55) {
    return {
      opportunityId: opportunity.id,
      experimentId: experiment?.id,
      decision: "iterate",
      confidence,
      reason: "Innovation shows promise but requires further refinement before adoption.",
      decidedAt: new Date(),
    };
  }

  if (confidence < 0.35) {
    return {
      opportunityId: opportunity.id,
      experimentId: experiment?.id,
      decision: "reject",
      confidence,
      reason: "Innovation evidence is insufficient for continued investment.",
      decidedAt: new Date(),
    };
  }

  return {
    opportunityId: opportunity.id,
    experimentId: experiment?.id,
    decision: "hold",
    confidence,
    reason: "Innovation should remain under observation until stronger evidence is available.",
    decidedAt: new Date(),
  };
}

export function applyAIInnovationAdoptionDecision(
  opportunity: AIInnovationOpportunity,
  decision: AIInnovationAdoptionDecision,
): AIInnovationOpportunity {
  const status =
    decision.decision === "adopt"
      ? "adopted"
      : decision.decision === "reject"
        ? "rejected"
        : opportunity.status;

  return {
    ...opportunity,
    status,
    audit: {
      ...opportunity.audit,
      updatedAt: new Date(),
    },
  };
}