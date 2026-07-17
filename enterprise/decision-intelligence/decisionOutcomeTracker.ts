import {
  EnterpriseDecisionImpact,
  EnterpriseDecisionPriority,
} from "./decisionIntelligenceTypes";

export type DecisionOutcomeStatus =
  | "not-started"
  | "on-track"
  | "at-risk"
  | "off-track"
  | "completed";

export interface DecisionOutcomeMetric {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  higherIsBetter: boolean;
}

export interface DecisionOutcomeTrackerInput {
  decisionId: string;
  decisionTitle: string;
  priority: EnterpriseDecisionPriority;
  expectedImpact: EnterpriseDecisionImpact;
  executionProgress: number;
  elapsedTimePercentage: number;
  metrics: DecisionOutcomeMetric[];
  blockedActions: number;
  overdueActions: number;
}

export interface DecisionOutcomeTrackerResult {
  decisionId: string;
  decisionTitle: string;
  status: DecisionOutcomeStatus;
  progressScore: number;
  valueRealizationScore: number;
  executionHealthScore: number;
  requiresIntervention: boolean;
  executiveSummary: string;
  recommendedAction: string;
}

function normalizeScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateMetricPerformance(
  metric: DecisionOutcomeMetric,
): number {
  if (metric.targetValue === 0) {
    return metric.currentValue === 0 ? 100 : 0;
  }

  const ratio = metric.higherIsBetter
    ? metric.currentValue / metric.targetValue
    : metric.targetValue / Math.max(metric.currentValue, 0.01);

  return normalizeScore(ratio * 100);
}

export function trackDecisionOutcome(
  input: DecisionOutcomeTrackerInput,
): DecisionOutcomeTrackerResult {
  const progressScore = normalizeScore(input.executionProgress);

  const valueRealizationScore =
    input.metrics.length > 0
      ? normalizeScore(
          input.metrics.reduce(
            (total, metric) =>
              total + calculateMetricPerformance(metric),
            0,
          ) / input.metrics.length,
        )
      : progressScore;

  const scheduleVariance =
    progressScore - normalizeScore(input.elapsedTimePercentage);

  const executionHealthScore = normalizeScore(
    progressScore * 0.35 +
      valueRealizationScore * 0.4 +
      Math.max(0, 100 + scheduleVariance) * 0.25 -
      input.blockedActions * 8 -
      input.overdueActions * 4,
  );

  let status: DecisionOutcomeStatus;

  if (
    progressScore >= 100 &&
    valueRealizationScore >= 80
  ) {
    status = "completed";
  } else if (
    input.blockedActions > 0 ||
    executionHealthScore < 40
  ) {
    status = "off-track";
  } else if (
    input.overdueActions > 0 ||
    executionHealthScore < 70
  ) {
    status = "at-risk";
  } else if (progressScore > 0) {
    status = "on-track";
  } else {
    status = "not-started";
  }

  const requiresIntervention =
    status === "off-track" ||
    (status === "at-risk" &&
      (input.priority === "critical" ||
        input.priority === "high"));

  const executiveSummary =
    status === "completed"
      ? `${input.decisionTitle} has completed execution with ${valueRealizationScore}% measured value realization.`
      : `${input.decisionTitle} is ${status}, with ${progressScore}% execution progress, ${valueRealizationScore}% value realization, and ${executionHealthScore}% execution health.`;

  const recommendedAction =
    status === "off-track"
      ? "Escalate immediately, resolve blocked actions, and reset the accountable recovery plan."
      : status === "at-risk"
        ? "Review overdue actions, validate assumptions, and assign corrective actions."
        : status === "completed"
          ? "Confirm realized value, document lessons learned, and formally close the decision."
          : status === "not-started"
            ? "Assign the execution owner and activate the first approved action."
            : "Continue execution and monitor value realization against the approved targets.";

  return {
    decisionId: input.decisionId,
    decisionTitle: input.decisionTitle,
    status,
    progressScore,
    valueRealizationScore,
    executionHealthScore,
    requiresIntervention,
    executiveSummary,
    recommendedAction,
  };
}
