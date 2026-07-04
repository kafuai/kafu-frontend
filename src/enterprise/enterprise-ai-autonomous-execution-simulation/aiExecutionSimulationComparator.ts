import { AIExecutionScenario } from "./aiExecutionScenario";
import { simulateExecution } from "./aiExecutionSimulationEngine";
import { calculateSimulationScore } from "./aiExecutionSimulationScoring";

export interface AIExecutionSimulationComparisonResult {
  bestScenario: AIExecutionScenario;
  rankedScenarios: Array<{
    scenario: AIExecutionScenario;
    score: number;
  }>;
}

export function compareExecutionSimulations(
  scenarios: AIExecutionScenario[],
): AIExecutionSimulationComparisonResult {
  if (scenarios.length === 0) {
    throw new Error("At least one execution scenario is required for comparison.");
  }

  const rankedScenarios = scenarios
    .map((scenario) => {
      const result = scenario.result ?? simulateExecution(scenario);

      return {
        scenario: {
          ...scenario,
          status: "completed" as const,
          result,
        },
        score: calculateSimulationScore(result.metrics),
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    bestScenario: rankedScenarios[0].scenario,
    rankedScenarios,
  };
}