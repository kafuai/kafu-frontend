import { GovernancePolicy } from "./governancePolicy";

export class GovernancePolicyValidator {
  validate(policy: GovernancePolicy): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!policy.id) errors.push("Policy id is required.");
    if (!policy.organizationId)
      errors.push("Organization id is required.");
    if (!policy.name) errors.push("Policy name is required.");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}