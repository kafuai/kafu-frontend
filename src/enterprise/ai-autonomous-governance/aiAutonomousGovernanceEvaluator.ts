import { createAIAutonomousGovernanceDecisionRecord } from "./aiAutonomousGovernanceDecision";
import { AIAutonomousGovernancePolicy } from "./aiAutonomousGovernancePolicy";
import { matchAIAutonomousGovernancePolicies } from "./aiAutonomousGovernancePolicyMatcher";
import { assessAIAutonomousGovernanceRisk } from "./aiAutonomousGovernanceRisk";
import { AIAutonomousGovernanceContext } from "./aiAutonomousGovernanceTypes";

export function evaluateAIAutonomousGovernance(
  context: AIAutonomousGovernanceContext,
  policies: AIAutonomousGovernancePolicy[],
) {
  const riskAssessment = assessAIAutonomousGovernanceRisk(context);

  const appliedPolicies = matchAIAutonomousGovernancePolicies(
    context,
    riskAssessment,
    policies,
  );

  return createAIAutonomousGovernanceDecisionRecord(
    context.executionId,
    riskAssessment,
    appliedPolicies,
  );
}