import { ExecutionSupervisionContext } from "./executionSupervisionContext";
import { ExecutionSupervisionInterventionEvaluation } from "./executionSupervisionInterventionEngine";
import { ExecutionSupervisionScoreCalculation } from "./executionSupervisionScoreCalculator";
import {
  ExecutionSupervisionSeverity,
  ExecutionSupervisionStatus,
} from "./executionSupervisionTypes";

export interface ExecutionSupervisionDecision {
  status: ExecutionSupervisionStatus;
  severity: ExecutionSupervisionSeverity;
  executiveSummary: string;
  recommendedAction: string;
}

export function buildExecutionSupervisionDecision(
  context: ExecutionSupervisionContext,
  scoreCalculation: ExecutionSupervisionScoreCalculation,
  interventionEvaluation: ExecutionSupervisionInterventionEvaluation,
): ExecutionSupervisionDecision {
  const intervention =
    interventionEvaluation.intervention;

  if (
    intervention.interventionType === "terminate"
  ) {
    return {
      status: "terminated",
      severity: "critical",
      executiveSummary:
        "Execution supervision determined that continuation is no longer acceptable.",
      recommendedAction:
        "Terminate execution, secure all affected resources, and initiate executive incident review.",
    };
  }

  if (
    intervention.interventionType === "rollback"
  ) {
    return {
      status: "intervention_required",
      severity: "critical",
      executiveSummary:
        `Execution requires rollback with a supervision score of ${scoreCalculation.supervisionScore}%.`,
      recommendedAction:
        "Initiate the approved rollback procedure and escalate the execution incident.",
    };
  }

  if (
    intervention.interventionType === "pause"
  ) {
    return {
      status: "paused",
      severity: "critical",
      executiveSummary:
        `Execution must be paused due to critical supervisory findings. Current score: ${scoreCalculation.supervisionScore}%.`,
      recommendedAction:
        "Pause execution immediately, contain operational risk, and perform supervisory reassessment.",
    };
  }

  if (
    intervention.interventionType === "escalate"
  ) {
    return {
      status: "escalated",
      severity:
        interventionEvaluation.severity,

      executiveSummary:
        "Execution requires executive escalation because supervisory thresholds or mandatory policies were breached.",

      recommendedAction:
        "Escalate the execution state and supporting evidence to the responsible executive authority.",
    };
  }

  if (
    intervention.interventionType === "reassign"
  ) {
    return {
      status: "intervention_required",
      severity: "high",

      executiveSummary:
        `Execution is materially underperforming with a progress variance of ${scoreCalculation.progressVariance}%.`,

      recommendedAction:
        "Reassign ownership or resources and establish an immediate recovery checkpoint.",
    };
  }

  if (
    intervention.interventionType === "adjust"
  ) {
    return {
      status: "attention_required",
      severity: "medium",

      executiveSummary:
        `Execution requires corrective adjustments. Supervision score: ${scoreCalculation.supervisionScore}%.`,

      recommendedAction:
        "Apply the recommended operational adjustments and increase supervisory monitoring frequency.",
    };
  }

  return {
    status: "stable",
    severity: "low",

    executiveSummary:
      `Execution "${context.executionTitle}" remains stable with a supervision score of ${scoreCalculation.supervisionScore}%.`,

    recommendedAction:
      "Continue execution under the current operating plan and supervision cadence.",
  };
}
