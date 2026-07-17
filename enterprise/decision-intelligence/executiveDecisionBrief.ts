import {
  EnterpriseDecisionRecord,
} from "./decisionIntelligenceTypes";
import {
  DecisionGovernanceResult,
} from "./decisionGovernanceEvaluator";
import {
  DecisionExecutionPlan,
} from "./decisionExecutionPlanner";
import {
  DecisionOutcomeTrackerResult,
} from "./decisionOutcomeTracker";

export interface ExecutiveDecisionBriefInput {
  decision: EnterpriseDecisionRecord;
  governance: DecisionGovernanceResult;
  executionPlan?: DecisionExecutionPlan | null;
  outcome?: DecisionOutcomeTrackerResult | null;
}

export interface ExecutiveDecisionBriefResult {
  decisionId: string;
  title: string;
  headline: string;
  decisionSummary: string;
  governanceSummary: string;
  executionSummary: string;
  outcomeSummary: string;
  executiveAttentionRequired: boolean;
  recommendedExecutiveAction: string;
}

export function buildExecutiveDecisionBrief(
  input: ExecutiveDecisionBriefInput,
): ExecutiveDecisionBriefResult {
  const recommendation = input.decision.recommendation;

  const executiveAttentionRequired =
    input.decision.priority === "critical" ||
    input.governance.status !== "compliant" ||
    Boolean(input.executionPlan?.blocked) ||
    Boolean(input.outcome?.requiresIntervention);

  const headline = recommendation
    ? `${recommendation.title} — ${recommendation.confidence} confidence`
    : `${input.decision.title} requires a formal recommendation`;

  const decisionSummary = recommendation
    ? recommendation.executiveSummary
    : "The decision has been identified but does not yet have an approved enterprise recommendation.";

  const governanceSummary =
    `${input.governance.summary} Governance score: ${input.governance.governanceScore}%.`;

  const executionSummary = input.executionPlan
    ? input.executionPlan.blocked
      ? `Execution is blocked by ${input.executionPlan.blockingReasons.length} unresolved critical issue${input.executionPlan.blockingReasons.length === 1 ? "" : "s"}.`
      : `Execution planning is ready under ${input.executionPlan.accountableOwner ?? "an unassigned accountable owner"}.`
    : "No execution plan has been generated.";

  const outcomeSummary = input.outcome
    ? input.outcome.executiveSummary
    : "Execution outcome measurement has not started.";

  const recommendedExecutiveAction =
    input.outcome?.requiresIntervention
      ? input.outcome.recommendedAction
      : input.executionPlan?.blocked
        ? input.executionPlan.nextAction
        : input.governance.status !== "compliant"
          ? "Resolve the failed governance controls before approving execution."
          : recommendation?.recommendedNextAction ??
            "Generate and validate the formal enterprise recommendation.";

  return {
    decisionId: input.decision.id,
    title: `Executive Decision Brief: ${input.decision.title}`,
    headline,
    decisionSummary,
    governanceSummary,
    executionSummary,
    outcomeSummary,
    executiveAttentionRequired,
    recommendedExecutiveAction,
  };
}
