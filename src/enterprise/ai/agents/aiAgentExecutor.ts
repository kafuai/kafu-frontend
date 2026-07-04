import { AIAgentExecution } from "./aiAgentExecution";
import { AIAgentRuntime } from "./aiAgentRuntime";

export interface ExecuteAIAgentTaskHandler {
  (
    execution: AIAgentExecution,
  ): Record<string, unknown>;
}

export class AIAgentExecutor {
  constructor(
    private readonly runtime: AIAgentRuntime,
  ) {}

  execute(
    execution: AIAgentExecution,
    handler: ExecuteAIAgentTaskHandler,
  ): AIAgentExecution {
    const running = this.runtime.start(execution);

    try {
      const output = handler(running);

      return this.runtime.complete(running, output);
    } catch (error) {
      return this.runtime.fail(running, error as Error);
    }
  }
}