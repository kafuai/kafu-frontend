import { EnterpriseRuleEvaluationResult } from "./rule-types";

export interface EnterpriseRuleEnforcementDecision {
  allowed: boolean;
  warnings: string[];
  approvalsRequired: boolean;
  escalated: boolean;
  tags: string[];
  logs: string[];
}

export class EnterpriseRuleEnforcement {
  enforce(
    results: EnterpriseRuleEvaluationResult[],
  ): EnterpriseRuleEnforcementDecision {
    const decision: EnterpriseRuleEnforcementDecision = {
      allowed: true,
      warnings: [],
      approvalsRequired: false,
      escalated: false,
      tags: [],
      logs: [],
    };

    for (const result of results) {
      if (!result.matched) {
        continue;
      }

      for (const action of result.actions) {
        switch (action) {
          case "deny":
            decision.allowed = false;
            break;

          case "warn":
            decision.warnings.push(result.reason);
            break;

          case "require_approval":
            decision.approvalsRequired = true;
            break;

          case "escalate":
            decision.escalated = true;
            break;

          case "tag":
            decision.tags.push(result.ruleId);
            break;

          case "log":
            decision.logs.push(result.reason);
            break;

          case "allow":
          default:
            break;
        }
      }
    }

    return decision;
  }
}