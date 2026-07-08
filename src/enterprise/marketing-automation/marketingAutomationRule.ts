import { MarketingAutomationRule } from "./marketingAutomationTypes";

export function createMarketingAutomationRule(
  input: MarketingAutomationRule,
): MarketingAutomationRule {
  return {
    ...input,
    name: input.name.trim(),
    trigger: input.trigger.trim(),
    action: input.action.trim(),
  };
}

export function isAutomationRuleRunnable(rule: MarketingAutomationRule): boolean {
  return (
    rule.status === "active" &&
    rule.name.length > 0 &&
    rule.trigger.length > 0 &&
    rule.action.length > 0
  );
}

export function sortAutomationRulesByPriority(
  rules: MarketingAutomationRule[],
): MarketingAutomationRule[] {
  const weight = { low: 1, medium: 2, high: 3, critical: 4 };

  return [...rules].sort((a, b) => weight[b.priority] - weight[a.priority]);
}
