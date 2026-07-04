import {
  PerformanceMetricType,
  PerformanceSeverity,
} from "./performanceTypes";

export type OptimizationRule = {
  id: string;
  metricType: PerformanceMetricType;
  severity: PerformanceSeverity;
  recommendation: string;
};

export function findOptimizationRules(
  metricType: PerformanceMetricType,
  rules: OptimizationRule[],
): OptimizationRule[] {
  return rules.filter((rule) => rule.metricType === metricType);
}

export function createOptimizationRule(
  rule: OptimizationRule,
): OptimizationRule {
  return rule;
}