import { AIDecisionImpactAnalysis } from "./aiDecisionImpactAnalysis";
import { AIDecisionOutcomeResolution } from "./aiDecisionOutcome";
import { AIDecisionRiskAssessment } from "./aiDecisionRiskAssessment";

export type AIDecisionGovernanceStatus =
  | "approved"
  | "requires_review"
  | "blocked";

export interface AIDecisionGovernanceAssessment {
  decisionId: string;
  status: AIDecisionGovernanceStatus;
  requiresHumanReview: boolean;
  reasons: string[];
  assessedAt: Date;
}

export function assessAIDecisionGovernance(input: {
  decisionId: string;
  outcome: AIDecisionOutcomeResolution;
  risk?: AIDecisionRiskAssessment;
  impact?: AIDecisionImpactAnalysis;
}): AIDecisionGovernanceAssessment {
  const reasons: string[] = [];

  if (input.outcome.requiresHumanApproval) {
    reasons.push("Decision outcome requires human approval.");
  }

  if (input.outcome.outcome === "request_more_data") {
    reasons.push("Decision requires more data before execution.");
  }

  if (input.outcome.outcome === "defer") {
    reasons.push("Decision was deferred due to policy or confidence constraints.");
  }

  if (input.outcome.outcome === "escalate") {
    reasons.push("Decision requires escalation.");
  }

  if (input.risk?.riskLevel === "high" || input.risk?.riskLevel === "severe") {
    reasons.push(`Risk level requires governance attention: ${input.risk.riskLevel}.`);
  }

  if (input.impact?.overallImpact === "critical") {
    reasons.push("Critical enterprise impact requires human review.");
  }

  const requiresHumanReview = reasons.length > 0;

  return {
    decisionId: input.decisionId,
    status:
      input.outcome.outcome === "escalate"
        ? "blocked"
        : requiresHumanReview
          ? "requires_review"
          : "approved",
    requiresHumanReview,
    reasons: reasons.length > 0 ? reasons : ["Decision passed governance checks."],
    assessedAt: new Date(),
  };
}