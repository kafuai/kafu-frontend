import { SecurityPolicy } from "./securityPolicy";

export type SecurityPolicyValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateSecurityPolicy(
  policy: SecurityPolicy,
): SecurityPolicyValidationResult {
  const errors: string[] = [];

  if (!policy.id) errors.push("Security policy id is required.");
  if (!policy.organizationId) errors.push("Organization id is required.");
  if (!policy.name) errors.push("Security policy name is required.");
  if (!policy.permissions.length) {
    errors.push("Security policy must include at least one permission.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}