import { AIAutonomousExecutionStatus } from "./aiAutonomousExecutionTypes";

export interface AIAutonomousExecutionEvent {
  id: string;
  executionId: string;
  planId: string;
  organizationId: string;
  type: string;
  status: AIAutonomousExecutionStatus;
  message: string;
  createdAt: Date;
}

export function createAIAutonomousExecutionEvent(
  event: Omit<AIAutonomousExecutionEvent, "createdAt">,
): AIAutonomousExecutionEvent {
  return {
    ...event,
    createdAt: new Date(),
  };
}