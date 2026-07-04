import {
  WorkflowManagementDecision,
  WorkflowManagementRecord,
  WorkflowStepDefinition,
} from "./workflow-management.types";
import {
  calculateWorkflowReadiness,
  isWorkflowStepExecutable,
  recommendWorkflowStatus,
} from "./workflow-management.utils";

export interface WorkflowExecutionPlan {
  readonly workflowId: string;
  readonly executableSteps: readonly WorkflowStepDefinition[];
  readonly blockedSteps: readonly WorkflowStepDefinition[];
  readonly decision: WorkflowManagementDecision;
}

export class WorkflowManagementEngine {
  createExecutionPlan(workflow: WorkflowManagementRecord): WorkflowExecutionPlan {
    const executableSteps = workflow.steps.filter((step) =>
      isWorkflowStepExecutable(step, workflow.steps),
    );

    const blockedSteps = workflow.steps.filter((step) => step.status === "blocked");

    return {
      workflowId: workflow.id,
      executableSteps,
      blockedSteps,
      decision: recommendWorkflowStatus(workflow),
    };
  }

  evaluate(workflow: WorkflowManagementRecord): WorkflowManagementDecision {
    return recommendWorkflowStatus(workflow);
  }

  calculateReadiness(workflow: WorkflowManagementRecord) {
    return calculateWorkflowReadiness(workflow);
  }
}