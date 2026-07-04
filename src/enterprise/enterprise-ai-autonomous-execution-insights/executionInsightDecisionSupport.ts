import {
  ExecutionInsight,
  ExecutionInsightSeverity,
} from "./executionInsightTypes";

export interface ExecutionInsightDecisionSupport {
  readonly shouldEscalate: boolean;
  readonly shouldAutoRemediate: boolean;
  readonly recommendedAction: string;
  readonly rationale: string;
}

const urgentSeverities: ReadonlySet<ExecutionInsightSeverity> = new Set([
  "high",
  "critical",
]);

export const buildExecutionInsightDecisionSupport = (
  insight: ExecutionInsight,
): ExecutionInsightDecisionSupport => {
  const shouldEscalate =
    urgentSeverities.has(insight.severity) && insight.confidence >= 0.75;

  const shouldAutoRemediate =
    insight.severity === "critical" && insight.confidence >= 0.85;

  return {
    shouldEscalate,
    shouldAutoRemediate,
    recommendedAction: insight.recommendation,
    rationale: `Severity ${insight.severity} with confidence ${insight.confidence} supports ${
      shouldAutoRemediate
        ? "autonomous remediation."
        : shouldEscalate
          ? "human escalation."
          : "continued monitoring."
    }`,
  };
};