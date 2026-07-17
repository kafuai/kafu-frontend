import { ExecutionSupervisionContext } from "./executionSupervisionContext";
import { ExecutionSupervisionDecision } from "./executionSupervisionDecisionEngine";
import { ExecutionSupervisionInterventionEvaluation } from "./executionSupervisionInterventionEngine";
import { ExecutionSupervisionScoreCalculation } from "./executionSupervisionScoreCalculator";

export interface ExecutionSupervisionNarrative {
  headline: string;
  summary: string;
  supervisionPosition: string;
  executiveGuidance: string;
}

export function buildExecutionSupervisionNarrative(
  context: ExecutionSupervisionContext,
  scoreCalculation: ExecutionSupervisionScoreCalculation,
  interventionEvaluation: ExecutionSupervisionInterventionEvaluation,
  decision: ExecutionSupervisionDecision,
): ExecutionSupervisionNarrative {
  const headline =
    decision.status === "stable"
      ? "Execution remains under control"
      : decision.status === "attention_required"
        ? "Execution requires operational attention"
        : decision.status === "intervention_required"
          ? "Execution requires supervisory intervention"
          : decision.status === "paused"
            ? "Execution has been paused"
            : decision.status === "escalated"
              ? "Execution has been escalated"
              : "Execution has been terminated";

  return {
    headline,

    summary:
      decision.executiveSummary,

    supervisionPosition:
      `Execution "${context.executionTitle}" currently has a supervision score of ${scoreCalculation.supervisionScore}% with confidence ${scoreCalculation.confidenceScore}% and progress variance ${scoreCalculation.progressVariance}%.`,

    executiveGuidance:
      `${decision.recommendedAction} Recommended intervention: ${interventionEvaluation.intervention.interventionType}.`,
  };
}
