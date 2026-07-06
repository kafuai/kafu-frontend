import {
  AIExecutionPredictionInput,
  AIExecutionPredictionResult,
  runAIExecutionPrediction,
} from "./aiExecutionPredictionEngine";
import {
  AIExecutionPredictionForecast,
  AIExecutionPredictionForecastHorizon,
  createAIExecutionPredictionForecast,
} from "./aiExecutionPredictionForecast";
import {
  AIExecutionPredictionInsight,
  deriveAIExecutionPredictionInsight,
} from "./aiExecutionPredictionInsight";
import { AIExecutionPredictionModel } from "./aiExecutionPredictionModel";
import {
  AIExecutionPredictionValidationResult,
  validateAIExecutionPredictionForecast,
} from "./aiExecutionPredictionValidator";

export interface AIExecutionPredictionRuntimeResult {
  prediction: AIExecutionPredictionResult;
  forecast?: AIExecutionPredictionForecast;
  insight?: AIExecutionPredictionInsight;
  validation?: AIExecutionPredictionValidationResult;
}

export function runAIExecutionPredictionRuntime(
  input: AIExecutionPredictionInput,
  model: AIExecutionPredictionModel,
  horizon: AIExecutionPredictionForecastHorizon,
): AIExecutionPredictionRuntimeResult {
  const prediction = runAIExecutionPrediction(input);

  if (!prediction.selectedScenario || !prediction.selectedScore) {
    return {
      prediction,
    };
  }

  const forecast = createAIExecutionPredictionForecast(
    prediction.selectedScenario,
    prediction.selectedScore,
    model,
    horizon,
  );

  const insight = deriveAIExecutionPredictionInsight(forecast);

  const validation = validateAIExecutionPredictionForecast(
    forecast,
    model,
  );

  return {
    prediction,
    forecast,
    insight,
    validation,
  };
}