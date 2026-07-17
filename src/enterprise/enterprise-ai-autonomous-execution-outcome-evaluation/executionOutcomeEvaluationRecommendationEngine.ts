import { ExecutionOutcomeEvaluationContext } from "./executionOutcomeEvaluationContext";
import { ExecutionOutcomeEvaluationDecisionResult } from "./executionOutcomeEvaluationDecisionEngine";
import { ExecutionOutcomeEvaluationScoreCalculation } from "./executionOutcomeEvaluationScoreCalculator";

export interface ExecutionOutcomeEvaluationRecommendation {
  executiveSummary: string;
  recommendedAction: string;
}

export function buildExecutionOutcomeEvaluationRecommendation(
  context: ExecutionOutcomeEvaluationContext,
  score: ExecutionOutcomeEvaluationScoreCalculation,
  decision: ExecutionOutcomeEvaluationDecisionResult,
): ExecutionOutcomeEvaluationRecommendation {
  switch (decision.decision) {
    case "terminate":
      return {
        executiveSummary:
          "Execution outcomes are materially below the required success threshold.",
        recommendedAction:
          "Close the execution as unsuccessful, document findings, and initiate executive review.",
      };

    case "correct":
      return {
        executiveSummary:
          "Execution produced measurable value but requires corrective actions before closure.",
        recommendedAction:
          "Implement corrective actions and perform a follow-up outcome evaluation.",
      };

    case "extend":
      return {
        executiveSummary:
          "Execution achieved partial value realization and would benefit from an approved extension.",
        recommendedAction:
          "Extend the execution period and continue tracking strategic outcomes.",
      };

    case "reassess":
      return {
        executiveSummary:
          "Outcome quality requires a broader strategic reassessment.",
        recommendedAction:
          "Perform executive reassessment before deciding the next execution phase.",
      };

    default:
      return {
        executiveSummary:
          `Execution "${context.executionTitle}" successfully achieved an outcome score of ${score.outcomeScore}% with ${score.valueRealizationRate}% value realization.`,
        recommendedAction:
          context.requireExecutiveClosure
            ? "Submit the execution for executive closure approval."
            : "Close the execution and archive the outcome evaluation.",
      };
  }
}
