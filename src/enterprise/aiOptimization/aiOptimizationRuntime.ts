import { AIOptimizationObjective } from "./aiOptimizationObjective";
import { runAIOptimizationPipeline } from "./aiOptimizationPipeline";
import { AIOptimizationTarget } from "./aiOptimizationTarget";

export interface AIOptimizationRuntimeInput {
  organizationId: string;
  targets: AIOptimizationTarget[];
  objectives: AIOptimizationObjective[];
  actorId: string;
  mode?: "dry_run" | "execute";
}

export interface AIOptimizationRuntimeResult {
  organizationId: string;
  planId: string;
  recommendationCount: number;
  messages: string[];
  mode: "dry_run" | "execute";
  completedAt: Date;
}

export function runAIOptimizationRuntime(
  input: AIOptimizationRuntimeInput,
): AIOptimizationRuntimeResult {
  const result = runAIOptimizationPipeline({
    organizationId: input.organizationId,
    targets: input.targets,
    objectives: input.objectives,
    actorId: input.actorId,
    dryRun: input.mode !== "execute",
  });

  return {
    organizationId: input.organizationId,
    planId: result.plan.id,
    recommendationCount: result.recommendationCount,
    messages: result.executionMessages,
    mode: input.mode ?? "dry_run",
    completedAt: new Date(),
  };
}