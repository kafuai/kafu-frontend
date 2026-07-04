import { GovernanceRuleRegistry } from "./governanceRuleRegistry";
import { GovernanceRule } from "./governanceRules";
import { GovernanceSubject } from "./governanceTypes";
import { evaluateGovernanceRules } from "./governanceRuleEvaluator";

export class GovernanceRuleEngine {
  private readonly registry = new GovernanceRuleRegistry();

  registerRule(rule: GovernanceRule): void {
    this.registry.register(rule);
  }

  unregisterRule(ruleId: string): boolean {
    return this.registry.unregister(ruleId);
  }

  evaluate(subject: GovernanceSubject): GovernanceRule[] {
    return evaluateGovernanceRules(subject, this.registry.list());
  }

  listRules(): GovernanceRule[] {
    return this.registry.list();
  }
}