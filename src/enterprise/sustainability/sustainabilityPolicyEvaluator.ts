import { SustainabilityMetric } from "./sustainabilityTypes";
import {
  SustainabilityPolicy,
  SustainabilityPolicyRule,
  isSustainabilityPolicyActive,
} from "./sustainabilityPolicy";

export type SustainabilityPolicyViolation = {
  policyId: string;
  ruleId: string;
  metricId: string;
  message: string;
  value: number;
  threshold?: number;
};

export type SustainabilityPolicyEvaluation = {
  policyId: string;
  passed: boolean;
  violations: SustainabilityPolicyViolation[];
  evaluatedAt: Date;
};

function evaluateRule(
  policy: SustainabilityPolicy,
  rule: SustainabilityPolicyRule,
  metrics: SustainabilityMetric[],
): SustainabilityPolicyViolation[] {
  return metrics
    .filter((metric) => metric.category === rule.category)
    .filter((metric) => {
      const exceedsMax =
        typeof rule.maxValue === "number" && metric.value > rule.maxValue;
      const belowMin =
        typeof rule.minValue === "number" && metric.value < rule.minValue;

      return exceedsMax || belowMin;
    })
    .map((metric) => ({
      policyId: policy.id,
      ruleId: rule.id,
      metricId: metric.id,
      message: rule.message,
      value: metric.value,
      threshold:
        typeof rule.maxValue === "number" ? rule.maxValue : rule.minValue,
    }));
}

export function evaluateSustainabilityPolicy(
  policy: SustainabilityPolicy,
  metrics: SustainabilityMetric[],
): SustainabilityPolicyEvaluation {
  if (!isSustainabilityPolicyActive(policy)) {
    return {
      policyId: policy.id,
      passed: true,
      violations: [],
      evaluatedAt: new Date(),
    };
  }

  const scopedMetrics = metrics.filter((metric) => {
    if (policy.scopeId && metric.scopeId !== policy.scopeId) return false;
    return metric.scope === policy.scope;
  });

  const violations = policy.rules.flatMap((rule) =>
    evaluateRule(policy, rule, scopedMetrics),
  );

  return {
    policyId: policy.id,
    passed: violations.length === 0,
    violations,
    evaluatedAt: new Date(),
  };
}