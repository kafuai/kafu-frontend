import { AIInnovationPriority } from "./aiAutonomousInnovationTypes";
import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export interface AIInnovationPrioritizationDecision {
  opportunityId: string;
  priority: AIInnovationPriority;
  score: number;
  reason: string;
}

export function determineAIInnovationPriority(
  opportunity: AIInnovationOpportunity,
): AIInnovationPriority {
  const score = scoreAIInnovationOpportunity(opportunity).totalScore;

  if (score >= 0.85) {
    return "critical";
  }

  if (score >= 0.7) {
    return "high";
  }

  if (score >= 0.45) {
    return "medium";
  }

  return "low";
}

export function prioritizeAIInnovationOpportunity(
  opportunity: AIInnovationOpportunity,
): AIInnovationPrioritizationDecision {
  const score = scoreAIInnovationOpportunity(opportunity).totalScore;
  const priority = determineAIInnovationPriority(opportunity);

  return {
    opportunityId: opportunity.id,
    priority,
    score,
    reason: `Innovation opportunity prioritized as ${priority} with score ${score.toFixed(2)}.`,
  };
}

export function applyAIInnovationPriority(
  opportunity: AIInnovationOpportunity,
): AIInnovationOpportunity {
  return {
    ...opportunity,
    priority: determineAIInnovationPriority(opportunity),
    audit: {
      ...opportunity.audit,
      updatedAt: new Date(),
    },
  };
}

export function prioritizeAIInnovationOpportunities(
  opportunities: AIInnovationOpportunity[],
): AIInnovationOpportunity[] {
  return opportunities
    .map(applyAIInnovationPriority)
    .sort(
      (a, b) =>
        scoreAIInnovationOpportunity(b).totalScore -
        scoreAIInnovationOpportunity(a).totalScore,
    );
}