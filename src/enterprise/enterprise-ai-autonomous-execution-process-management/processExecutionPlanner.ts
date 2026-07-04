import { EnterpriseAIProcessPriority } from "./process.enums";
import { EnterpriseAIProcess } from "./process.types";

export type EnterpriseAIProcessExecutionPlan = {
  processId: string;
  workflowExecutionOrder: string[];
  priorityWeight: number;
  requiresGovernanceGate: boolean;
  dependencyCount: number;
};

export class EnterpriseAIProcessExecutionPlanner {
  createPlan(process: EnterpriseAIProcess): EnterpriseAIProcessExecutionPlan {
    return {
      processId: process.id,
      workflowExecutionOrder: [...process.workflowIds],
      priorityWeight: this.resolvePriorityWeight(process.priority),
      requiresGovernanceGate:
        process.governance.approvalRequired ||
        process.governance.auditRequired ||
        process.governance.complianceRequired,
      dependencyCount: process.dependencies.length,
    };
  }

  private resolvePriorityWeight(priority: EnterpriseAIProcessPriority): number {
    switch (priority) {
      case EnterpriseAIProcessPriority.CRITICAL:
        return 100;
      case EnterpriseAIProcessPriority.HIGH:
        return 75;
      case EnterpriseAIProcessPriority.MEDIUM:
        return 50;
      case EnterpriseAIProcessPriority.LOW:
        return 25;
      default:
        return 0;
    }
  }
}