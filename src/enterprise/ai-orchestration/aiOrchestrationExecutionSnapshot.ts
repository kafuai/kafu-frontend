import { AIOrchestrationExecutionContext } from "./aiOrchestrationExecutionContext";

export interface AIOrchestrationExecutionSnapshot {
  readonly executionId: string;
  readonly checkpoint: string;
  readonly createdAt: Date;
  readonly context: AIOrchestrationExecutionContext;
}

export function createExecutionSnapshot(
  executionId: string,
  checkpoint: string,
  context: AIOrchestrationExecutionContext,
): AIOrchestrationExecutionSnapshot {
  return {
    executionId,
    checkpoint,
    createdAt: new Date(),
    context,
  };
}
