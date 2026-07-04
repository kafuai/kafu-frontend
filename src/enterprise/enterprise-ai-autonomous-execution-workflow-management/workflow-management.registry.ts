import {
  WorkflowManagementRecord,
  WorkflowManagementStatus,
} from "./workflow-management.types";

export interface WorkflowManagementRegistryFilter {
  readonly tenantId?: string;
  readonly ownerId?: string;
  readonly status?: WorkflowManagementStatus;
}

export class WorkflowManagementRegistry {
  private readonly workflows = new Map<string, WorkflowManagementRecord>();

  register(workflow: WorkflowManagementRecord): WorkflowManagementRecord {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  get(workflowId: string): WorkflowManagementRecord | undefined {
    return this.workflows.get(workflowId);
  }

  list(filter: WorkflowManagementRegistryFilter = {}): readonly WorkflowManagementRecord[] {
    return Array.from(this.workflows.values()).filter((workflow) => {
      if (filter.tenantId && workflow.tenantId !== filter.tenantId) {
        return false;
      }

      if (filter.ownerId && workflow.ownerId !== filter.ownerId) {
        return false;
      }

      if (filter.status && workflow.status !== filter.status) {
        return false;
      }

      return true;
    });
  }

  updateStatus(
    workflowId: string,
    status: WorkflowManagementStatus,
    updatedAt: string,
  ): WorkflowManagementRecord {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const updatedWorkflow: WorkflowManagementRecord = {
      ...workflow,
      status,
      updatedAt,
    };

    this.workflows.set(workflowId, updatedWorkflow);
    return updatedWorkflow;
  }

  remove(workflowId: string): boolean {
    return this.workflows.delete(workflowId);
  }

  clear(): void {
    this.workflows.clear();
  }
}