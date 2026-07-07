import { AIOrchestrationExecutionContext } from "./aiOrchestrationExecutionContext";
import { AIOrchestrationExecutionSnapshot } from "./aiOrchestrationExecutionSnapshot";

export interface AIOrchestrationRecoveryResult {
  readonly executionId: string;
  readonly recovered: boolean;
  readonly restoredCheckpoint: string;
  readonly context: AIOrchestrationExecutionContext;
}

export function recoverAIOrchestrationExecution(
  snapshot: AIOrchestrationExecutionSnapshot,
): AIOrchestrationRecoveryResult {
  return {
    executionId: snapshot.executionId,
    recovered: true,
    restoredCheckpoint: snapshot.checkpoint,
    context: snapshot.context,
  };
}