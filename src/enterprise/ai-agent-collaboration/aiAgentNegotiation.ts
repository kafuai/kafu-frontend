export type AIAgentNegotiationStatus =
  | "open"
  | "agreed"
  | "rejected"
  | "cancelled";

export interface AIAgentNegotiationProposal {
  id: string;
  agentId: string;
  value: string;
  score: number;
  createdAt: Date;
}

export interface AIAgentNegotiation {
  id: string;
  conversationId: string;
  topic: string;
  status: AIAgentNegotiationStatus;
  proposals: AIAgentNegotiationProposal[];
  startedAt: Date;
  completedAt?: Date;
}

export function createAIAgentNegotiation(
  negotiation: AIAgentNegotiation,
): AIAgentNegotiation {
  if (!negotiation.id.trim()) {
    throw new Error("Negotiation id is required");
  }

  if (!negotiation.topic.trim()) {
    throw new Error("Negotiation topic is required");
  }

  return negotiation;
}

export function addAIAgentNegotiationProposal(
  negotiation: AIAgentNegotiation,
  proposal: AIAgentNegotiationProposal,
): AIAgentNegotiation {
  return {
    ...negotiation,
    proposals: [...negotiation.proposals, proposal],
  };
}

export function getBestAIAgentNegotiationProposal(
  negotiation: AIAgentNegotiation,
): AIAgentNegotiationProposal | undefined {
  return negotiation.proposals.reduce<AIAgentNegotiationProposal | undefined>(
    (best, current) => {
      if (!best) {
        return current;
      }

      return current.score > best.score ? current : best;
    },
    undefined,
  );
}

export function completeAIAgentNegotiation(
  negotiation: AIAgentNegotiation,
): AIAgentNegotiation {
  return {
    ...negotiation,
    status: "agreed",
    completedAt: new Date(),
  };
}

export function rejectAIAgentNegotiation(
  negotiation: AIAgentNegotiation,
): AIAgentNegotiation {
  return {
    ...negotiation,
    status: "rejected",
    completedAt: new Date(),
  };
}