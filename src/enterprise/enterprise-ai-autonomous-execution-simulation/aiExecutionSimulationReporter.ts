import { AIExecutionScenario } from "./aiExecutionScenario";
import { calculateSimulationScore } from "./aiExecutionSimulationScoring";

export interface AIExecutionSimulationReport {
  scenarioId: string;
  scenarioName: string;
  status: string;
  outcome: string;
  score: number;
  probabilityOfSuccess: number;
  confidence: number;
  estimatedCost: number;
  estimatedBenefit: number;
  riskCount: number;
  recommendations: string[];
}

export function createExecutionSimulationReport(
  scenario: AIExecutionScenario,
): AIExecutionSimulationReport {
  if (!scenario.result) {
    throw new Error("Scenario must include a simulation result before reporting.");
  }

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    status: scenario.status,
    outcome: scenario.result.outcome,
    score: calculateSimulationScore(scenario.result.metrics),
    probabilityOfSuccess: scenario.result.metrics.probabilityOfSuccess,
    confidence: scenario.result.metrics.confidence,
    estimatedCost: scenario.result.metrics.estimatedCost,
    estimatedBenefit: scenario.result.metrics.estimatedBenefit,
    riskCount: scenario.result.risks.length,
    recommendations: scenario.result.recommendations,
  };
}