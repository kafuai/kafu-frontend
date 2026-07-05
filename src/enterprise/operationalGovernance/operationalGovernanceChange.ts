import type {
  OperationalGovernanceRule,
  OperationalGovernanceStatus,
} from "./operationalGovernance";

export interface OperationalGovernanceChange {
  readonly ruleId: string;
  readonly changedAt: string;
  readonly changedBy: string;
  readonly previousStatus: OperationalGovernanceStatus;
  readonly nextStatus: OperationalGovernanceStatus;
  readonly reason: string;
}

export function applyOperationalGovernanceChange(
  rule: OperationalGovernanceRule,
  change: OperationalGovernanceChange,
): OperationalGovernanceRule {
  if (rule.id !== change.ruleId) {
    return rule;
  }

  return {
    ...rule,
    status: change.nextStatus,
  };
}