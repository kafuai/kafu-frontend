import { WorkflowManagementEngine } from "./workflow-management.engine";
import { WorkflowManagementOrchestrator } from "./workflow-management.orchestrator";
import { WorkflowManagementPolicy } from "./workflow-management.policy";
import { WorkflowManagementRegistry } from "./workflow-management.registry";
import {
  WorkflowManagementDecision,
  WorkflowManagementRecord,
  WorkflowManagementStatus,
} from "./workflow-management.types";

export class WorkflowManagementService {
  private readonly registry = new WorkflowManagementRegistry();
  private readonly engine = new WorkflowManagementEngine();
  private readonly policy = new WorkflowManagementPolicy();
  private readonly orchestrator = new WorkflowManagementOrchestrator(
    this.registry,
    this.engine,
  );

  createWorkflow(workflow: WorkflowManagementRecord) {
    return this.orchestrator.registerAndEvaluate(workflow);
  }

  inspectWorkflow(workflowId: string) {
    return this.orchestrator.inspect(workflowId);
  }

  listWorkflows() {
    return this.registry.list();
  }

  evaluateWorkflow(workflowId: string): WorkflowManagementDecision {
    const workflow = this.registry.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    return this.engine.evaluate(workflow);
  }

  transitionWorkflow(
    workflowId: string,
    targetStatus: WorkflowManagementStatus,
    updatedAt: string,
  ) {
    const workflow = this.registry.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const policyResult = this.policy.canTransition(workflow, targetStatus);

    if (!policyResult.allowed) {
      throw new Error(policyResult.reasons.join(" "));
    }

    return this.orchestrator.transitionWorkflow(workflowId, targetStatus, updatedAt);
  }
}