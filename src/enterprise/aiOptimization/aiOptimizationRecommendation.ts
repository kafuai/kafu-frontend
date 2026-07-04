import {
  AIOptimizationEffortLevel,
  AIOptimizationExpectedImpact,
  AIOptimizationImpactLevel,
  AIOptimizationRiskLevel,
  AIOptimizationStatus,
  AIOptimizationTargetType,
  AIOptimizationTrace,
} from "./aiOptimizationTypes";

export type AIOptimizationRecommendationAction =
  | "rewrite_prompt"
  | "switch_model"
  | "adjust_temperature"
  | "compress_context"
  | "expand_context"
  | "enable_cache"
  | "disable_expensive_tool"
  | "enable_specialized_tool"
  | "improve_routing"
  | "reduce_retrieval_depth"
  | "increase_retrieval_precision"
  | "batch_requests"
  | "split_workflow"
  | "add_guardrail"
  | "add_evaluation_gate";

export interface AIOptimizationRecommendation {
  id: string;
  organizationId: string;
  targetId: string;
  targetType: AIOptimizationTargetType;
  action: AIOptimizationRecommendationAction;
  title: string;
  description: string;
  expectedImpact: AIOptimizationExpectedImpact;
  impactLevel: AIOptimizationImpactLevel;
  effortLevel: AIOptimizationEffortLevel;
  riskLevel: AIOptimizationRiskLevel;
  confidence: number;
  status: AIOptimizationStatus;
  trace: AIOptimizationTrace;
  createdAt: Date;
}

export interface CreateAIOptimizationRecommendationInput {
  id: string;
  organizationId: string;
  targetId: string;
  targetType: AIOptimizationTargetType;
  action: AIOptimizationRecommendationAction;
  title: string;
  description: string;
  expectedImpact: AIOptimizationExpectedImpact;
  impactLevel: AIOptimizationImpactLevel;
  effortLevel: AIOptimizationEffortLevel;
  riskLevel: AIOptimizationRiskLevel;
  confidence: number;
  trace: AIOptimizationTrace;
}

export function createAIOptimizationRecommendation(
  input: CreateAIOptimizationRecommendationInput,
): AIOptimizationRecommendation {
  return {
    ...input,
    status: "recommended",
    createdAt: new Date(),
  };
}

export function calculateRecommendationScore(
  recommendation: AIOptimizationRecommendation,
): number {
  const impactWeight: Record<AIOptimizationImpactLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
    transformational: 4,
  };

  const effortPenalty: Record<AIOptimizationEffortLevel, number> = {
    low: 1,
    medium: 0.75,
    high: 0.5,
  };

  const riskPenalty: Record<AIOptimizationRiskLevel, number> = {
    low: 1,
    medium: 0.8,
    high: 0.55,
    critical: 0.25,
  };

  return (
    impactWeight[recommendation.impactLevel] *
    effortPenalty[recommendation.effortLevel] *
    riskPenalty[recommendation.riskLevel] *
    recommendation.confidence
  );
}