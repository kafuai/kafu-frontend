import { AIAgentTeam } from "../aiAgentTeam";
import {
  AgentCollaborationStrategy,
  AgentCollaborationStrategyType,
} from "./agentCollaborationStrategy";

export interface AgentCollaborationPolicy {
  id: string;
  organizationId: string;
  name: string;
  allowedStrategies: AgentCollaborationStrategyType[];
  requireConsensus: boolean;
  active: boolean;
}

export interface AgentCollaborationPolicyDecision {
  approved: boolean;
  strategy: AgentCollaborationStrategyType;
  reasons: string[];
}

export function evaluateAgentCollaborationPolicy(
  team: AIAgentTeam,
  strategy: AgentCollaborationStrategy,
  policy: AgentCollaborationPolicy,
): AgentCollaborationPolicyDecision {
  const reasons: string[] = [];

  if (!policy.active) {
    reasons.push("Policy is inactive.");
  }

  if (!policy.allowedStrategies.includes(strategy.type)) {
    reasons.push("Selected strategy is not allowed.");
  }

  if (
    team.members.length > strategy.maximumAgents ||
    team.members.length < strategy.minimumAgents
  ) {
    reasons.push("Team size is outside the allowed strategy range.");
  }

  return {
    approved: reasons.length === 0,
    strategy: strategy.type,
    reasons,
  };
}