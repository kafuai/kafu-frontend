import { GovernanceEngine } from "./governanceEngine";
import { GovernanceEvaluationResult } from "./governanceEvaluation";
import { GovernancePolicy } from "./governancePolicy";
import { GovernanceSubject } from "./governanceTypes";

export function runGovernancePipeline(
  subject: GovernanceSubject,
  policies: GovernancePolicy[],
): GovernanceEvaluationResult {
  const engine = new GovernanceEngine();

  for (const policy of policies) {
    engine.registerPolicy(policy);
  }

  return engine.evaluate(subject);
}