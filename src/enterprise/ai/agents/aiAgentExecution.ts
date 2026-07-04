import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";

export type AIAgentExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIAgentExecution {
  id: string;
  organizationId: string;
  agentId: string;
  taskId: string;
  status: AIAgentExecutionStatus;
  profile: AIAgentProfile;
  task: AIAgentTask;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  output?: Record<string, unknown>;
}

export function startAIAgentExecution(
  execution: AIAgentExecution,
): AIAgentExecution {
  return {
    ...execution,
    status: "running",
    startedAt: new Date(),
  };
}

export function completeAIAgentExecution(
  execution: AIAgentExecution,
  output: Record<string, unknown>,
): AIAgentExecution {
  return {
    ...execution,
    status: "completed",
    completedAt: new Date(),
    output,
  };
}

export function failAIAgentExecution(
  execution: AIAgentExecution,
  errorMessage: string,
): AIAgentExecution {
  return {
    ...execution,
    status: "failed",
    completedAt: new Date(),
    errorMessage,
  };
}

export function cancelAIAgentExecution(
  execution: AIAgentExecution,
  reason: string,
): AIAgentExecution {
  return {
    ...execution,
    status: "cancelled",
    completedAt: new Date(),
    errorMessage: reason,
  };
}