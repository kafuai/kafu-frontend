import { GovernanceRule } from "./governanceRules";

export class GovernanceRuleRegistry {
  private readonly rules = new Map<string, GovernanceRule>();

  register(rule: GovernanceRule): void {
    this.rules.set(rule.id, rule);
  }

  unregister(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  list(): GovernanceRule[] {
    return [...this.rules.values()];
  }
}