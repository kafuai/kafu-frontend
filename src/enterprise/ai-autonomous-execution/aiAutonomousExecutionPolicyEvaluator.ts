import { AIAutonomousExecutionPolicy } from "./aiAutonomousExecutionPolicy";
import { AIAutonomousExecutionTask } from "./aiAutonomousExecutionTask";

export interface AIAutonomousExecutionPolicyEvaluation {
  allowed: boolean;
  requiresApproval: boolean;
  reasons: string[];
}

const riskOrder = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const;

export function evaluateAIAutonomousExecutionPolicy(
  policy: AIAutonomousExecutionPolicy,
  task: AIAutonomousExecutionTask,
): AIAutonomousExecutionPolicyEvaluation {
  const reasons: string[] = [];

  if (!policy.enabled) {
    reasons.push("Policy is disabled.");
  }

  if (
    policy.allowedCapabilityIds.length > 0 &&
    !policy.allowedCapabilityIds.includes(task.capabilityId)
  ) {
    reasons.push("Capability is not allowed.");
  }

  if (policy.blockedCapabilityIds.includes(task.capabilityId)) {
    reasons.push("Capability is blocked.");
  }

  if (
    riskOrder[task.riskLevel] >
    riskOrder[policy.maxRiskLevel]
  ) {
    reasons.push("Risk level exceeds policy limit.");
  }

  const requiresApproval =
    policy.approvalRequiredRiskLevels.includes(task.riskLevel) ||
    policy.approvalRequiredPriorities.includes(task.priority);

  return {
    allowed: reasons.length === 0,
    requiresApproval,
    reasons,
  };
}