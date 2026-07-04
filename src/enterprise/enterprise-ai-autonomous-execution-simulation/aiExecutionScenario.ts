import {
  AIExecutionSimulationResult,
  AIExecutionSimulationStatus,
} from "./aiExecutionSimulationTypes";

export interface AIExecutionScenario {
  id: string;
  name: string;
  description?: string;

  strategy: string;

  input: Record<string, unknown>;

  assumptions: string[];

  createdAt: Date;

  status: AIExecutionSimulationStatus;

  result?: AIExecutionSimulationResult;
}