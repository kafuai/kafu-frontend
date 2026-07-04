import {
  AIAgentVote,
  calculateAIAgentVoteTotals,
} from "./aiAgentVoting";

export type AIAgentConsensusStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "tie";

export interface AIAgentConsensus {
  id: string;
  proposalId: string;
  status: AIAgentConsensusStatus;
  votes: AIAgentVote[];
  createdAt: Date;
  completedAt?: Date;
}

export function createAIAgentConsensus(
  id: string,
  proposalId: string,
): AIAgentConsensus {
  if (!id.trim()) {
    throw new Error("Consensus id is required");
  }

  if (!proposalId.trim()) {
    throw new Error("Proposal id is required");
  }

  return {
    id,
    proposalId,
    status: "pending",
    votes: [],
    createdAt: new Date(),
  };
}

export function addAIAgentConsensusVote(
  consensus: AIAgentConsensus,
  vote: AIAgentVote,
): AIAgentConsensus {
  if (consensus.votes.some((existing) => existing.agentId === vote.agentId)) {
    throw new Error(
      `Agent has already voted: ${vote.agentId}`,
    );
  }

  return {
    ...consensus,
    votes: [...consensus.votes, vote],
  };
}

export function finalizeAIAgentConsensus(
  consensus: AIAgentConsensus,
): AIAgentConsensus {
  const totals = calculateAIAgentVoteTotals(consensus.votes);

  let status: AIAgentConsensusStatus;

  if (totals.approve > totals.reject) {
    status = "approved";
  } else if (totals.reject > totals.approve) {
    status = "rejected";
  } else {
    status = "tie";
  }

  return {
    ...consensus,
    status,
    completedAt: new Date(),
  };
}

export function hasAIAgentConsensusReached(
  consensus: AIAgentConsensus,
): boolean {
  return consensus.status !== "pending";
}