import { AgentCollaborationPolicyDecision } from "./agentCollaborationPolicy";

export interface AgentCollaborationGovernanceResult {
  approved: boolean;
  requiresReview: boolean;
  notes: string[];
  evaluatedAt: Date;
}

export function evaluateAgentCollaborationGovernance(
  decision: AgentCollaborationPolicyDecision,
): AgentCollaborationGovernanceResult {
  const notes = [...decision.reasons];

  return {
    approved: decision.approved,
    requiresReview: !decision.approved,
    notes,
    evaluatedAt: new Date(),
  };
}