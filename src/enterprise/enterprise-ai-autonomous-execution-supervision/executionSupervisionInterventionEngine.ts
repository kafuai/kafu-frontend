import { ExecutionSupervisionContext } from "./executionSupervisionContext";
import { ExecutionSupervisionScoreCalculation } from "./executionSupervisionScoreCalculator";
import {
  ExecutionSupervisionIntervention,
  ExecutionSupervisionSeverity,
} from "./executionSupervisionTypes";

export interface ExecutionSupervisionInterventionEvaluation {
  intervention:
    ExecutionSupervisionIntervention;

  severity:
    ExecutionSupervisionSeverity;

  autonomousInterventionAllowed: boolean;
}

export function determineExecutionSupervisionIntervention(
  context: ExecutionSupervisionContext,
  scoreCalculation: ExecutionSupervisionScoreCalculation,
): ExecutionSupervisionInterventionEvaluation {
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

  const nonCompliantPolicies =
    context.policies.filter(
      (policy) =>
        policy.mandatory &&
        !policy.compliant,
    );

  const evaluatedAt =
    context.evaluatedAt;

  if (
    nonCompliantPolicies.length > 0 &&
    context.executiveEscalationAvailable
  ) {
    return {
      severity: "critical",
      autonomousInterventionAllowed: false,

      intervention: {
        interventionType: "escalate",
        reason:
          "Mandatory policy non-compliance requires immediate executive review.",
        priority: "critical",
        requiresExecutiveApproval: true,
        recommendedAt: evaluatedAt,
      },
    };
  }

  if (
    criticalSignals.length > 1 &&
    context.rollbackAvailable
  ) {
    return {
      severity: "critical",
      autonomousInterventionAllowed:
        context.autonomousInterventionEnabled,

      intervention: {
        interventionType: "rollback",
        reason:
          "Multiple critical execution signals indicate an unacceptable operational condition.",
        priority: "critical",
        requiresExecutiveApproval:
          !context.autonomousInterventionEnabled,
        recommendedAt: evaluatedAt,
      },
    };
  }

  if (
    criticalSignals.length > 0 ||
    blockingConstraints.length > 0 ||
    scoreCalculation.supervisionScore < 35
  ) {
    return {
      severity: "critical",
      autonomousInterventionAllowed:
        context.autonomousInterventionEnabled &&
        context.pauseAvailable,

      intervention: {
        interventionType:
          context.pauseAvailable
            ? "pause"
            : "escalate",

        reason:
          "Critical execution conditions require immediate containment and supervisory review.",

        priority: "critical",

        requiresExecutiveApproval:
          !context.autonomousInterventionEnabled ||
          !context.pauseAvailable,

        recommendedAt: evaluatedAt,
      },
    };
  }

  if (
    scoreCalculation.supervisionScore < 55 ||
    scoreCalculation.progressVariance <= -20
  ) {
    return {
      severity: "high",
      autonomousInterventionAllowed:
        context.autonomousInterventionEnabled,

      intervention: {
        interventionType: "reassign",
        reason:
          "Execution performance and progress require resource or ownership reallocation.",
        priority: "high",
        requiresExecutiveApproval: false,
        recommendedAt: evaluatedAt,
      },
    };
  }

  if (
    scoreCalculation.supervisionScore < 75 ||
    scoreCalculation.progressVariance <= -10 ||
    activeSignals.length > 0
  ) {
    return {
      severity: "medium",
      autonomousInterventionAllowed:
        context.autonomousInterventionEnabled,

      intervention: {
        interventionType: "adjust",
        reason:
          "Execution remains recoverable but requires corrective operational adjustments.",
        priority: "medium",
        requiresExecutiveApproval: false,
        recommendedAt: evaluatedAt,
      },
    };
  }

  return {
    severity: "low",
    autonomousInterventionAllowed: true,

    intervention: {
      interventionType: "continue",
      reason:
        "Execution remains stable and within acceptable supervisory thresholds.",
      priority: "low",
      requiresExecutiveApproval: false,
      recommendedAt: evaluatedAt,
    },
  };
}
