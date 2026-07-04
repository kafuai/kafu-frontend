import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";
import {
  AIAgentCapabilityMatch,
  matchAIAgentCapabilities,
} from "./aiAgentCapabilityMatcher";

export interface AIAgentCapabilityResolution {
  taskId: string;
  organizationId: string;
  selectedAgentId?: string;
  candidates: AIAgentCapabilityMatch[];
  resolved: boolean;
  reason: string;
}

export function resolveAIAgentCapabilityForTask(
  task: AIAgentTask,
  agents: readonly AIAgentProfile[],
): AIAgentCapabilityResolution {
  const candidates = agents
    .filter((agent) => agent.organizationId === task.organizationId)
    .map((agent) => matchAIAgentCapabilities(agent, task))
    .sort((first, second) => second.score - first.score);

  const eligible = candidates.find((candidate) => candidate.eligible);

  return {
    taskId: task.id,
    organizationId: task.organizationId,
    selectedAgentId: eligible?.agentId,
    candidates,
    resolved: Boolean(eligible),
    reason: eligible
      ? "A fully capable AI agent was selected."
      : "No AI agent satisfies all required task capabilities.",
  };
}