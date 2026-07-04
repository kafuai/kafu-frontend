import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";

export interface AIAgentAssignment {
  id: string;
  organizationId: string;
  agentId: string;
  taskId: string;
  matchedCapabilities: string[];
  missingCapabilities: string[];
  assignable: boolean;
  assignedAt: Date;
}

export function assignAIAgentTask(
  id: string,
  agent: AIAgentProfile,
  task: AIAgentTask,
): AIAgentAssignment {
  if (agent.organizationId !== task.organizationId) {
    throw new Error("AI agent and task must belong to the same organization.");
  }

  const agentCapabilityIds = agent.capabilities.map((capability) => capability.id);

  const matchedCapabilities = task.requiredCapabilities.filter((capabilityId) =>
    agentCapabilityIds.includes(capabilityId),
  );

  const missingCapabilities = task.requiredCapabilities.filter(
    (capabilityId) => !agentCapabilityIds.includes(capabilityId),
  );

  return {
    id,
    organizationId: task.organizationId,
    agentId: agent.id,
    taskId: task.id,
    matchedCapabilities,
    missingCapabilities,
    assignable: missingCapabilities.length === 0,
    assignedAt: new Date(),
  };
}