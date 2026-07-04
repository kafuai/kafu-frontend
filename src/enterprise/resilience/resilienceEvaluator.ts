import { ResiliencePolicy } from "./resilienceTypes";
import { validateResiliencePolicy } from "./resiliencePolicy";

export type ResilienceEvaluationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function evaluateResiliencePolicy(
  policy: ResiliencePolicy,
): ResilienceEvaluationResult {
  const errors = validateResiliencePolicy(policy);
  const warnings: string[] = [];

  if (!policy.enabled) {
    warnings.push("Resilience policy is disabled.");
  }

  if (policy.type === "retry" && !policy.maxAttempts) {
    warnings.push("Retry policy has no max attempts configured.");
  }

  if (policy.type === "backoff" && !policy.backoffStrategy) {
    warnings.push("Backoff policy has no strategy configured.");
  }

  if (policy.type === "failover" && !policy.timeoutMs) {
    warnings.push("Failover policy has no timeout configured.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}