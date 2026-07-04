import {
  AIOrchestrationStep,
  AIOrchestrationWorkflow,
} from "./aiOrchestrationTypes";

export interface AIOrchestrationPlanItem {
  step: AIOrchestrationStep;
  order: number;
  dependencyIds: string[];
  parallelGroup: number;
}

export interface AIOrchestrationPlan {
  workflowId: string;
  organizationId: string;
  items: AIOrchestrationPlanItem[];
  totalSteps: number;
  parallelGroups: number;
}

export function createAIOrchestrationPlan(
  workflow: AIOrchestrationWorkflow,
): AIOrchestrationPlan {
  const remaining = [...workflow.steps];
  const planned: AIOrchestrationPlanItem[] = [];
  const completed = new Set<string>();
  let order = 0;
  let parallelGroup = 0;

  while (remaining.length > 0) {
    const readySteps = remaining.filter((step) =>
      step.dependencies.every((dependency) => completed.has(dependency.stepId)),
    );

    if (readySteps.length === 0) {
      throw new Error(
        `Unable to create orchestration plan for workflow '${workflow.id}'. Dependency cycle detected.`,
      );
    }

    for (const step of readySteps) {
      planned.push({
        step,
        order,
        dependencyIds: step.dependencies.map((dependency) => dependency.stepId),
        parallelGroup,
      });

      completed.add(step.id);
      order += 1;
    }

    for (const readyStep of readySteps) {
      const index = remaining.findIndex((step) => step.id === readyStep.id);

      if (index >= 0) {
        remaining.splice(index, 1);
      }
    }

    parallelGroup += 1;
  }

  return {
    workflowId: workflow.id,
    organizationId: workflow.organizationId,
    items: planned,
    totalSteps: planned.length,
    parallelGroups: parallelGroup,
  };
}