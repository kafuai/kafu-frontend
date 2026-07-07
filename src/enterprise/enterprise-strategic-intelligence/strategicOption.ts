import { StrategicScenarioAnalysis } from "./scenarioAnalysis";

export interface StrategicOption {
  id: string;
  title: string;
  rationale: string;
  score: number;
}

export function createStrategicOptionsFromScenarios(
  scenarios: StrategicScenarioAnalysis[],
): StrategicOption[] {
  return scenarios.map((scenario) => ({
    id: `option-${scenario.id}`,
    title: `Strategic Option: ${scenario.title}`,
    rationale: `Based on ${scenario.insights.length} insights and ${scenario.recommendations.length} recommendations.`,
    score: Math.round(scenario.probability * scenario.impact * 100),
  }));
}