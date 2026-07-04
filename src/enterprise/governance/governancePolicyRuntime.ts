import { GovernanceEngine } from "./governanceEngine";
import { GovernancePolicy } from "./governancePolicy";
import { GovernanceSubject } from "./governanceTypes";

export function runGovernancePolicyEvaluation(
  policies: GovernancePolicy[],
  subject: GovernanceSubject,
) {
  const engine = new GovernanceEngine();

  for (const policy of policies) {
    engine.registerPolicy(policy);
  }

  return engine.evaluate(subject);
}