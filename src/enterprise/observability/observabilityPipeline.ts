import { ObservabilityConfiguration } from "./observabilityConfiguration";
import {
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";
import {
  validateObservabilityLogEntry,
  validateObservabilityMetric,
  validateObservabilityTraceSpan,
} from "./observabilityValidator";

export type ObservabilityPipelineResult<T> = {
  accepted: boolean;
  signal?: T;
  errors: string[];
};

export function processObservabilityLog(
  log: ObservabilityLogEntry,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityLogEntry> {
  if (!configuration.enabled || !configuration.loggingEnabled) {
    return { accepted: false, errors: ["Logging is disabled."] };
  }

  const validation = validateObservabilityLogEntry(log);

  return {
    accepted: validation.valid,
    signal: validation.valid ? log : undefined,
    errors: validation.errors,
  };
}

export function processObservabilityMetric(
  metric: ObservabilityMetric,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityMetric> {
  if (!configuration.enabled || !configuration.metricsEnabled) {
    return { accepted: false, errors: ["Metrics are disabled."] };
  }

  const validation = validateObservabilityMetric(metric);

  return {
    accepted: validation.valid,
    signal: validation.valid ? metric : undefined,
    errors: validation.errors,
  };
}

export function processObservabilityTrace(
  trace: ObservabilityTraceSpan,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityTraceSpan> {
  if (!configuration.enabled || !configuration.tracingEnabled) {
    return { accepted: false, errors: ["Tracing is disabled."] };
  }

  const validation = validateObservabilityTraceSpan(trace);

  return {
    accepted: validation.valid,
    signal: validation.valid ? trace : undefined,
    errors: validation.errors,
  };
}

export function processObservabilityTelemetry(
  telemetry: ObservabilityTelemetryEvent,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityTelemetryEvent> {
  if (!configuration.enabled || !configuration.telemetryEnabled) {
    return { accepted: false, errors: ["Telemetry is disabled."] };
  }

  return {
    accepted: true,
    signal: telemetry,
    errors: [],
  };
}