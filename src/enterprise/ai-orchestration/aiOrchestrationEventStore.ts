import { AIOrchestrationEvent } from "./aiOrchestrationEvent";

export class AIOrchestrationEventStore {
  private readonly events: AIOrchestrationEvent[] = [];

  publish(event: AIOrchestrationEvent): void {
    this.events.push(event);
  }

  publishMany(events: AIOrchestrationEvent[]): void {
    this.events.push(...events);
  }

  getAll(): AIOrchestrationEvent[] {
    return [...this.events];
  }

  getByExecution(executionId: string): AIOrchestrationEvent[] {
    return this.events.filter(
      (event) => event.executionId === executionId,
    );
  }

  clear(): void {
    this.events.length = 0;
  }
}