import {
  AIAutonomousEvolutionDecisionType,
  AIAutonomousEvolutionStatus,
} from "./aiAutonomousEvolutionTypes";

export interface AIAutonomousEvolutionEvent {
  id: string;
  organizationId: string;
  candidateId: string;
  type: string;
  decision?: AIAutonomousEvolutionDecisionType;
  status?: AIAutonomousEvolutionStatus;
  message: string;
  timestamp: Date;
  metadata: Record<string, string>;
}

export function createAIAutonomousEvolutionEvent(
  event: Omit<AIAutonomousEvolutionEvent, "timestamp">,
): AIAutonomousEvolutionEvent {
  return {
    ...event,
    timestamp: new Date(),
  };
}