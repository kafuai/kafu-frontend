import { AIExecutionOptimizationRecommendation } from "./aiExecutionOptimizationRecommendation";
import { AIExecutionOptimizationPriority } from "./aiAutonomousExecutionOptimizationTypes";

export interface AIExecutionOptimizationPlanItem {
  id: string;
  opportunityId: string;
  priority: AIExecutionOptimizationPriority;
  actions: string[];
  expectedBenefits: string[];
  sequence: number;
}

export interface AIExecutionOptimizationPlan {
  id: string;
  createdAt: Date;
  createdBy: string;
  items: AIExecutionOptimizationPlanItem[];
}

export interface AIExecutionOptimizationPlanInput {
  id: string;
  createdBy: string;
  recommendations: AIExecutionOptimizationRecommendation[];
}

export function createAIExecutionOptimizationPlan(
  input: AIExecutionOptimizationPlanInput,
): AIExecutionOptimizationPlan {
  if (!input.id.trim()) {
    throw new Error("Execution optimization plan id is required");
  }

  return {
    id: input.id,
    createdAt: new Date(),
    createdBy: input.createdBy,
    items: input.recommendations.map((recommendation, index) => ({
      id: `${input.id}-item-${index + 1}`,
      opportunityId: recommendation.opportunityId,
      priority: inferPlanItemPriority(recommendation.score.overall),
      actions: recommendation.actions,
      expectedBenefits: recommendation.expectedBenefits,
      sequence: index + 1,
    })),
  };
}

function inferPlanItemPriority(score: number): AIExecutionOptimizationPriority {
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