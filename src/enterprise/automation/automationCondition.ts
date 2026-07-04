import { AutomationCondition } from "./automationTypes";

export function createAutomationCondition(
  field: string,
  operator: AutomationCondition["operator"],
  value?: string | number | boolean,
): AutomationCondition {
  return {
    field,
    operator,
    value,
  };
}

export function evaluateAutomationCondition(
  condition: AutomationCondition,
  actualValue: unknown,
): boolean {
  switch (condition.operator) {
    case "equals":
      return actualValue === condition.value;

    case "notEquals":
      return actualValue !== condition.value;

    case "contains":
      return (
        typeof actualValue === "string" &&
        typeof condition.value === "string" &&
        actualValue.includes(condition.value)
      );

    case "greaterThan":
      return (
        typeof actualValue === "number" &&
        typeof condition.value === "number" &&
        actualValue > condition.value
      );

    case "lessThan":
      return (
        typeof actualValue === "number" &&
        typeof condition.value === "number" &&
        actualValue < condition.value
      );

    case "exists":
      return actualValue !== undefined && actualValue !== null;

    default:
      return false;
  }
}