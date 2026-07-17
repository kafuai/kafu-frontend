import { ExecutionSupervisionContext } from "./executionSupervisionContext";

export interface ExecutionSupervisionScoreCalculation {
  supervisionScore: number;
  confidenceScore: number;
  progressVariance: number;

  healthContribution: number;
  performanceContribution: number;
  qualityContribution: number;
  resourceContribution: number;
  timelineContribution: number;
  complianceContribution: number;
  riskContribution: number;
}

export function calculateExecutionSupervisionScore(
  context: ExecutionSupervisionContext,
): ExecutionSupervisionScoreCalculation {
  const progressVariance =
    context.currentProgress -
    context.expectedProgress;

  const healthContribution =
    context.executionHealthScore * 0.2;

  const performanceContribution =
    context.performanceScore * 0.17;

  const qualityContribution =
    context.qualityScore * 0.15;

  const resourceContribution =
    context.resourceStabilityScore * 0.12;

  const timelineContribution =
    context.timelineAdherenceScore * 0.12;

  const complianceContribution =
    context.complianceScore * 0.14;

  const riskContribution =
    (100 - context.riskExposureScore) * 0.1;

  let supervisionScore =
    healthContribution +
    performanceContribution +
    qualityContribution +
    resourceContribution +
    timelineContribution +
    complianceContribution +
    riskContribution;

  const activeSignals = context.signals.filter(
    (signal) =>
      !signal.resolved,
  );

  const criticalSignals = activeSignals.filter(
    (signal) =>
      signal.severity === "critical",
  );

  const highSignals = activeSignals.filter(
    (signal) =>
      signal.severity === "high",
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

  supervisionScore -= Math.min(
    30,
    criticalSignals.length * 15,
  );

  supervisionScore -= Math.min(
    20,
    highSignals.length * 7,
  );

  supervisionScore -= Math.min(
    25,
    blockingConstraints.length * 12,
  );

  supervisionScore -= Math.min(
    15,
    overdueCheckpoints.length * 5,
  );

  supervisionScore -= Math.min(
    30,
    nonCompliantPolicies.length * 15,
  );

  if (progressVariance < 0) {
    supervisionScore -= Math.min(
      20,
      Math.abs(progressVariance) * 0.5,
    );
  }

  const evidenceCount =
    context.signals.length +
    context.constraints.length +
    context.checkpoints.length +
    context.policies.length;

  const confidenceScore = Math.min(
    100,
    Math.round(
      55 +
      Math.min(25, evidenceCount * 3) +
      (
        context.executionHealthScore +
        context.performanceScore +
        context.qualityScore
      ) / 15,
    ),
  );

  return {
    supervisionScore: Math.max(
      0,
      Math.min(
        100,
        Math.round(supervisionScore),
      ),
    ),

    confidenceScore: Math.max(
      0,
      Math.min(100, confidenceScore),
    ),

    progressVariance: Math.round(
      progressVariance,
    ),

    healthContribution: Math.round(
      healthContribution,
    ),

    performanceContribution: Math.round(
      performanceContribution,
    ),

    qualityContribution: Math.round(
      qualityContribution,
    ),

    resourceContribution: Math.round(
      resourceContribution,
    ),

    timelineContribution: Math.round(
      timelineContribution,
    ),

    complianceContribution: Math.round(
      complianceContribution,
    ),

    riskContribution: Math.round(
      riskContribution,
    ),
  };
}
