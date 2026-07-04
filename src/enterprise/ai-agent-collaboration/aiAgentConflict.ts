export type AIAgentConflictType =
  | "priority_conflict"
  | "decision_conflict"
  | "resource_conflict"
  | "capability_conflict"
  | "approval_conflict"
  | "execution_conflict";

export type AIAgentConflictSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAgentConflictStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "escalated";

export interface AIAgentConflict {
  id: string;
  teamId: string;
  type: AIAgentConflictType;
  severity: AIAgentConflictSeverity;
  status: AIAgentConflictStatus;
  agentIds: string[];
  description: string;
  detectedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export function createAIAgentConflict(
  conflict: AIAgentConflict,
): AIAgentConflict {
  if (!conflict.id.trim()) {
    throw new Error("Conflict id is required");
  }

  if (!conflict.teamId.trim()) {
    throw new Error("Conflict team id is required");
  }

  if (conflict.agentIds.length < 2) {
    throw new Error("Conflict requires at least two agents");
  }

  if (!conflict.description.trim()) {
    throw new Error("Conflict description is required");
  }

  return conflict;
}

export function markAIAgentConflictUnderReview(
  conflict: AIAgentConflict,
): AIAgentConflict {
  return {
    ...conflict,
    status: "under_review",
  };
}

export function resolveAIAgentConflict(
  conflict: AIAgentConflict,
  resolution: string,
): AIAgentConflict {
  if (!resolution.trim()) {
    throw new Error("Conflict resolution is required");
  }

  return {
    ...conflict,
    status: "resolved",
    resolution,
    resolvedAt: new Date(),
  };
}

export function escalateAIAgentConflict(
  conflict: AIAgentConflict,
): AIAgentConflict {
  return {
    ...conflict,
    status: "escalated",
  };
}