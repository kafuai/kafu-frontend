import { AIExecutionDecisionIntelligenceResult } from "./aiExecutionDecisionIntelligenceEngine";

export type AIExecutionDecisionIntelligenceEventType =
  | "execution_decision_intelligence_started"
  | "execution_decision_intelligence_completed"
  | "execution_decision_intelligence_blocked";

export interface AIExecutionDecisionIntelligenceEvent {
  id: string;
  type: AIExecutionDecisionIntelligenceEventType;
  signalId: string;
  selectedOptionId?: string;
  message: string;
  createdAt: Date;
  correlationId?: string;
}

export function createAIExecutionDecisionIntelligenceEvent(
  result: AIExecutionDecisionIntelligenceResult,
): AIExecutionDecisionIntelligenceEvent {
  const blocked = !result.selectedOption;

  return {
    id: `${result.signal.id}:${blocked ? "blocked" : "completed"}`,
    type: blocked
      ? "execution_decision_intelligence_blocked"
      : "execution_decision_intelligence_completed",
    signalId: result.signal.id,
    selectedOptionId: result.selectedOption?.id,
    message: result.rationale,
    createdAt: new Date(),
    correlationId: result.metadata.correlationId,
  };
}