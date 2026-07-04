import { AIExecutionScenario } from "./aiExecutionScenario";
import { AIExecutionSimulationContext } from "./aiExecutionSimulationContext";

export interface AIExecutionScenarioBuilderOptions {
  strategy: string;
  input?: Record<string, unknown>;
  assumptions?: string[];
  description?: string;
}

export function buildExecutionScenario(
  context: AIExecutionSimulationContext,
  options: AIExecutionScenarioBuilderOptions,
): AIExecutionScenario {
  return {
    id: `${context.executionId}-${context.scenarios.length + 1}`,
    name: `${options.strategy} Scenario`,
    description: options.description,
    strategy: options.strategy,
    input: options.input ?? {},
    assumptions: options.assumptions ?? [],
    createdAt: new Date(),
    status: "pending",
  };
}