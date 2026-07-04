import {
  AIAgentExecution,
  completeAIAgentExecution,
  failAIAgentExecution,
  startAIAgentExecution,
} from "./aiAgentExecution";

export class AIAgentRuntime {
  start(
    execution: AIAgentExecution,
  ): AIAgentExecution {
    return startAIAgentExecution(execution);
  }

  complete(
    execution: AIAgentExecution,
    output: Record<string, unknown>,
  ): AIAgentExecution {
    return completeAIAgentExecution(execution, output);
  }

  fail(
    execution: AIAgentExecution,
    error: Error | string,
  ): AIAgentExecution {
    return failAIAgentExecution(
      execution,
      error instanceof Error ? error.message : error,
    );
  }
}