import { AIAgentMemoryEntry } from "./aiAgentMemory";
import { AIAgentTask } from "./aiAgentWorkTypes";

export interface AIAgentKnowledgeContext {
  taskId: string;
  agentId: string;
  organizationId: string;
  memories: AIAgentMemoryEntry[];
  requiredCapabilities: string[];
  constraints: string[];
}

export function buildAIAgentKnowledgeContext(
  task: AIAgentTask,
  memories: AIAgentMemoryEntry[],
  constraints: string[] = [],
): AIAgentKnowledgeContext {
  return {
    taskId: task.id,
    agentId: task.agentId,
    organizationId: task.organizationId,
    memories,
    requiredCapabilities: task.requiredCapabilities,
    constraints,
  };
}