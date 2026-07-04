import { ReliabilityPolicy } from "./reliabilityTypes";

export function validateReliabilityPolicy(
  policy: ReliabilityPolicy,
): string[] {
  const errors: string[] = [];

  if (!policy.id) {
    errors.push("Policy id is required.");
  }

  if (!policy.name) {
    errors.push("Policy name is required.");
  }

  if (!policy.targetService) {
    errors.push("Target service is required.");
  }

  if (policy.maxFailures < 0) {
    errors.push("Max failures cannot be negative.");
  }

  return errors;
}

export function isReliabilityPolicyValid(
  policy: ReliabilityPolicy,
): boolean {
  return validateReliabilityPolicy(policy).length === 0;
}