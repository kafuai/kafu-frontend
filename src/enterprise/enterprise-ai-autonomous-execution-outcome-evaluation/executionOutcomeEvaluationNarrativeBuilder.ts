import { ExecutionOutcomeEvaluationContext } from "./executionOutcomeEvaluationContext";
import { ExecutionOutcomeEvaluationDecisionResult } from "./executionOutcomeEvaluationDecisionEngine";
import { ExecutionOutcomeEvaluationRecommendation } from "./executionOutcomeEvaluationRecommendationEngine";
import { ExecutionOutcomeEvaluationScoreCalculation } from "./executionOutcomeEvaluationScoreCalculator";

export interface ExecutionOutcomeEvaluationNarrative {
  headline: string;
  summary: string;
  outcomePosition: string;
  closureGuidance: string;
}

export function buildExecutionOutcomeEvaluationNarrative(
  context: ExecutionOutcomeEvaluationContext,
  score: ExecutionOutcomeEvaluationScoreCalculation,
  decision: ExecutionOutcomeEvaluationDecisionResult,
  recommendation: ExecutionOutcomeEvaluationRecommendation,
): ExecutionOutcomeEvaluationNarrative {
  const headline =
    decision.status === "successful"
      ? "Execution achieved its intended outcomes"
      : decision.status === "partially_successful"
        ? "Execution achieved partial outcomes"
        : decision.status === "underperforming"
          ? "Execution outcomes require corrective action"
          : decision.status === "failed"
            ? "Execution failed to achieve required outcomes"
            : decision.status === "extended"
              ? "Execution outcome evaluation recommends extension"
              : "Execution outcome evaluation is ready for closure";

  return {
    headline,

    summary:
      recommendation.executiveSummary,

    outcomePosition:
      `Execution "${context.executionTitle}" achieved an outcome score of ${score.outcomeScore}% with ${score.valueRealizationRate}% value realization, ${score.costVarianceRate}% cost variance, and ${score.durationVarianceRate}% duration variance.`,

    closureGuidance:
      recommendation.recommendedAction,
  };
}
