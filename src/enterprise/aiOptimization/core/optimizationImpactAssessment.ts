import {
  AIOptimizationExpectedImpact,
  AIOptimizationImpactLevel,
  AIOptimizationRiskLevel,
} from "../aiOptimizationTypes";
import { OptimizationOpportunity } from "./optimizationOpportunity";

export interface OptimizationImpactAssessment {
  opportunityId: string;
  impactScore: number;
  impactLevel: AIOptimizationImpactLevel;
  riskLevel: AIOptimizationRiskLevel;
  summary: string;
  assessedAt: Date;
}

export function assessOptimizationOpportunityImpact(
  opportunity: OptimizationOpportunity,
): OptimizationImpactAssessment {
  const impactScore = calculateImpactScore(opportunity.expectedImpact);
  const impactLevel = resolveImpactLevel(impactScore);

  return {
    opportunityId: opportunity.id,
    impactScore,
    impactLevel,
    riskLevel: opportunity.riskLevel,
    summary: buildImpactSummary(impactLevel, opportunity.riskLevel),
    assessedAt: new Date(),
  };
}

function calculateImpactScore(impact: AIOptimizationExpectedImpact): number {
  const values = Object.values(impact).filter(
    (value): value is number => typeof value === "number",
  );

  if (values.length === 0) {
    return 0;
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.max(0, Math.min(Math.round(average), 100));
}

function resolveImpactLevel(score: number): AIOptimizationImpactLevel {
  if (score >= 75) return "transformational";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function buildImpactSummary(
  impactLevel: AIOptimizationImpactLevel,
  riskLevel: AIOptimizationRiskLevel,
): string {
  return `Optimization opportunity has ${impactLevel} expected impact with ${riskLevel} risk.`;
}