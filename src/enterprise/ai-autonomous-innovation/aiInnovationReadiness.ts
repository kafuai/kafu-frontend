import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export interface AIInnovationReadinessAssessment {
  opportunityId: string;
  readinessScore: number;
  ready: boolean;
  missingCapabilities: string[];
  evaluatedAt: Date;
}

export function assessAIInnovationReadiness(
  opportunity: AIInnovationOpportunity,
): AIInnovationReadinessAssessment {
  const score = scoreAIInnovationOpportunity(opportunity).totalScore;

  const missingCapabilities: string[] = [];

  if (opportunity.feasibility.dataReadiness < 0.6) {
    missingCapabilities.push("Data readiness");
  }

  if (opportunity.feasibility.technicalFeasibility < 0.6) {
    missingCapabilities.push("Technical feasibility");
  }

  if (opportunity.feasibility.organizationalReadiness < 0.6) {
    missingCapabilities.push("Organizational readiness");
  }

  const readinessScore =
    score * 0.7 +
    opportunity.feasibility.organizationalReadiness * 0.15 +
    opportunity.feasibility.dataReadiness * 0.15;

  return {
    opportunityId: opportunity.id,
    readinessScore,
    ready: readinessScore >= 0.65 && missingCapabilities.length === 0,
    missingCapabilities,
    evaluatedAt: new Date(),
  };
}