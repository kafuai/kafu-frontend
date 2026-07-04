import { ResiliencePolicy } from "./resilienceTypes";

export function createResiliencePolicy(
  policy: Omit<ResiliencePolicy, "createdAt" | "updatedAt">,
): ResiliencePolicy {
  const now = new Date();

  return {
    ...policy,
    createdAt: now,
    updatedAt: now,
  };
}

export function isResiliencePolicyEnabled(policy: ResiliencePolicy): boolean {
  return policy.enabled;
}

export function validateResiliencePolicy(policy: ResiliencePolicy): string[] {
  const errors: string[] = [];

  if (!policy.id) errors.push("Resilience policy id is required.");
  if (!policy.organizationId) errors.push("Organization id is required.");
  if (!policy.name) errors.push("Resilience policy name is required.");

  if (policy.maxAttempts !== undefined && policy.maxAttempts < 1) {
    errors.push("Max attempts must be greater than zero.");
  }

  if (policy.timeoutMs !== undefined && policy.timeoutMs < 1) {
    errors.push("Timeout must be greater than zero.");
  }

  if (policy.baseDelayMs !== undefined && policy.baseDelayMs < 0) {
    errors.push("Base delay cannot be negative.");
  }

  if (policy.maxDelayMs !== undefined && policy.maxDelayMs < 0) {
    errors.push("Max delay cannot be negative.");
  }

  return errors;
}