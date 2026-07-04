import {
  WorkflowManagementRecord,
  WorkflowManagementStatus,
} from "./workflow-management.types";
import { calculateWorkflowReadiness } from "./workflow-management.utils";

export interface WorkflowManagementPolicyResult {
  readonly workflowId: string;
  readonly allowed: boolean;
  readonly targetStatus: WorkflowManagementStatus;
  readonly reasons: readonly string[];
}

const allowedTransitions: Readonly<Record<WorkflowManagementStatus, readonly WorkflowManagementStatus[]>> = {
  draft: ["active", "cancelled"],
  active: ["paused", "blocked", "completed", "cancelled"],
  paused: ["active", "cancelled"],
  blocked: ["active", "cancelled"],
  completed: [],
  cancelled: [],
};

export class WorkflowManagementPolicy {
  canTransition(
    workflow: WorkflowManagementRecord,
    targetStatus: WorkflowManagementStatus,
  ): WorkflowManagementPolicyResult {
    const reasons: string[] = [];
    const allowedTargets = allowedTransitions[workflow.status];

    if (!allowedTargets.includes(targetStatus)) {
      reasons.push(
        `Transition from ${workflow.status} to ${targetStatus} is not allowed.`,
      );
    }

    const readiness = calculateWorkflowReadiness(workflow);

    if (targetStatus === "completed" && readiness.completedSteps !== readiness.totalSteps) {
      reasons.push("Workflow cannot be completed until all steps are completed.");
    }

    if (targetStatus === "active" && workflow.steps.length === 0) {
      reasons.push("Workflow cannot be activated without steps.");
    }

    return {
      workflowId: workflow.id,
      allowed: reasons.length === 0,
      targetStatus,
      reasons,
    };
  }
}