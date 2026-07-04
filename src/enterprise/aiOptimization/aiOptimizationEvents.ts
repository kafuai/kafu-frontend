import { AIOptimizationExecution } from "./aiOptimizationExecution";
import { AIOptimizationPlan } from "./aiOptimizationPlan";
import { AIOptimizationRecommendation } from "./aiOptimizationRecommendation";

export type AIOptimizationEventType =
  | "recommendation_created"
  | "plan_created"
  | "execution_started"
  | "execution_completed"
  | "optimization_validated"
  | "optimization_failed"
  | "optimization_rolled_back";

export interface AIOptimizationEvent {
  id: string;
  organizationId: string;
  type: AIOptimizationEventType;
  entityId: string;
  message: string;
  metadata: Record<string, string | number | boolean>;
  createdAt: Date;
}

export function createAIOptimizationRecommendationEvent(
  id: string,
  recommendation: AIOptimizationRecommendation,
): AIOptimizationEvent {
  return {
    id,
    organizationId: recommendation.organizationId,
    type: "recommendation_created",
    entityId: recommendation.id,
    message: `AI optimization recommendation created: ${recommendation.title}`,
    metadata: {
      targetId: recommendation.targetId,
      action: recommendation.action,
      confidence: recommendation.confidence,
      riskLevel: recommendation.riskLevel,
      impactLevel: recommendation.impactLevel,
    },
    createdAt: new Date(),
  };
}

export function createAIOptimizationPlanEvent(
  id: string,
  plan: AIOptimizationPlan,
): AIOptimizationEvent {
  return {
    id,
    organizationId: plan.organizationId,
    type: "plan_created",
    entityId: plan.id,
    message: `AI optimization plan created: ${plan.title}`,
    metadata: {
      priority: plan.priority,
      riskLevel: plan.riskLevel,
      recommendationCount: plan.recommendations.length,
      stepCount: plan.steps.length,
    },
    createdAt: new Date(),
  };
}

export function createAIOptimizationExecutionEvent(
  id: string,
  execution: AIOptimizationExecution,
): AIOptimizationEvent {
  return {
    id,
    organizationId: execution.organizationId,
    type:
      execution.status === "validated"
        ? "execution_completed"
        : execution.status === "failed"
          ? "optimization_failed"
          : "execution_started",
    entityId: execution.id,
    message: `AI optimization execution status: ${execution.status}`,
    metadata: {
      planId: execution.planId,
      status: execution.status,
      stepCount: execution.stepResults.length,
    },
    createdAt: new Date(),
  };
}