import { GovernanceRule } from "./governanceRules";
import { GovernanceSubject } from "./governanceTypes";

export function evaluateGovernanceRules(
  subject: GovernanceSubject,
  rules: GovernanceRule[],
): GovernanceRule[] {
  return rules.filter(
    (rule) => rule.enabled && rule.evaluate(subject),
  );
}