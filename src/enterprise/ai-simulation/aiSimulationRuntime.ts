import {
  AISimulationEngineInput,
  AISimulationEngineResult,
} from "./aiSimulationEngine";
import { runAISimulation } from "./aiSimulationRunner";
import {
  AISimulationEvaluation,
  evaluateAISimulationResult,
} from "./aiSimulationEvaluator";
import {
  AISimulationRecommendation,
  generateAISimulationRecommendation,
} from "./aiSimulationRecommendation";
import {
  AISimulationReport,
  createAISimulationReport,
} from "./aiSimulationReport";

export interface AISimulationRuntimeResult {
  engine: AISimulationEngineResult;
  evaluation: AISimulationEvaluation;
  recommendation: AISimulationRecommendation;
  report: AISimulationReport;
}

export function executeAISimulationRuntime(
  input: AISimulationEngineInput,
): AISimulationRuntimeResult {
  const engine = runAISimulation(input);
  const evaluation = evaluateAISimulationResult(engine);
  const recommendation = generateAISimulationRecommendation(evaluation);
  const report = createAISimulationReport(
    evaluation,
    recommendation,
  );

  return {
    engine,
    evaluation,
    recommendation,
    report,
  };
}
