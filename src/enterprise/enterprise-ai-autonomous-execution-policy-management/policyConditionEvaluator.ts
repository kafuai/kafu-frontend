import {
  EnterpriseExecutionPolicy,
  EnterpriseExecutionPolicyCondition
} from "./policyTypes";
import { EnterpriseExecutionPolicyEvaluationContext } from "./policyEvaluationContext";

export function evaluateEnterpriseExecutionPolicy(
  policy: EnterpriseExecutionPolicy,
  context: EnterpriseExecutionPolicyEvaluationContext
): boolean {
  return policy.conditions.every(condition =>
    evaluateCondition(condition, context)
  );
}

function evaluateCondition(
  condition: EnterpriseExecutionPolicyCondition,
  context: EnterpriseExecutionPolicyEvaluationContext
): boolean {
  const value = context.runtime.metadata?.[condition.key];

  switch (condition.operator) {
    case "exists":
      return value !== undefined;

    case "equals":
      return value === condition.value;

    case "not_equals":
      return value !== condition.value;

    case "contains":
      return Array.isArray(value)
        ? value.includes(condition.value as never)
        : String(value ?? "").includes(String(condition.value));

    case "greater_than":
      return Number(value) > Number(condition.value);

    case "less_than":
      return Number(value) < Number(condition.value);

    default:
      return false;
  }
}