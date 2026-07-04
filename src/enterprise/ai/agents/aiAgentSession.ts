import { AIAgentExecution } from "./aiAgentExecution";

export type AIAgentSessionStatus =
  | "active"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIAgentSession {
  id: string;
  organizationId: string;
  agentId: string;
  status: AIAgentSessionStatus;
  executionIds: string[];
  startedAt: Date;
  endedAt?: Date;
}

export function createAIAgentSession(
  id: string,
  organizationId: string,
  agentId: string,
): AIAgentSession {
  return {
    id,
    organizationId,
    agentId,
    status: "active",
    executionIds: [],
    startedAt: new Date(),
  };
}

export function attachExecutionToAIAgentSession(
  session: AIAgentSession,
  execution: AIAgentExecution,
): AIAgentSession {
  if (session.organizationId !== execution.organizationId) {
    throw new Error("AI agent session and execution organization mismatch.");
  }

  if (session.agentId !== execution.agentId) {
    throw new Error("AI agent session and execution agent mismatch.");
  }

  return {
    ...session,
    executionIds: Array.from(new Set([...session.executionIds, execution.id])),
  };
}

export function closeAIAgentSession(
  session: AIAgentSession,
  status: Exclude<AIAgentSessionStatus, "active">,
): AIAgentSession {
  return {
    ...session,
    status,
    endedAt: new Date(),
  };
}