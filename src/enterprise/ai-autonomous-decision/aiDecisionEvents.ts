import { AIDecisionOutcome } from "./aiAutonomousDecisionTypes";

export type AIDecisionEventType =
  | "decision_context_created"
  | "decision_options_scored"
  | "decision_option_selected"
  | "decision_policy_checked"
  | "decision_validation_completed"
  | "decision.evaluated"
  | "decision.selected"
  | "decision.outcome_resolved"
  | "decision.recommended"
  | "decision.audit_recorded";

export interface AIDecisionEvent {
  id: string;
  type: AIDecisionEventType;
  contextId?: string;
  organizationId: string;
  optionId?: string;
  outcome?: AIDecisionOutcome;
  message?: string;
  actorId?: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export function createAIDecisionEvent(
  event: Omit<AIDecisionEvent, "occurredAt">,
): AIDecisionEvent {
  return {
    ...event,
    occurredAt: new Date().toISOString(),
  };
}