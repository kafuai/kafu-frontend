export type AIAgentVoteValue =
  | "approve"
  | "reject"
  | "abstain";

export interface AIAgentVote {
  id: string;
  proposalId: string;
  agentId: string;
  value: AIAgentVoteValue;
  weight: number;
  reason?: string;
  createdAt: Date;
}

export function createAIAgentVote(
  vote: AIAgentVote,
): AIAgentVote {
  if (!vote.id.trim()) {
    throw new Error("Vote id is required");
  }

  if (!vote.proposalId.trim()) {
    throw new Error("Proposal id is required");
  }

  if (!vote.agentId.trim()) {
    throw new Error("Agent id is required");
  }

  if (vote.weight < 0) {
    throw new Error("Vote weight cannot be negative");
  }

  return vote;
}

export function calculateAIAgentVoteTotals(
  votes: AIAgentVote[],
): Record<AIAgentVoteValue, number> {
  const totals: Record<AIAgentVoteValue, number> = {
    approve: 0,
    reject: 0,
    abstain: 0,
  };

  for (const vote of votes) {
    totals[vote.value] += vote.weight;
  }

  return totals;
}