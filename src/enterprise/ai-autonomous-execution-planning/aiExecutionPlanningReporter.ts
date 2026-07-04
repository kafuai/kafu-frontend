import { AIExecutionPlanningResult } from "./aiExecutionPlanningResult";

export interface AIExecutionPlanningReport {
  planId: string;
  objective: string;
  readinessScore: number;
  ready: boolean;
  stepCount: number;
  warningCount: number;
}

export function createAIExecutionPlanningReport(
  result: AIExecutionPlanningResult,
): AIExecutionPlanningReport {
  return {
    planId: result.plan.id,
    objective: result.plan.objective.title,
    readinessScore: result.readiness.score,
    ready: result.readiness.ready,
    stepCount: result.plan.steps.length,
    warningCount: result.warnings.length,
  };
}