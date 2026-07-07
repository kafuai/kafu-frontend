import {
  AIOptimizationExpectedImpact,
  AIOptimizationObjectiveType,
  AIOptimizationPriority,
  AIOptimizationRiskLevel,
  AIOptimizationTargetType,
} from "../aiOptimizationTypes";

export type OptimizationOpportunityStatus =
  | "identified"
  | "qualified"
  | "rejected"
  | "converted";

export interface OptimizationOpportunity {
  id: string;
  organizationId: string;
  targetId: string;
  targetType: AIOptimizationTargetType;
  objectiveType: AIOptimizationObjectiveType;
  title: string;
  description: string;
  priority: AIOptimizationPriority;
  riskLevel: AIOptimizationRiskLevel;
  expectedImpact: AIOptimizationExpectedImpact;
  confidence: number;
  status: OptimizationOpportunityStatus;
  discoveredAt: Date;
}

export function createOptimizationOpportunity(
  opportunity: OptimizationOpportunity,
): OptimizationOpportunity {
  return {
    ...opportunity,
    confidence: normalizeConfidence(opportunity.confidence),
  };
}

function normalizeConfidence(value: number): number {
  return Math.max(0, Math.min(value, 1));
}