import { AIOrchestrationPolicy } from "./aiOrchestrationPolicy";
import { AIOrchestrationStep } from "./aiOrchestrationTypes";

export interface AIOrchestrationPolicyEvaluation {
  allowed: boolean;
  violations: string[];
}

export function evaluateAIOrchestrationPolicy(
  policy: AIOrchestrationPolicy,
  step: AIOrchestrationStep,
): AIOrchestrationPolicyEvaluation {
  const violations: string[] = [];

  if (!policy.enabled) {
    return {
      allowed: true,
      violations,
    };
  }

  if (!policy.allowedCapabilities.includes(step.capability) &&
      policy.allowedCapabilities.length > 0) {
    violations.push("Capability is not allowed by policy.");
  }

  if (policy.blockedCapabilities.includes(step.capability)) {
    violations.push("Capability is blocked by policy.");
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}