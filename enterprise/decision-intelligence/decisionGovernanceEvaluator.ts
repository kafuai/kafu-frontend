import {
  EnterpriseDecisionConfidence,
  EnterpriseDecisionRecord,
} from "./decisionIntelligenceTypes";

export type DecisionGovernanceStatus =
  | "compliant"
  | "review-required"
  | "non-compliant";

export interface DecisionGovernanceCheck {
  id: string;
  title: string;
  passed: boolean;
  message: string;
}

export interface DecisionGovernanceResult {
  decisionId: string;
  status: DecisionGovernanceStatus;
  governanceScore: number;
  checks: DecisionGovernanceCheck[];
  requiresExecutiveReview: boolean;
  summary: string;
}

function confidenceScore(
  confidence: EnterpriseDecisionConfidence,
): number {
  switch (confidence) {
    case "high":
      return 100;
    case "medium":
      return 65;
    case "low":
      return 30;
  }
}

export function evaluateDecisionGovernance(
  decision: EnterpriseDecisionRecord,
): DecisionGovernanceResult {
  const checks: DecisionGovernanceCheck[] = [
    {
      id: "decision-owner",
      title: "Accountable decision owner",
      passed: Boolean(
        decision.recommendation?.recommendedOwner,
      ),
      message: decision.recommendation?.recommendedOwner
        ? `Accountability is assigned to ${decision.recommendation.recommendedOwner}.`
        : "No accountable owner is assigned to the decision.",
    },
    {
      id: "decision-evidence",
      title: "Sufficient supporting evidence",
      passed:
        decision.evidence.length >= 2 &&
        confidenceScore(decision.confidence) >= 65,
      message:
        decision.evidence.length >= 2
          ? `${decision.evidence.length} evidence records support this decision.`
          : "The decision requires additional enterprise evidence.",
    },
    {
      id: "decision-options",
      title: "Alternative options assessed",
      passed: decision.options.length >= 2,
      message:
        decision.options.length >= 2
          ? `${decision.options.length} decision options were evaluated.`
          : "At least two viable decision options should be evaluated.",
    },
    {
      id: "decision-risks",
      title: "Critical risks mitigated",
      passed: !decision.risks.some(
        (risk) =>
          risk.severity === "critical" &&
          !risk.mitigation,
      ),
      message: decision.risks.some(
        (risk) =>
          risk.severity === "critical" &&
          !risk.mitigation,
      )
        ? "One or more critical risks do not have an approved mitigation."
        : "No unmitigated critical risk is blocking governance approval.",
    },
    {
      id: "decision-recommendation",
      title: "Formal recommendation available",
      passed: Boolean(decision.recommendation),
      message: decision.recommendation
        ? "A formal enterprise recommendation has been generated."
        : "The decision does not yet have a formal recommendation.",
    },
  ];

  const passedChecks = checks.filter(
    (check) => check.passed,
  ).length;

  const governanceScore = Math.round(
    (passedChecks / checks.length) * 100,
  );

  const failedCriticalChecks = checks.filter(
    (check) =>
      !check.passed &&
      (check.id === "decision-owner" ||
        check.id === "decision-risks" ||
        check.id === "decision-recommendation"),
  );

  const status: DecisionGovernanceStatus =
    failedCriticalChecks.length > 0
      ? "non-compliant"
      : governanceScore < 100
        ? "review-required"
        : "compliant";

  const requiresExecutiveReview =
    decision.priority === "critical" ||
    decision.priority === "high" ||
    status !== "compliant";

  return {
    decisionId: decision.id,
    status,
    governanceScore,
    checks,
    requiresExecutiveReview,
    summary:
      status === "compliant"
        ? "The decision satisfies the required enterprise governance controls and is ready for approval."
        : status === "review-required"
          ? "The decision satisfies the critical governance controls but requires additional review before approval."
          : "The decision does not satisfy mandatory enterprise governance controls and cannot proceed to execution.",
  };
}
