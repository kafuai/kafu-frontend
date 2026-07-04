import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";

export interface AIAgentCapabilityMatch {
  agentId: string;
  taskId: string;
  matchedCapabilities: string[];
  missingCapabilities: string[];
  score: number;
  eligible: boolean;
}

export function matchAIAgentCapabilities(
  agent: AIAgentProfile,
  task: AIAgentTask,
): AIAgentCapabilityMatch {
  if (agent.organizationId !== task.organizationId) {
    throw new Error("AI agent and task organization mismatch.");
  }

  const agentCapabilityIds = agent.capabilities.map((capability) => capability.id);

  const matchedCapabilities = task.requiredCapabilities.filter((capabilityId) =>
    agentCapabilityIds.includes(capabilityId),
  );

  const missingCapabilities = task.requiredCapabilities.filter(
    (capabilityId) => !agentCapabilityIds.includes(capabilityId),
  );

  const score =
    task.requiredCapabilities.length === 0
      ? 1
      : matchedCapabilities.length / task.requiredCapabilities.length;

  return {
    agentId: agent.id,
    taskId: task.id,
    matchedCapabilities,
    missingCapabilities,
    score,
    eligible: missingCapabilities.length === 0,
  };
}

export function findBestAIAgentForTask(
  agents: readonly AIAgentProfile[],
  task: AIAgentTask,
): AIAgentCapabilityMatch | undefined {
  return agents
    .filter((agent) => agent.organizationId === task.organizationId)
    .map((agent) => matchAIAgentCapabilities(agent, task))
    .sort((first, second) => second.score - first.score)[0];
}