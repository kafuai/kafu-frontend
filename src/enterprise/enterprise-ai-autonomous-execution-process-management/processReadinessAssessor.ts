import { EnterpriseAIProcessStatus } from "./process.enums";
import { EnterpriseAIProcess } from "./process.types";

export type EnterpriseAIProcessReadinessAssessment = {
  processId: string;
  ready: boolean;
  blockers: string[];
};

export class EnterpriseAIProcessReadinessAssessor {
  assess(process: EnterpriseAIProcess): EnterpriseAIProcessReadinessAssessment {
    const blockers: string[] = [];

    if (!process.workflowIds.length) {
      blockers.push("Process must include at least one workflow.");
    }

    if (!process.owner.ownerId || !process.owner.ownerName) {
      blockers.push("Process owner is required.");
    }

    if (
      process.governance.approvalRequired &&
      process.status === EnterpriseAIProcessStatus.DRAFT
    ) {
      blockers.push("Approval is required before execution.");
    }

    const missingRequiredDependencies = process.dependencies.filter(
      (dependency) => dependency.required && !dependency.processId,
    );

    if (missingRequiredDependencies.length > 0) {
      blockers.push("Required process dependencies are missing.");
    }

    return {
      processId: process.id,
      ready: blockers.length === 0,
      blockers,
    };
  }
}