import {
  createExecutionSupervisionContext,
  CreateExecutionSupervisionContextInput,
  ExecutionSupervisionContext,
} from "./executionSupervisionContext";

import {
  calculateExecutionSupervisionScore,
  ExecutionSupervisionScoreCalculation,
} from "./executionSupervisionScoreCalculator";

import {
  determineExecutionSupervisionIntervention,
  ExecutionSupervisionInterventionEvaluation,
} from "./executionSupervisionInterventionEngine";

import {
  buildExecutionSupervisionDecision,
  ExecutionSupervisionDecision,
} from "./executionSupervisionDecisionEngine";

import {
  buildExecutionSupervisionNarrative,
  ExecutionSupervisionNarrative,
} from "./executionSupervisionNarrativeBuilder";

import {
  createExecutionSupervisionResult,
  ExecutionSupervisionResult,
} from "./executionSupervisionResult";

export interface ExecutionSupervisionServiceOutput {
  context: ExecutionSupervisionContext;
  scoreCalculation: ExecutionSupervisionScoreCalculation;
  interventionEvaluation: ExecutionSupervisionInterventionEvaluation;
  decision: ExecutionSupervisionDecision;
  narrative: ExecutionSupervisionNarrative;
  result: ExecutionSupervisionResult;
}

export function evaluateExecutionSupervision(
  input: CreateExecutionSupervisionContextInput,
): ExecutionSupervisionServiceOutput {
  const context =
    createExecutionSupervisionContext(input);

  const scoreCalculation =
    calculateExecutionSupervisionScore(context);

  const interventionEvaluation =
    determineExecutionSupervisionIntervention(
      context,
      scoreCalculation,
    );

  const decision =
    buildExecutionSupervisionDecision(
      context,
      scoreCalculation,
      interventionEvaluation,
    );

  const narrative =
    buildExecutionSupervisionNarrative(
      context,
      scoreCalculation,
      interventionEvaluation,
      decision,
    );

  const activeSignals =
    context.signals.filter(
      (signal) => !signal.resolved,
    );

  const criticalSignals =
    activeSignals.filter(
      (signal) =>
        signal.severity === "critical",
    );

  const blockingConstraints =
    context.constraints.filter(
      (constraint) =>
        constraint.active &&
        constraint.blocking,
    );

  const overdueCheckpoints =
    context.checkpoints.filter(
      (checkpoint) =>
        checkpoint.overdue &&
        !checkpoint.completed,
    );

  const nonCompliantPolicies =
    context.policies.filter(
      (policy) =>
        policy.mandatory &&
        !policy.compliant,
    );

  const result =
    createExecutionSupervisionResult({
      organizationId: context.organizationId,
      supervisionRequestId:
        context.supervisionRequestId,
      executionId: context.executionId,

      supervisionScore:
        scoreCalculation.supervisionScore,

      confidenceScore:
        scoreCalculation.confidenceScore,

      status: decision.status,
      severity: decision.severity,

      progressVariance:
        scoreCalculation.progressVariance,

      activeSignals:
        activeSignals.length,

      criticalSignals:
        criticalSignals.length,

      blockingConstraints:
        blockingConstraints.length,

      overdueCheckpoints:
        overdueCheckpoints.length,

      nonCompliantPolicies:
        nonCompliantPolicies.length,

      recommendedIntervention:
        interventionEvaluation.intervention,

      interventionType:
        interventionEvaluation.intervention.interventionType,

      autonomousInterventionAllowed:
        interventionEvaluation.autonomousInterventionAllowed,

      executiveSummary:
        narrative.summary,

      recommendedAction:
        narrative.executiveGuidance,

      evaluatedAt:
        context.evaluatedAt,
    });

  return {
    context,
    scoreCalculation,
    interventionEvaluation,
    decision,
    narrative,
    result,
  };
}

export class ExecutionSupervisionIntelligenceService {
  evaluate(
    input: CreateExecutionSupervisionContextInput,
  ): ExecutionSupervisionServiceOutput {
    return evaluateExecutionSupervision(input);
  }
}
