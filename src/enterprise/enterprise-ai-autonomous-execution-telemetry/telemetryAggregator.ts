import type { TelemetrySeverity, TelemetrySignal } from "./telemetryTypes";

export interface TelemetryAggregation {
  readonly executionId: string;
  readonly bySeverity: Record<TelemetrySeverity, number>;
  readonly byType: Record<string, number>;
  readonly totalSignals: number;
}

export function aggregateTelemetrySignals(
  executionId: string,
  signals: readonly TelemetrySignal[]
): TelemetryAggregation {
  const relatedSignals = signals.filter((signal) => signal.executionId === executionId);

  return relatedSignals.reduce<TelemetryAggregation>(
    (aggregation, signal) => ({
      executionId,
      totalSignals: aggregation.totalSignals + 1,
      bySeverity: {
        ...aggregation.bySeverity,
        [signal.severity]: aggregation.bySeverity[signal.severity] + 1,
      },
      byType: {
        ...aggregation.byType,
        [signal.type]: (aggregation.byType[signal.type] ?? 0) + 1,
      },
    }),
    {
      executionId,
      totalSignals: 0,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
      byType: {},
    }
  );
}