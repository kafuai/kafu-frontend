import { WorkflowManagementService } from "./workflow-management.service";

export function createWorkflowManagementService(): WorkflowManagementService {
  return new WorkflowManagementService();
}