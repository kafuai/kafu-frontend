import { AIOptimizationObjective } from "./aiOptimizationObjective";
import { executeAIOptimizationPlan } from "./aiOptimizationExecutor";
import { AIOptimizationPlan } from "./aiOptimizationPlan";
import { buildAIOptimizationPlan } from "./aiOptimizationPlanner";
import { generateAIOptimizationRecommendations } from "./aiOptimizationRecommendationEngine";
import { AIOptimizationTarget } from "./aiOptimizationTarget";

export interface RunAIOptimizationPipelineInput {
  organizationId: string;
  targets: AIOptimizationTarget[];
  objectives: AIOptimizationObjective[];
  actorId: string;
  dryRun?: boolean;
}

export interface RunAIOptimizationPipelineResult {
  plan: AIOptimizationPlan;
  executionMessages: string[];
  recommendationCount: number;
  dryRun: boolean;
  createdAt: Date;
}

export function runAIOptimizationPipeline(
  input: RunAIOptimizationPipelineInput,
): RunAIOptimizationPipelineResult {
  const recommendations = generateAIOptimizationRecommendations({
    organizationId: input.organizationId,
    targets: input.targets,
    objectives: input.objectives,
    generatedBy: input.actorId,
  });

  const plan = buildAIOptimizationPlan({
    id: `${input.organizationId}-ai-optimization-plan-${Date.now()}`,
    organizationId: input.organizationId,
    title: "Enterprise AI Optimization Plan",
    description:
      "Automatically generated optimization plan based on AI evaluation, metrics, and target performance.",
    recommendations,
    createdBy: input.actorId,
  });

  const execution = executeAIOptimizationPlan({
    executionId: `${plan.id}-execution`,
    plan,
    executedBy: input.actorId,
    dryRun: input.dryRun ?? true,
  });

  return {
    plan,
    executionMessages: execution.messages,
    recommendationCount: recommendations.length,
    dryRun: execution.dryRun,
    createdAt: new Date(),
  };
}