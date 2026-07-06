import { AIExecutionPredictionForecast } from "./aiExecutionPredictionForecast";
import { AIExecutionPredictionModel } from "./aiExecutionPredictionModel";

export interface AIExecutionPredictionValidationResult {
  valid: boolean;
  confidenceAccepted: boolean;
  issues: string[];
}

export function validateAIExecutionPredictionForecast(
  forecast: AIExecutionPredictionForecast,
  model: AIExecutionPredictionModel,
): AIExecutionPredictionValidationResult {
  const issues: string[] = [];

  if (forecast.probability < 0 || forecast.probability > 1) {
    issues.push("Forecast probability must be between 0 and 1.");
  }

  if (forecast.confidence < 0 || forecast.confidence > 1) {
    issues.push("Forecast confidence must be between 0 and 1.");
  }

  if (forecast.confidence < model.confidenceThreshold) {
    issues.push("Forecast confidence is below model threshold.");
  }

  return {
    valid: issues.length === 0,
    confidenceAccepted: forecast.confidence >= model.confidenceThreshold,
    issues,
  };
}