import {
  AIInnovationFeasibilityEstimate,
  AIInnovationImpactEstimate,
  AIInnovationRiskLevel,
  AIInnovationScoreBreakdown,
} from "./aiAutonomousInnovationTypes";
import { AIInnovationOpportunity } from "./aiInnovationOpportunity";

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function normalize(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function riskPenalty(riskLevel: AIInnovationRiskLevel): number {
  switch (riskLevel) {
    case "low":
      return 0.05;
    case "medium":
      return 0.15;
    case "high":
      return 0.3;
    case "critical":
      return 0.45;
    default:
      return 0.2;
  }
}

export function calculateAIInnovationImpactScore(
  impact: AIInnovationImpactEstimate,
): number {
  return normalize(
    average([
      impact.revenuePotential,
      impact.costReductionPotential,
      impact.customerValue,
      impact.operationalEfficiency,
      impact.strategicAlignment,
    ]),
  );
}

export function calculateAIInnovationFeasibilityScore(
  feasibility: AIInnovationFeasibilityEstimate,
): number {
  const positiveReadiness = average([
    feasibility.technicalFeasibility,
    feasibility.dataReadiness,
    feasibility.organizationalReadiness,
  ]);

  const effortPenalty = average([
    feasibility.implementationEffort,
    feasibility.dependencyComplexity,
  ]);

  return normalize(positiveReadiness * 0.75 + (1 - effortPenalty) * 0.25);
}

export function scoreAIInnovationOpportunity(
  opportunity: AIInnovationOpportunity,
): AIInnovationScoreBreakdown {
  const impactScore = calculateAIInnovationImpactScore(opportunity.impact);
  const feasibilityScore = calculateAIInnovationFeasibilityScore(opportunity.feasibility);
  const confidenceScore = normalize(
    opportunity.signalIds.length > 0 ? 0.65 + opportunity.signalIds.length * 0.05 : 0.5,
  );

  const baseScore = impactScore * 0.45 + feasibilityScore * 0.35 + confidenceScore * 0.2;
  const riskAdjustedScore = normalize(baseScore - riskPenalty(opportunity.riskLevel));
  const totalScore = normalize(riskAdjustedScore);

  return {
    impactScore,
    feasibilityScore,
    riskAdjustedScore,
    confidenceScore,
    totalScore,
  };
}

export function isAIInnovationOpportunityWorthExperimenting(
  opportunity: AIInnovationOpportunity,
): boolean {
  const score = scoreAIInnovationOpportunity(opportunity);

  return score.totalScore >= 0.55 && score.impactScore >= 0.5;
}