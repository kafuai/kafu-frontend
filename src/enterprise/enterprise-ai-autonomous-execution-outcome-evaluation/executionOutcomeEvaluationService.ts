import {
  createExecutionOutcomeEvaluationContext,
  CreateExecutionOutcomeEvaluationContextInput,
  ExecutionOutcomeEvaluationContext,
} from "./executionOutcomeEvaluationContext";

import {
  calculateExecutionOutcomeEvaluationScore,
  ExecutionOutcomeEvaluationScoreCalculation,
} from "./executionOutcomeEvaluationScoreCalculator";

import {
  buildExecutionOutcomeEvaluationDecision,
  ExecutionOutcomeEvaluationDecisionResult,
} from "./executionOutcomeEvaluationDecisionEngine";

import {
  buildExecutionOutcomeEvaluationRecommendation,
  ExecutionOutcomeEvaluationRecommendation,
} from "./executionOutcomeEvaluationRecommendationEngine";

import {
  buildExecutionOutcomeEvaluationNarrative,
  ExecutionOutcomeEvaluationNarrative,
} from "./executionOutcomeEvaluationNarrativeBuilder";

import {
  createExecutionOutcomeEvaluationResult,
  ExecutionOutcomeEvaluationResult,
} from "./executionOutcomeEvaluationResult";

export interface ExecutionOutcomeEvaluationServiceOutput {
  context: ExecutionOutcomeEvaluationContext;
  scoreCalculation: ExecutionOutcomeEvaluationScoreCalculation;
  decision: ExecutionOutcomeEvaluationDecisionResult;
  recommendation: ExecutionOutcomeEvaluationRecommendation;
  narrative: ExecutionOutcomeEvaluationNarrative;
  result: ExecutionOutcomeEvaluationResult;
}

export function evaluateExecutionOutcome(
  input: CreateExecutionOutcomeEvaluationContextInput,
): ExecutionOutcomeEvaluationServiceOutput {
  const context =
    createExecutionOutcomeEvaluationContext(input);

  const scoreCalculation =
    calculateExecutionOutcomeEvaluationScore(
      context,
    );

  const decision =
    buildExecutionOutcomeEvaluationDecision(
      context,
      scoreCalculation,
    );

  const recommendation =
    buildExecutionOutcomeEvaluationRecommendation(
      context,
      scoreCalculation,
      decision,
    );

  const narrative =
    buildExecutionOutcomeEvaluationNarrative(
      context,
      scoreCalculation,
      decision,
      recommendation,
    );

  const achievedMetrics =
    context.metrics.filter(
      (metric) => metric.achieved,
    ).length;

  const missedMandatoryMetrics =
    context.metrics.filter(
      (metric) =>
        metric.mandatory &&
        !metric.achieved,
    ).length;

  const realizedBenefits =
    context.benefits.filter(
      (benefit) => benefit.realized,
    ).length;

  const unrealizedStrategicBenefits =
    context.benefits.filter(
      (benefit) =>
        benefit.strategic &&
        !benefit.realized,
    ).length;

  const achievedObjectives =
    context.objectives.filter(
      (objective) => objective.achieved,
    ).length;

  const missedMandatoryObjectives =
    context.objectives.filter(
      (objective) =>
        objective.mandatory &&
        !objective.achieved,
    ).length;

  const verifiedEvidence =
    context.evidence.filter(
      (evidence) => evidence.verified,
    ).length;

  const activeMaterializedRisks =
    context.risks.filter(
      (risk) =>
        risk.active &&
        risk.materialized,
    ).length;

  const result =
    createExecutionOutcomeEvaluationResult({
      organizationId:
        context.organizationId,

      evaluationRequestId:
        context.evaluationRequestId,

      executionId:
        context.executionId,

      outcomeScore:
        scoreCalculation.outcomeScore,

      confidenceScore:
        scoreCalculation.confidenceScore,

      status:
        decision.status,

      severity:
        decision.severity,

      decision:
        decision.decision,

      valueRealizationRate:
        scoreCalculation.valueRealizationRate,

      costVarianceRate:
        scoreCalculation.costVarianceRate,

      durationVarianceRate:
        scoreCalculation.durationVarianceRate,

      achievedMetrics,
      missedMandatoryMetrics,

      realizedBenefits,
      unrealizedStrategicBenefits,

      achievedObjectives,
      missedMandatoryObjectives,

      verifiedEvidence,
      activeMaterializedRisks,

      executiveClosureRequired:
        context.requireExecutiveClosure,

      executiveSummary:
        narrative.summary,

      recommendedAction:
        narrative.closureGuidance,

      evaluatedAt:
        context.evaluatedAt,
    });

  return {
    context,
    scoreCalculation,
    decision,
    recommendation,
    narrative,
    result,
  };
}

export class ExecutionOutcomeEvaluationIntelligenceService {
  evaluate(
    input: CreateExecutionOutcomeEvaluationContextInput,
  ): ExecutionOutcomeEvaluationServiceOutput {
    return evaluateExecutionOutcome(input);
  }
}
