import { WorkflowManagementEngine, WorkflowExecutionPlan } from "./workflow-management.engine";
import { WorkflowManagementRegistry } from "./workflow-management.registry";
import {
  WorkflowManagementDecision,
  WorkflowManagementRecord,
  WorkflowManagementStatus,
} from "./workflow-management.types";

export interface WorkflowManagementOrchestrationResult {
  readonly workflow: WorkflowManagementRecord;
  readonly plan: WorkflowExecutionPlan;
  readonly decision: WorkflowManagementDecision;
}

export class WorkflowManagementOrchestrator {
  constructor(
    private readonly registry: WorkflowManagementRegistry,
    private readonly engine: WorkflowManagementEngine,
  ) {}

  registerAndEvaluate(
    workflow: WorkflowManagementRecord,
  ): WorkflowManagementOrchestrationResult {
    const registeredWorkflow = this.registry.register(workflow);
    const plan = this.engine.createExecutionPlan(registeredWorkflow);

    return {
      workflow: registeredWorkflow,
      plan,
      decision: plan.decision,
    };
  }

  transitionWorkflow(
    workflowId: string,
    status: WorkflowManagementStatus,
    updatedAt: string,
  ): WorkflowManagementOrchestrationResult {
    const updatedWorkflow = this.registry.updateStatus(workflowId, status, updatedAt);
    const plan = this.engine.createExecutionPlan(updatedWorkflow);

    return {
      workflow: updatedWorkflow,
      plan,
      decision: plan.decision,
    };
  }

  inspect(workflowId: string): WorkflowManagementOrchestrationResult {
    const workflow = this.registry.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const plan = this.engine.createExecutionPlan(workflow);

    return {
      workflow,
      plan,
      decision: plan.decision,
    };
  }
}