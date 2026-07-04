import {
  MonitoringCheckResult,
  MonitoringMetric,
  MonitoringSeverity,
  MonitoringStatus,
} from "./monitoringTypes";

export type MonitoringAlertCondition =
  | "status_equals"
  | "metric_above"
  | "metric_below";

export type MonitoringAlertRule = {
  id: string;
  name: string;
  severity: MonitoringSeverity;
  condition: MonitoringAlertCondition;
  targetId?: string;
  status?: MonitoringStatus;
  metricName?: string;
  threshold?: number;
  enabled: boolean;
};

export type MonitoringAlert = {
  id: string;
  ruleId: string;
  severity: MonitoringSeverity;
  message: string;
  triggeredAt: Date;
};

export function evaluateMonitoringAlertRules(
  rules: MonitoringAlertRule[],
  checks: MonitoringCheckResult[],
  metrics: MonitoringMetric[],
): MonitoringAlert[] {
  return rules
    .filter((rule) => rule.enabled)
    .flatMap((rule) => evaluateRule(rule, checks, metrics));
}

function evaluateRule(
  rule: MonitoringAlertRule,
  checks: MonitoringCheckResult[],
  metrics: MonitoringMetric[],
): MonitoringAlert[] {
  if (rule.condition === "status_equals") {
    return checks
      .filter((check) => !rule.targetId || check.target.id === rule.targetId)
      .filter((check) => check.status === rule.status)
      .map((check) => ({
        id: `${rule.id}-${check.id}`,
        ruleId: rule.id,
        severity: rule.severity,
        message: `${rule.name}: ${check.message}`,
        triggeredAt: new Date(),
      }));
  }

  return metrics
    .filter((metric) => !rule.targetId || metric.targetId === rule.targetId)
    .filter((metric) => !rule.metricName || metric.name === rule.metricName)
    .filter((metric) =>
      rule.condition === "metric_above"
        ? metric.value > (rule.threshold ?? Number.MAX_SAFE_INTEGER)
        : metric.value < (rule.threshold ?? Number.MIN_SAFE_INTEGER),
    )
    .map((metric) => ({
      id: `${rule.id}-${metric.id}`,
      ruleId: rule.id,
      severity: rule.severity,
      message: `${rule.name}: ${metric.name} is ${metric.value}${metric.unit}`,
      triggeredAt: new Date(),
    }));
}