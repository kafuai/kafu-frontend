import {
  AISimulationEngineInput,
  AISimulationEngineResult,
  runAISimulationEngine,
} from "./aiSimulationEngine";

export function runAISimulation(
  input: AISimulationEngineInput,
): AISimulationEngineResult {
  return runAISimulationEngine(input);
}
