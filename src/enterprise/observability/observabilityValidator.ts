import {
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTraceSpan,
} from "./observabilityTypes";

export type ObservabilityValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateObservabilityLogEntry(
  log: ObservabilityLogEntry,
): ObservabilityValidationResult {
  const errors: string[] = [];

  if (!log.id) errors.push("Log id is required.");
  if (!log.message) errors.push("Log message is required.");
  if (!log.context.organizationId) errors.push("Organization id is required.");
  if (!log.context.service) errors.push("Service is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateObservabilityMetric(
  metric: ObservabilityMetric,
): ObservabilityValidationResult {
  const errors: string[] = [];

  if (!metric.id) errors.push("Metric id is required.");
  if (!metric.name) errors.push("Metric name is required.");
  if (!Number.isFinite(metric.value)) {
    errors.push("Metric value must be a finite number.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateObservabilityTraceSpan(
  span: ObservabilityTraceSpan,
): ObservabilityValidationResult {
  const errors: string[] = [];

  if (!span.id) errors.push("Trace span id is required.");
  if (!span.traceId) errors.push("Trace id is required.");
  if (!span.name) errors.push("Trace span name is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}