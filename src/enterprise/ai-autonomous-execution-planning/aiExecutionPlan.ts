import {
  AIExecutionPlanningAuditMetadata,
  AIExecutionPlanningStatus,
} from "./aiAutonomousExecutionPlanningTypes";
import { AIExecutionDependency } from "./aiExecutionDependency";
import { AIExecutionObjective } from "./aiExecutionObjective";
import { AIExecutionStep } from "./aiExecutionStep";

export interface AIExecutionPlan {
  id: string;
  objective: AIExecutionObjective;
  steps: AIExecutionStep[];
  dependencies: AIExecutionDependency[];
  status: AIExecutionPlanningStatus;
  totalEstimatedEffort: number;
  audit: AIExecutionPlanningAuditMetadata;
}

export function createAIExecutionPlan(input: {
  id: string;
  objective: AIExecutionObjective;
  steps: AIExecutionStep[];
  dependencies?: AIExecutionDependency[];
  audit: AIExecutionPlanningAuditMetadata;
}): AIExecutionPlan {
  return {
    id: input.id,
    objective: input.objective,
    steps: input.steps,
    dependencies: input.dependencies ?? [],
    status: "draft",
    totalEstimatedEffort: input.steps.reduce(
      (total, step) => total + step.estimatedEffort,
      0,
    ),
    audit: input.audit,
  };
}

export function markAIExecutionPlanReady(
  plan: AIExecutionPlan,
): AIExecutionPlan {
  return {
    ...plan,
    status: "ready",
    objective: {
      ...plan.objective,
      status: "ready",
    },
    steps: plan.steps.map((step) => ({
      ...step,
      status: "ready",
    })),
    audit: {
      ...plan.audit,
      updatedAt: new Date(),
    },
  };
}