import { AIAgentTask } from "./aiAgentWorkTypes";

export type AIAgentHandoffStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export interface AIAgentHandoff {
  id: string;
  organizationId: string;
  taskId: string;
  fromAgentId: string;
  toAgentId: string;
  status: AIAgentHandoffStatus;
  reason: string;
  notes: string[];
  requestedAt: Date;
  updatedAt: Date;
}

export function createAIAgentHandoff(
  id: string,
  task: AIAgentTask,
  toAgentId: string,
  reason: string,
): AIAgentHandoff {
  if (task.agentId === toAgentId) {
    throw new Error("AI agent handoff target must be different from source agent.");
  }

  return {
    id,
    organizationId: task.organizationId,
    taskId: task.id,
    fromAgentId: task.agentId,
    toAgentId,
    status: "requested",
    reason,
    notes: [],
    requestedAt: new Date(),
    updatedAt: new Date(),
  };
}

export function updateAIAgentHandoffStatus(
  handoff: AIAgentHandoff,
  status: AIAgentHandoffStatus,
  note?: string,
): AIAgentHandoff {
  return {
    ...handoff,
    status,
    notes: note ? [...handoff.notes, note] : handoff.notes,
    updatedAt: new Date(),
  };
}