import { StrategicScenarioAnalysis } from "./scenarioAnalysis";

export function rankStrategicScenarios(
  scenarios: StrategicScenarioAnalysis[],
): StrategicScenarioAnalysis[] {
  return [...scenarios].sort(
    (first, second) =>
      second.probability * second.impact - first.probability * first.impact,
  );
}