import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";
import {
  AIAgentPolicy,
  AIAgentPolicyDecision,
} from "./aiAgentPolicy";

export interface AIAgentPolicyEvaluation {
  organizationId: string;
  agentId: string;
  taskId: string;
  allowed: boolean;
  requiresReview: boolean;
  decisions: AIAgentPolicyDecision[];
  evaluatedAt: Date;
}

export function evaluateAIAgentPolicies(
  agent: AIAgentProfile,
  task: AIAgentTask,
  policies: readonly AIAgentPolicy[],
): AIAgentPolicyEvaluation {
  if (agent.organizationId !== task.organizationId) {
    throw new Error("AI agent and task organization mismatch.");
  }

  const agentCapabilityIds = agent.capabilities.map((capability) => capability.id);

  const decisions = policies
    .filter((policy) => policy.organizationId === task.organizationId)
    .map((policy): AIAgentPolicyDecision => {
      const reasons: string[] = [];

      if (
        policy.requiredAgentStatuses &&
        !policy.requiredAgentStatuses.includes(agent.status)
      ) {
        reasons.push(`Agent status '${agent.status}' is not allowed.`);
      }

      if (
        policy.blockedTaskPriorities &&
        policy.blockedTaskPriorities.includes(task.priority)
      ) {
        reasons.push(`Task priority '${task.priority}' is blocked.`);
      }

      if (policy.requiredCapabilities) {
        const missing = policy.requiredCapabilities.filter(
          (capabilityId) => !agentCapabilityIds.includes(capabilityId),
        );

        if (missing.length > 0) {
          reasons.push(`Missing required capabilities: ${missing.join(", ")}.`);
        }
      }

      return {
        policyId: policy.id,
        effect: policy.effect,
        passed: reasons.length === 0,
        reasons,
      };
    });

  const denied = decisions.some(
    (decision) => !decision.passed && decision.effect === "deny",
  );

  const requiresReview = decisions.some(
    (decision) => !decision.passed && decision.effect === "review",
  );

  return {
    organizationId: task.organizationId,
    agentId: agent.id,
    taskId: task.id,
    allowed: !denied,
    requiresReview,
    decisions,
    evaluatedAt: new Date(),
  };
}