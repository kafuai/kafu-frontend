import { GovernancePolicy } from "./governancePolicy";

export type CreateGovernancePolicyInput = Omit<GovernancePolicy, "enabled"> & {
  enabled?: boolean;
};

export function createGovernancePolicy(
  input: CreateGovernancePolicyInput,
): GovernancePolicy {
  return {
    ...input,
    enabled: input.enabled ?? true,
  };
}