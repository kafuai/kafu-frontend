export type TelemetrySeverity = "low" | "medium" | "high" | "critical";

export type TelemetrySignalType =
  | "execution_started"
  | "execution_completed"
  | "execution_failed"
  | "latency_observed"
  | "resource_usage_observed"
  | "decision_trace_recorded"
  | "policy_signal_detected"
  | "anomaly_signal_detected";

export interface TelemetrySignal {
  readonly id: string;
  readonly executionId: string;
  readonly type: TelemetrySignalType;
  readonly severity: TelemetrySeverity;
  readonly timestamp: string;
  readonly source: string;
  readonly message: string;
  readonly metadata: Record<string, unknown>;
}

export interface TelemetrySummary {
  readonly executionId: string;
  readonly totalSignals: number;
  readonly criticalSignals: number;
  readonly highSignals: number;
  readonly anomalySignals: number;
  readonly latestTimestamp?: string;
}