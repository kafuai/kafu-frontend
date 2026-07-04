import { AIDecisionOutcome } from "./aiAutonomousDecisionTypes";

export type AIDecisionEventType =
  | "decision.evaluated"
  | "decision.selected"
  | "decision.outcome_resolved"
  | "decision.recommended"
  | "decision.audit_recorded";

export interface AIDecisionEvent {
  id: string;
  type: AIDecisionEventType;
  contextId: string;
  organizationId: string;
  optionId?: string;
  outcome?: AIDecisionOutcome;
  message: string;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}

export interface CreateAIDecisionEventInput {
  id: string;
  type: AIDecisionEventType;
  contextId: string;
  organizationId: string;
  optionId?: string;
  outcome?: AIDecisionOutcome;
  message: string;
  metadata?: Record<string, unknown>;
}

export function createAIDecisionEvent(
  input: CreateAIDecisionEventInput,
): AIDecisionEvent {
  return {
    ...input,
    occurredAt: new Date(),
  };
}