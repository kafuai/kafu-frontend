import { GovernanceRule } from "./governanceRules";
import { GovernanceSubject } from "./governanceTypes";

export type CreateGovernanceRuleInput = {
  id: string;
  name: string;
  enabled?: boolean;
  evaluate: (subject: GovernanceSubject) => boolean;
};

export function createGovernanceRule(
  input: CreateGovernanceRuleInput,
): GovernanceRule {
  return {
    ...input,
    enabled: input.enabled ?? true,
  };
}