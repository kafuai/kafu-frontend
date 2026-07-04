import {
  AIAutonomousGovernancePolicy,
  isAIAutonomousGovernancePolicyApplicable,
} from "./aiAutonomousGovernancePolicy";
import { AIAutonomousGovernanceRiskAssessment } from "./aiAutonomousGovernanceRisk";
import {
  AIAutonomousGovernanceContext,
  AIAutonomousGovernanceRiskLevel,
} from "./aiAutonomousGovernanceTypes";

const riskRank: Record<AIAutonomousGovernanceRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function matchAIAutonomousGovernancePolicies(
  context: AIAutonomousGovernanceContext,
  riskAssessment: AIAutonomousGovernanceRiskAssessment,
  policies: AIAutonomousGovernancePolicy[],
): AIAutonomousGovernancePolicy[] {
  return policies.filter((policy) => {
    if (policy.organizationId !== context.organizationId) {
      return false;
    }

    if (!isAIAutonomousGovernancePolicyApplicable(policy, context.capabilityId)) {
      return false;
    }

    return (
      riskRank[riskAssessment.riskLevel] >= riskRank[policy.minimumRiskLevel]
    );
  });
}