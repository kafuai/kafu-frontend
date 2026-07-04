import { AIAgentExecution } from "./aiAgentExecution";

export class AIAgentExecutionRegistry {
  private readonly executions = new Map<string, AIAgentExecution>();

  register(execution: AIAgentExecution): AIAgentExecution {
    if (this.executions.has(execution.id)) {
      throw new Error(`AI agent execution already exists: ${execution.id}`);
    }

    this.executions.set(execution.id, execution);
    return execution;
  }

  upsert(execution: AIAgentExecution): AIAgentExecution {
    this.executions.set(execution.id, execution);
    return execution;
  }

  get(executionId: string): AIAgentExecution | undefined {
    return this.executions.get(executionId);
  }

  require(executionId: string): AIAgentExecution {
    const execution = this.get(executionId);

    if (!execution) {
      throw new Error(`AI agent execution not found: ${executionId}`);
    }

    return execution;
  }

  list(): AIAgentExecution[] {
    return Array.from(this.executions.values());
  }

  listByOrganization(organizationId: string): AIAgentExecution[] {
    return this.list().filter(
      (execution) => execution.organizationId === organizationId,
    );
  }

  listByAgent(agentId: string): AIAgentExecution[] {
    return this.list().filter((execution) => execution.agentId === agentId);
  }
}