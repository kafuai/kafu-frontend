import { ObservabilityConfiguration } from "./observabilityConfiguration";
import {
  ObservabilityLogEntry,
  ObservabilityMetric,
  ObservabilityTelemetryEvent,
  ObservabilityTraceSpan,
} from "./observabilityTypes";
import {
  ObservabilityPipelineResult,
  processObservabilityLog,
  processObservabilityMetric,
  processObservabilityTelemetry,
  processObservabilityTrace,
} from "./observabilityPipeline";

export function publishObservabilityLog(
  log: ObservabilityLogEntry,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityLogEntry> {
  return processObservabilityLog(log, configuration);
}

export function publishObservabilityMetric(
  metric: ObservabilityMetric,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityMetric> {
  return processObservabilityMetric(metric, configuration);
}

export function publishObservabilityTrace(
  trace: ObservabilityTraceSpan,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityTraceSpan> {
  return processObservabilityTrace(trace, configuration);
}

export function publishObservabilityTelemetry(
  telemetry: ObservabilityTelemetryEvent,
  configuration: ObservabilityConfiguration,
): ObservabilityPipelineResult<ObservabilityTelemetryEvent> {
  return processObservabilityTelemetry(telemetry, configuration);
}