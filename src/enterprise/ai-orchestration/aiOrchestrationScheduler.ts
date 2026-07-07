export interface AIOrchestrationSchedule {
  readonly executionId: string;
  readonly scheduledAt: Date;
  readonly priority: number;
}

export function createAIOrchestrationSchedule(
  executionId: string,
  priority: number,
): AIOrchestrationSchedule {
  return {
    executionId,
    scheduledAt: new Date(),
    priority,
  };
}

export function compareSchedules(
  a: AIOrchestrationSchedule,
  b: AIOrchestrationSchedule,
): number {
  return b.priority - a.priority;
}