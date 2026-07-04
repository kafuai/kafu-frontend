import { AIOptimizationRecommendation } from "./aiOptimizationRecommendation";
import {
  AIOptimizationExpectedImpact,
  AIOptimizationPriority,
  AIOptimizationRiskLevel,
  AIOptimizationStatus,
} from "./aiOptimizationTypes";

export interface AIOptimizationPlanStep {
  id: string;
  recommendationId: string;
  title: string;
  description: string;
  order: number;
  rollbackRequired: boolean;
  validationRequired: boolean;
}

export interface AIOptimizationPlan {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  priority: AIOptimizationPriority;
  status: AIOptimizationStatus;
  recommendations: AIOptimizationRecommendation[];
  steps: AIOptimizationPlanStep[];
  expectedImpact: AIOptimizationExpectedImpact;
  riskLevel: AIOptimizationRiskLevel;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIOptimizationPlanInput {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  priority: AIOptimizationPriority;
  recommendations: AIOptimizationRecommendation[];
  createdBy: string;
}

export function createAIOptimizationPlan(
  input: CreateAIOptimizationPlanInput,
): AIOptimizationPlan {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "draft",
    recommendations: input.recommendations,
    steps: input.recommendations.map((recommendation, index) => ({
      id: `${input.id}-step-${index + 1}`,
      recommendationId: recommendation.id,
      title: recommendation.title,
      description: recommendation.description,
      order: index + 1,
      rollbackRequired:
        recommendation.riskLevel === "high" || recommendation.riskLevel === "critical",
      validationRequired: true,
    })),
    expectedImpact: mergeExpectedImpact(input.recommendations),
    riskLevel: resolvePlanRiskLevel(input.recommendations),
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  };
}

function mergeExpectedImpact(
  recommendations: AIOptimizationRecommendation[],
): AIOptimizationExpectedImpact {
  return recommendations.reduce<AIOptimizationExpectedImpact>((impact, recommendation) => {
    return {
      costReductionPercent:
        (impact.costReductionPercent ?? 0) +
        (recommendation.expectedImpact.costReductionPercent ?? 0),
      latencyReductionPercent:
        (impact.latencyReductionPercent ?? 0) +
        (recommendation.expectedImpact.latencyReductionPercent ?? 0),
      tokenReductionPercent:
        (impact.tokenReductionPercent ?? 0) +
        (recommendation.expectedImpact.tokenReductionPercent ?? 0),
      accuracyIncreasePercent:
        (impact.accuracyIncreasePercent ?? 0) +
        (recommendation.expectedImpact.accuracyIncreasePercent ?? 0),
      qualityIncreasePercent:
        (impact.qualityIncreasePercent ?? 0) +
        (recommendation.expectedImpact.qualityIncreasePercent ?? 0),
      safetyIncreasePercent:
        (impact.safetyIncreasePercent ?? 0) +
        (recommendation.expectedImpact.safetyIncreasePercent ?? 0),
      reliabilityIncreasePercent:
        (impact.reliabilityIncreasePercent ?? 0) +
        (recommendation.expectedImpact.reliabilityIncreasePercent ?? 0),
      hallucinationReductionPercent:
        (impact.hallucinationReductionPercent ?? 0) +
        (recommendation.expectedImpact.hallucinationReductionPercent ?? 0),
      roiIncreasePercent:
        (impact.roiIncreasePercent ?? 0) +
        (recommendation.expectedImpact.roiIncreasePercent ?? 0),
    };
  }, {});
}

function resolvePlanRiskLevel(
  recommendations: AIOptimizationRecommendation[],
): AIOptimizationRiskLevel {
  if (recommendations.some((item) => item.riskLevel === "critical")) return "critical";
  if (recommendations.some((item) => item.riskLevel === "high")) return "high";
  if (recommendations.some((item) => item.riskLevel === "medium")) return "medium";
  return "low";
}