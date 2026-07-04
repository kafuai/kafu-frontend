import {
  AIObservabilityAlert,
  createAIObservabilityAlert,
} from "./aiObservabilityAlert";
import {
  AIObservabilityAlertRule,
  matchesAIObservabilityAlertRule,
} from "./aiObservabilityAlertRules";
import { AIObservabilitySignal } from "./aiObservabilityTypes";

export function evaluateAIObservabilityAlerts(
  signals: AIObservabilitySignal[],
  rules: AIObservabilityAlertRule[],
): AIObservabilityAlert[] {
  const alerts: AIObservabilityAlert[] = [];

  for (const signal of signals) {
    const matchingRules = rules.filter((rule) =>
      matchesAIObservabilityAlertRule(signal, rule),
    );

    for (const rule of matchingRules) {
      alerts.push(
        createAIObservabilityAlert({
          id: `${rule.id}:${signal.id}`,
          signal,
          title: rule.title,
          description: rule.description,
        }),
      );
    }
  }

  return alerts;
}