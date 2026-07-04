import { AIAgentTeam } from "./aiAgentTeam";
import { AIAgentTask } from "./aiAgentWorkTypes";

export type AIAgentCollaborationStatus =
  | "planned"
  | "active"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIAgentCollaboration {
  id: string;
  organizationId: string;
  teamId: string;
  taskId: string;
  status: AIAgentCollaborationStatus;
  participantAgentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function createAIAgentCollaboration(
  id: string,
  team: AIAgentTeam,
  task: AIAgentTask,
): AIAgentCollaboration {
  if (team.organizationId !== task.organizationId) {
    throw new Error("AI agent team and task organization mismatch.");
  }

  return {
    id,
    organizationId: team.organizationId,
    teamId: team.id,
    taskId: task.id,
    status: "planned",
    participantAgentIds: [...team.agentIds],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function updateAIAgentCollaborationStatus(
  collaboration: AIAgentCollaboration,
  status: AIAgentCollaborationStatus,
): AIAgentCollaboration {
  return {
    ...collaboration,
    status,
    updatedAt: new Date(),
  };
}