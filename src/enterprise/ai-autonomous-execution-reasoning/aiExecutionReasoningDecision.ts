import { AIExecutionReasoningEvaluation } from "./aiExecutionReasoningEvaluator";
import { AIExecutionReasoningOutcome } from "./aiExecutionReasoningTypes";

export interface AIExecutionReasoningDecision {
  outcome: AIExecutionReasoningOutcome;
  reason: string;
  createdAt: Date;
}

export function createAIExecutionReasoningDecision(
  evaluation: AIExecutionReasoningEvaluation,
): AIExecutionReasoningDecision {
  const score = evaluation.score;

  if (score.confidence >= 0.85 && score.riskExposure <= 0.3) {
    return {
      outcome: "proceed",
      reason: "Reasoning confidence is sufficient for execution.",
      createdAt: new Date(),
    };
  }

  if (score.riskExposure >= 0.8) {
    return {
      outcome: "block",
      reason: "Risk exposure is too high.",
      createdAt: new Date(),
    };
  }

  if (score.confidence < 0.5) {
    return {
      outcome: "revise",
      reason: "Additional reasoning or evidence is required.",
      createdAt: new Date(),
    };
  }

  return {
    outcome: "defer",
    reason: "Await additional execution context.",
    createdAt: new Date(),
  };
}