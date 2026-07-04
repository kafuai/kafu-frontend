import {
  AIDecisionEngineResult,
  RunAIDecisionEngineInput,
  runAIDecisionEngine,
} from "./aiDecisionEngine";
import {
  AIDecisionEvent,
  createAIDecisionEvent,
} from "./aiDecisionEvents";

export interface AIDecisionRuntimeResult {
  result: AIDecisionEngineResult;
  events: AIDecisionEvent[];
  completedAt: Date;
}

export function runAIDecisionRuntime(
  input: RunAIDecisionEngineInput,
): AIDecisionRuntimeResult {
  const result = runAIDecisionEngine(input);

  const events: AIDecisionEvent[] = [
    createAIDecisionEvent({
      id: `${result.context.id}-evaluated`,
      type: "decision.evaluated",
      contextId: result.context.id,
      organizationId: result.context.organizationId,
      message: "Decision evaluation completed.",
    }),
    createAIDecisionEvent({
      id: `${result.context.id}-selected`,
      type: "decision.selected",
      contextId: result.context.id,
      organizationId: result.context.organizationId,
      optionId: result.selection.selectedOption?.id,
      message: result.selection.reason,
    }),
    createAIDecisionEvent({
      id: `${result.context.id}-outcome`,
      type: "decision.outcome_resolved",
      contextId: result.context.id,
      organizationId: result.context.organizationId,
      optionId: result.selection.selectedOption?.id,
      outcome: result.outcome.outcome,
      message: result.outcome.reason,
    }),
    createAIDecisionEvent({
      id: `${result.context.id}-recommendation`,
      type: "decision.recommended",
      contextId: result.context.id,
      organizationId: result.context.organizationId,
      optionId: result.selection.selectedOption?.id,
      outcome: result.outcome.outcome,
      message: result.recommendation.summary,
    }),
    createAIDecisionEvent({
      id: `${result.context.id}-audit`,
      type: "decision.audit_recorded",
      contextId: result.context.id,
      organizationId: result.context.organizationId,
      optionId: result.selection.selectedOption?.id,
      outcome: result.outcome.outcome,
      message: "Decision audit record created.",
    }),
  ];

  return {
    result,
    events,
    completedAt: new Date(),
  };
}