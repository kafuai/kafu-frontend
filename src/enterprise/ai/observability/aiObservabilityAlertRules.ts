import {
  AIObservabilitySeverity,
  AIObservabilitySignal,
  AIObservabilitySignalType,
} from "./aiObservabilityTypes";

export interface AIObservabilityAlertRule {
  id: string;
  organizationId: string;
  type: AIObservabilitySignalType;
  severity?: AIObservabilitySeverity;
  minimumValue?: number;
  maximumValue?: number;
  requiredTag?: string;
  title: string;
  description: string;
  enabled: boolean;
}

export function matchesAIObservabilityAlertRule(
  signal: AIObservabilitySignal,
  rule: AIObservabilityAlertRule,
): boolean {
  if (!rule.enabled) {
    return false;
  }

  if (signal.metadata.organizationId !== rule.organizationId) {
    return false;
  }

  if (signal.type !== rule.type) {
    return false;
  }

  if (rule.severity && signal.severity !== rule.severity) {
    return false;
  }

  if (rule.requiredTag && !signal.tags.includes(rule.requiredTag)) {
    return false;
  }

  if (
    rule.minimumValue !== undefined &&
    (signal.value === undefined || signal.value < rule.minimumValue)
  ) {
    return false;
  }

  if (
    rule.maximumValue !== undefined &&
    (signal.value === undefined || signal.value > rule.maximumValue)
  ) {
    return false;
  }

  return true;
}