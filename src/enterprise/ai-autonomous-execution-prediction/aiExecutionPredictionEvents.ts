import { AIExecutionPredictionResult } from "./aiExecutionPredictionEngine";

export type AIExecutionPredictionEventType =
  | "execution_prediction_started"
  | "execution_prediction_completed"
  | "execution_prediction_blocked";

export interface AIExecutionPredictionEvent {
  id: string;
  type: AIExecutionPredictionEventType;
  signalId: string;
  selectedScenarioId?: string;
  message: string;
  createdAt: Date;
  correlationId?: string;
}

export function createAIExecutionPredictionEvent(
  result: AIExecutionPredictionResult,
): AIExecutionPredictionEvent {
  const blocked = !result.selectedScenario;

  return {
    id: `${result.signal.id}:${blocked ? "blocked" : "completed"}`,
    type: blocked
      ? "execution_prediction_blocked"
      : "execution_prediction_completed",
    signalId: result.signal.id,
    selectedScenarioId: result.selectedScenario?.id,
    message: result.rationale,
    createdAt: new Date(),
    correlationId: result.metadata.correlationId,
  };
}