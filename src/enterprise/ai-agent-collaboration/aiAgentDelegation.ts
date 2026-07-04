export type AIAgentDelegationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "failed";

export interface AIAgentDelegation {
  id: string;
  conversationId: string;
  taskId: string;
  fromAgentId: string;
  toAgentId: string;
  reason: string;
  status: AIAgentDelegationStatus;
  delegatedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
}

export function createAIAgentDelegation(
  delegation: AIAgentDelegation,
): AIAgentDelegation {
  if (!delegation.id.trim()) {
    throw new Error("Delegation id is required");
  }

  if (!delegation.fromAgentId.trim()) {
    throw new Error("Delegating agent id is required");
  }

  if (!delegation.toAgentId.trim()) {
    throw new Error("Target agent id is required");
  }

  if (delegation.fromAgentId === delegation.toAgentId) {
    throw new Error("Agent cannot delegate a task to itself");
  }

  return delegation;
}

export function acceptAIAgentDelegation(
  delegation: AIAgentDelegation,
): AIAgentDelegation {
  return {
    ...delegation,
    status: "accepted",
    acceptedAt: new Date(),
  };
}

export function startAIAgentDelegation(
  delegation: AIAgentDelegation,
): AIAgentDelegation {
  return {
    ...delegation,
    status: "in_progress",
  };
}

export function completeAIAgentDelegation(
  delegation: AIAgentDelegation,
): AIAgentDelegation {
  return {
    ...delegation,
    status: "completed",
    completedAt: new Date(),
  };
}

export function failAIAgentDelegation(
  delegation: AIAgentDelegation,
): AIAgentDelegation {
  return {
    ...delegation,
    status: "failed",
  };
}

export function rejectAIAgentDelegation(
  delegation: AIAgentDelegation,
): AIAgentDelegation {
  return {
    ...delegation,
    status: "rejected",
  };
}