import { AIExecutionPlan } from "./aiExecutionPlan";
import { AIExecutionReadiness } from "./aiExecutionReadiness";

export interface AIExecutionPlanningResult {
  plan: AIExecutionPlan;
  readiness: AIExecutionReadiness;
  warnings: string[];
  generatedAt: Date;
}

export function createAIExecutionPlanningResult(input: {
  plan: AIExecutionPlan;
  readiness: AIExecutionReadiness;
  warnings?: string[];
}): AIExecutionPlanningResult {
  return {
    plan: input.plan,
    readiness: input.readiness,
    warnings: input.warnings ?? [],
    generatedAt: new Date(),
  };
}