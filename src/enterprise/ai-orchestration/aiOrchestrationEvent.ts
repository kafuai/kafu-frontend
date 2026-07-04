export type AIOrchestrationEventType =
  | "workflow.started"
  | "workflow.completed"
  | "workflow.failed"
  | "step.started"
  | "step.completed"
  | "step.failed"
  | "route.completed";

export interface AIOrchestrationEvent {
  id: string;
  organizationId: string;
  executionId: string;
  workflowId: string;
  type: AIOrchestrationEventType;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export function createAIOrchestrationEvent(
  event: AIOrchestrationEvent,
): AIOrchestrationEvent {
  return {
    ...event,
    timestamp: event.timestamp ?? new Date(),
  };
}