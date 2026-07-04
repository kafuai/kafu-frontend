import { AIAgentOperationTask } from "./aiAgentOperationTask";
import { AIAgentOperationAssignmentStatus } from "./aiAgentOperationTypes";

export interface AIAgentOperationAgent {
  id: string;
}

export interface AIAgentOperationAssignment {
  taskId: string;
  agentId?: string;
  status: AIAgentOperationAssignmentStatus;
  reason: string;
  assignedAt?: Date;
}

export function assignAIAgentOperationTask(
  task: AIAgentOperationTask,
  agents: AIAgentOperationAgent[],
): AIAgentOperationAssignment {
  if (task.requiredAgentId) {
    const requiredAgent = agents.find((agent) => agent.id === task.requiredAgentId);

    if (!requiredAgent) {
      return {
        taskId: task.id,
        status: "blocked",
        reason: `Required agent not found: ${task.requiredAgentId}`,
      };
    }

    return {
      taskId: task.id,
      agentId: requiredAgent.id,
      status: "assigned",
      reason: "Task assigned to required AI agent.",
      assignedAt: new Date(),
    };
  }

  const availableAgent = agents[0];

  if (!availableAgent) {
    return {
      taskId: task.id,
      status: "blocked",
      reason: "No AI agents available for assignment.",
    };
  }

  return {
    taskId: task.id,
    agentId: availableAgent.id,
    status: "assigned",
    reason: "Task assigned to available AI agent.",
    assignedAt: new Date(),
  };
}