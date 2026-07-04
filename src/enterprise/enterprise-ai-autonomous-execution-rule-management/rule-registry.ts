import { EnterpriseRuleDefinition } from "./rule-definition";
import { EnterpriseRuleId, EnterpriseRuleStatus } from "./rule-types";

export class EnterpriseRuleRegistry {
  private readonly rules = new Map<EnterpriseRuleId, EnterpriseRuleDefinition>();

  register(rule: EnterpriseRuleDefinition): EnterpriseRuleDefinition {
    if (this.rules.has(rule.id)) {
      throw new Error(`Enterprise rule already registered: ${rule.id}`);
    }

    this.rules.set(rule.id, rule);
    return rule;
  }

  upsert(rule: EnterpriseRuleDefinition): EnterpriseRuleDefinition {
    this.rules.set(rule.id, rule);
    return rule;
  }

  get(ruleId: EnterpriseRuleId): EnterpriseRuleDefinition | undefined {
    return this.rules.get(ruleId);
  }

  list(): EnterpriseRuleDefinition[] {
    return Array.from(this.rules.values());
  }

  listByStatus(status: EnterpriseRuleStatus): EnterpriseRuleDefinition[] {
    return this.list().filter((rule) => rule.status === status);
  }

  activate(ruleId: EnterpriseRuleId): EnterpriseRuleDefinition {
    return this.setStatus(ruleId, "active");
  }

  deactivate(ruleId: EnterpriseRuleId): EnterpriseRuleDefinition {
    return this.setStatus(ruleId, "inactive");
  }

  remove(ruleId: EnterpriseRuleId): boolean {
    return this.rules.delete(ruleId);
  }

  private setStatus(
    ruleId: EnterpriseRuleId,
    status: EnterpriseRuleStatus,
  ): EnterpriseRuleDefinition {
    const rule = this.rules.get(ruleId);

    if (!rule) {
      throw new Error(`Enterprise rule not found: ${ruleId}`);
    }

    const updated: EnterpriseRuleDefinition = {
      ...rule,
      status,
      updatedAt: new Date(),
      version: rule.version + 1,
    };

    this.rules.set(ruleId, updated);
    return updated;
  }
}