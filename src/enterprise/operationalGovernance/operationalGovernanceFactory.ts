import {
  type OperationalGovernanceRule,
  type OperationalGovernanceScope,
} from "./operationalGovernance";

export interface CreateOperationalGovernanceRuleInput {
  readonly id: string;
  readonly name: string;
  readonly scope: OperationalGovernanceScope;
  readonly owner: string;
  readonly effectiveFrom: string;
  readonly reviewBy: string;
}

export function createOperationalGovernanceRule(
  input: CreateOperationalGovernanceRuleInput,
): OperationalGovernanceRule {
  return {
    id: input.id,
    name: input.name,
    scope: input.scope,
    status: "draft",
    owner: input.owner,
    effectiveFrom: input.effectiveFrom,
    reviewBy: input.reviewBy,
  };
}