import { AIAgentExecution } from "./aiAgentExecution";

export type AIAgentEventType =
  | "agent.execution.queued"
  | "agent.execution.started"
  | "agent.execution.completed"
  | "agent.execution.failed"
  | "agent.execution.cancelled";

export interface AIAgentEvent {
  id: string;
  type: AIAgentEventType;
  organizationId: string;
  agentId: string;
  executionId: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
}

export function createAIAgentExecutionEvent(
  id: string,
  type: AIAgentEventType,
  execution: AIAgentExecution,
): AIAgentEvent {
  return {
    id,
    type,
    organizationId: execution.organizationId,
    agentId: execution.agentId,
    executionId: execution.id,
    occurredAt: new Date(),
    payload: {
      status: execution.status,
      taskId: execution.taskId,
      errorMessage: execution.errorMessage,
    },
  };
}