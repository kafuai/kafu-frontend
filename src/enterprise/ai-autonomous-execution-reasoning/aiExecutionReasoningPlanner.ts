import { createAIExecutionReasoningChain } from "./aiExecutionReasoningChain";
import {
  createAIExecutionReasoningDecision,
  AIExecutionReasoningDecision,
} from "./aiExecutionReasoningDecision";
import {
  evaluateAIExecutionReasoningChain,
  AIExecutionReasoningEvaluation,
} from "./aiExecutionReasoningEvaluator";
import { AIExecutionReasoningInput } from "./aiExecutionReasoningInput";

export interface AIExecutionReasoningPlan {
  inputId: string;
  evaluation: AIExecutionReasoningEvaluation;
  decision: AIExecutionReasoningDecision;
  nextActions: string[];
  plannedAt: Date;
}

export function createAIExecutionReasoningPlan(
  input: AIExecutionReasoningInput,
): AIExecutionReasoningPlan {
  const chain = createAIExecutionReasoningChain(input);
  const evaluation = evaluateAIExecutionReasoningChain(chain);
  const decision = createAIExecutionReasoningDecision(evaluation);

  const nextActions =
    decision.outcome === "proceed"
      ? ["Continue autonomous execution with monitored reasoning confidence."]
      : decision.outcome === "revise"
        ? ["Collect stronger evidence.", "Re-run reasoning evaluation."]
        : decision.outcome === "block"
          ? ["Stop execution path.", "Escalate blocked reasoning outcome."]
          : decision.outcome === "escalate"
            ? ["Escalate reasoning decision to governance or operator review."]
            : ["Wait for additional execution context."];

  return {
    inputId: input.id,
    evaluation,
    decision,
    nextActions,
    plannedAt: new Date(),
  };
}