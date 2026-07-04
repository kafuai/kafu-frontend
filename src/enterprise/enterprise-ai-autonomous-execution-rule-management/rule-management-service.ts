import { EnterpriseRuleDefinition } from "./rule-definition";
import { EnterpriseRuleAudit } from "./rule-audit";
import { EnterpriseRuleEnforcement } from "./rule-enforcement";
import { EnterpriseRuleEvaluator } from "./rule-evaluator";
import { EnterpriseRuleRegistry } from "./rule-registry";
import {
  EnterpriseRuleEnforcementDecision,
} from "./rule-enforcement";
import { EnterpriseRuleEvaluationContext } from "./rule-types";

export class EnterpriseRuleManagementService {
  constructor(
    private readonly registry = new EnterpriseRuleRegistry(),
    private readonly evaluator = new EnterpriseRuleEvaluator(),
    private readonly enforcement = new EnterpriseRuleEnforcement(),
    private readonly audit = new EnterpriseRuleAudit(),
  ) {}

  register(rule: EnterpriseRuleDefinition): EnterpriseRuleDefinition {
    return this.registry.register(rule);
  }

  evaluate(
    context: EnterpriseRuleEvaluationContext,
  ): EnterpriseRuleEnforcementDecision {
    const rules = this.registry.list();
    const results = this.evaluator.evaluateMany(rules, context);

    for (const result of results) {
      this.audit.record(context, result);
    }

    return this.enforcement.enforce(results);
  }

  getRegistry(): EnterpriseRuleRegistry {
    return this.registry;
  }

  getAudit(): EnterpriseRuleAudit {
    return this.audit;
  }
}