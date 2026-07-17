import { ExecutionOutcomeEvaluationContext } from "./executionOutcomeEvaluationContext";
import { ExecutionOutcomeEvaluationScoreCalculation } from "./executionOutcomeEvaluationScoreCalculator";
import {
  ExecutionOutcomeDecision,
  ExecutionOutcomeEvaluationSeverity,
  ExecutionOutcomeEvaluationStatus,
} from "./executionOutcomeEvaluationTypes";

export interface ExecutionOutcomeEvaluationDecisionResult {
  status: ExecutionOutcomeEvaluationStatus;
  severity: ExecutionOutcomeEvaluationSeverity;
  decision: ExecutionOutcomeDecision;
}

export function buildExecutionOutcomeEvaluationDecision(
  context: ExecutionOutcomeEvaluationContext,
  score: ExecutionOutcomeEvaluationScoreCalculation,
): ExecutionOutcomeEvaluationDecisionResult {
  const mandatoryMetricFailures =
    context.metrics.filter(
      (metric) =>
        metric.mandatory && !metric.achieved,
    ).length;

  const mandatoryObjectiveFailures =
    context.objectives.filter(
      (objective) =>
        objective.mandatory &&
        !objective.achieved,
    ).length;

  const materializedRisks =
    context.risks.filter(
      (risk) => risk.materialized,
    ).length;

  if (
    score.outcomeScore < 40 ||
    mandatoryMetricFailures > 0 ||
    mandatoryObjectiveFailures > 0
  ) {
    return {
      status: "failed",
      severity: "critical",
      decision: "terminate",
    };
  }

  if (
    materializedRisks > 0 ||
    score.outcomeScore < 60
  ) {
    return {
      status: "underperforming",
      severity: "high",
      decision: context.allowCorrectiveAction
        ? "correct"
        : "reassess",
    };
  }

  if (
    score.outcomeScore < 80 ||
    score.valueRealizationRate < 100
  ) {
    return {
      status: "partially_successful",
      severity: "medium",
      decision: context.allowExtension
        ? "extend"
        : "close",
    };
  }

  return {
    status: "successful",
    severity: "low",
    decision: "close",
  };
}
