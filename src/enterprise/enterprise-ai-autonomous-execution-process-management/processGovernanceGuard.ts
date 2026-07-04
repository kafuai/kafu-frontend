import { EnterpriseAIProcess } from "./process.types";

export type EnterpriseAIProcessGovernanceDecision = {
  processId: string;
  allowed: boolean;
  requiredControls: string[];
  reasons: string[];
};

export class EnterpriseAIProcessGovernanceGuard {
  evaluate(process: EnterpriseAIProcess): EnterpriseAIProcessGovernanceDecision {
    const requiredControls: string[] = [];
    const reasons: string[] = [];

    if (process.governance.approvalRequired) {
      requiredControls.push("approval");
      reasons.push("Process requires approval before execution.");
    }

    if (process.governance.auditRequired) {
      requiredControls.push("audit");
      reasons.push("Process requires audit trail coverage.");
    }

    if (process.governance.complianceRequired) {
      requiredControls.push("compliance");
      reasons.push("Process requires compliance validation.");
    }

    return {
      processId: process.id,
      allowed: requiredControls.length === 0,
      requiredControls,
      reasons,
    };
  }
}