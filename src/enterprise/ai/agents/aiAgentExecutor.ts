import { AIAgentExecution } from "./aiAgentExecution";
import { AIAgentRuntime } from "./aiAgentRuntime";

export interface ExecuteAIAgentTaskHandler {
  (
    execution: AIAgentExecution,
  ):
    | Record<string, unknown>
    | Promise<Record<string, unknown>>;
}

export class AIAgentExecutor {
  constructor(
    private readonly runtime: AIAgentRuntime,
  ) {}

  async execute(
    execution: AIAgentExecution,
    handler: ExecuteAIAgentTaskHandler,
  ): Promise<AIAgentExecution> {
    const running =
      this.runtime.start(execution);

    try {
      const output =
        await handler(running);

      return this.runtime.complete(
        running,
        output,
      );
    } catch (error) {
      return this.runtime.fail(
        running,
        error instanceof Error
          ? error
          : String(error),
      );
    }
  }
}