import {
  EnterpriseRuleCondition,
  EnterpriseRuleDefinition,
} from "./rule-definition";
import {
  EnterpriseRuleEvaluationContext,
  EnterpriseRuleEvaluationResult,
} from "./rule-types";

export class EnterpriseRuleEvaluator {
  evaluate(
    rule: EnterpriseRuleDefinition,
    context: EnterpriseRuleEvaluationContext,
  ): EnterpriseRuleEvaluationResult {
    if (rule.status !== "active") {
      return {
        ruleId: rule.id,
        outcome: "skipped",
        matched: false,
        actions: [],
        reason: `Rule status is ${rule.status}`,
        evaluatedAt: new Date(),
      };
    }

    try {
      const matched = rule.conditions.every((condition) =>
        this.evaluateCondition(condition, context),
      );

      return {
        ruleId: rule.id,
        outcome: matched ? "matched" : "not_matched",
        matched,
        actions: matched ? rule.actions.map((action) => action.type) : [],
        reason: matched
          ? "All rule conditions matched"
          : "One or more rule conditions did not match",
        evaluatedAt: new Date(),
      };
    } catch (error) {
      return {
        ruleId: rule.id,
        outcome: "error",
        matched: false,
        actions: [],
        reason:
          error instanceof Error
            ? error.message
            : "Unknown rule evaluation error",
        evaluatedAt: new Date(),
      };
    }
  }

  evaluateMany(
    rules: EnterpriseRuleDefinition[],
    context: EnterpriseRuleEvaluationContext,
  ): EnterpriseRuleEvaluationResult[] {
    return rules.map((rule) => this.evaluate(rule, context));
  }

  private evaluateCondition(
    condition: EnterpriseRuleCondition,
    context: EnterpriseRuleEvaluationContext,
  ): boolean {
    const actual = this.resolveField(condition.field, context);
    const expected = condition.value;

    switch (condition.operator) {
      case "equals":
        return actual === expected;
      case "not_equals":
        return actual !== expected;
      case "contains":
        return typeof actual === "string" && String(actual).includes(String(expected));
      case "not_contains":
        return typeof actual === "string" && !String(actual).includes(String(expected));
      case "greater_than":
        return Number(actual) > Number(expected);
      case "greater_than_or_equal":
        return Number(actual) >= Number(expected);
      case "less_than":
        return Number(actual) < Number(expected);
      case "less_than_or_equal":
        return Number(actual) <= Number(expected);
      case "exists":
        return actual !== undefined && actual !== null;
      case "not_exists":
        return actual === undefined || actual === null;
      case "in":
        return Array.isArray(expected) && expected.includes(actual);
      case "not_in":
        return Array.isArray(expected) && !expected.includes(actual);
      default:
        return false;
    }
  }

  private resolveField(
    field: string,
    context: EnterpriseRuleEvaluationContext,
  ): unknown {
    if (field in context) {
      return context[field as keyof EnterpriseRuleEvaluationContext];
    }

    return context.attributes[field];
  }
}