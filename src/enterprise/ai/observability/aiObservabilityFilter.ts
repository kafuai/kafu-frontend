import {
  AIObservabilitySeverity,
  AIObservabilitySignal,
  AIObservabilitySignalType,
} from "./aiObservabilityTypes";

export interface AIObservabilityFilterOptions {
  type?: AIObservabilitySignalType;
  severity?: AIObservabilitySeverity;
  organizationId?: string;
  serviceName?: string;
  environment?: string;
  tag?: string;
}

export function filterAIObservabilitySignals(
  signals: AIObservabilitySignal[],
  options: AIObservabilityFilterOptions,
): AIObservabilitySignal[] {
  return signals.filter((signal) => {
    if (options.type && signal.type !== options.type) {
      return false;
    }

    if (options.severity && signal.severity !== options.severity) {
      return false;
    }

    if (
      options.organizationId &&
      signal.metadata.organizationId !== options.organizationId
    ) {
      return false;
    }

    if (
      options.serviceName &&
      signal.metadata.serviceName !== options.serviceName
    ) {
      return false;
    }

    if (
      options.environment &&
      signal.metadata.environment !== options.environment
    ) {
      return false;
    }

    if (options.tag && !signal.tags.includes(options.tag)) {
      return false;
    }

    return true;
  });
}