import { AIExecutionScenario } from "./aiExecutionScenario";

export interface AIExecutionSimulationContext {
  executionId: string;

  organizationId?: string;

  actor?: string;

  objective: string;

  scenarios: AIExecutionScenario[];

  metadata?: Record<string, unknown>;

  startedAt: Date;
}