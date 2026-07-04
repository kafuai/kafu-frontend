import { AIAgentExecution } from "./aiAgentExecution";
import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";

export interface CreateAIAgentExecutionInput {
  id: string;
  profile: AIAgentProfile;
  task: AIAgentTask;
}

export function createAIAgentExecution(
  input: CreateAIAgentExecutionInput,
): AIAgentExecution {
  if (input.profile.organizationId !== input.task.organizationId) {
    throw new Error(
      "AI agent profile and task must belong to the same organization.",
    );
  }

  if (input.profile.id !== input.task.agentId) {
    throw new Error(
      "AI agent profile does not match the assigned task.",
    );
  }

  return {
    id: input.id,
    organizationId: input.profile.organizationId,
    agentId: input.profile.id,
    taskId: input.task.id,
    status: "queued",
    profile: input.profile,
    task: input.task,
  };
}