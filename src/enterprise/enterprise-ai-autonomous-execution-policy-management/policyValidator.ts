import { EnterpriseExecutionPolicy } from "./policyTypes";

export interface EnterpriseExecutionPolicyValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEnterpriseExecutionPolicy(
  policy: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicyValidationResult {
  const errors: string[] = [];

  if (!policy.id.trim()) {
    errors.push("Policy id is required.");
  }

  if (!policy.name.trim()) {
    errors.push("Policy name is required.");
  }

  if (policy.priority < 0) {
    errors.push("Priority cannot be negative.");
  }

  if (policy.version < 1) {
    errors.push("Version must be >= 1.");
  }

  if (policy.conditions.length === 0) {
    errors.push("At least one condition is required.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}