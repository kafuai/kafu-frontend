import { AIAutonomousGovernancePolicy } from "./aiAutonomousGovernancePolicy";
import { AIAutonomousGovernanceRiskAssessment } from "./aiAutonomousGovernanceRisk";
import {
  AIAutonomousGovernanceControlType,
  AIAutonomousGovernanceDecision,
} from "./aiAutonomousGovernanceTypes";

export interface AIAutonomousGovernanceDecisionRecord {
  executionId: string;
  decision: AIAutonomousGovernanceDecision;
  riskAssessment: AIAutonomousGovernanceRiskAssessment;
  appliedPolicies: AIAutonomousGovernancePolicy[];
  requiredControls: AIAutonomousGovernanceControlType[];
  reasons: string[];
  decidedAt: Date;
}

export function createAIAutonomousGovernanceDecisionRecord(
  executionId: string,
  riskAssessment: AIAutonomousGovernanceRiskAssessment,
  appliedPolicies: AIAutonomousGovernancePolicy[],
): AIAutonomousGovernanceDecisionRecord {
  const requiredControls = Array.from(
    new Set(appliedPolicies.flatMap((policy) => policy.requiredControls)),
  );

  const hasBlockingPolicy = appliedPolicies.some(
    (policy) => policy.severity === "blocking",
  );

  const hasMandatoryPolicy = appliedPolicies.some(
    (policy) => policy.severity === "mandatory",
  );

  const decision: AIAutonomousGovernanceDecision = hasBlockingPolicy
    ? "blocked"
    : riskAssessment.riskLevel === "critical"
      ? "requires_human_review"
      : hasMandatoryPolicy || requiredControls.length > 0
        ? "approved_with_controls"
        : "approved";

  return {
    executionId,
    decision,
    riskAssessment,
    appliedPolicies,
    requiredControls,
    reasons: buildAIAutonomousGovernanceDecisionReasons(
      riskAssessment,
      appliedPolicies,
      decision,
    ),
    decidedAt: new Date(),
  };
}

function buildAIAutonomousGovernanceDecisionReasons(
  riskAssessment: AIAutonomousGovernanceRiskAssessment,
  appliedPolicies: AIAutonomousGovernancePolicy[],
  decision: AIAutonomousGovernanceDecision,
): string[] {
  return [
    `Governance decision: ${decision}.`,
    `Risk level: ${riskAssessment.riskLevel}.`,
    `Risk score: ${riskAssessment.score}.`,
    `Applied policies: ${appliedPolicies.length}.`,
    ...riskAssessment.reasons,
  ];
}