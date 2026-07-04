import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIDriftObservabilitySummary {
  totalDriftSignals: number;
  averageDriftScore: number;
  highDriftSignals: number;
  maximumDriftScore: number;
}

export function summarizeAIDriftObservability(
  signals: AIObservabilitySignal[],
  highDriftThreshold = 0.3,
): AIDriftObservabilitySummary {
  const driftValues = signals
    .filter((signal) => signal.type === "drift")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  if (driftValues.length === 0) {
    return {
      totalDriftSignals: 0,
      averageDriftScore: 0,
      highDriftSignals: 0,
      maximumDriftScore: 0,
    };
  }

  const totalDrift = driftValues.reduce((total, value) => total + value, 0);

  return {
    totalDriftSignals: driftValues.length,
    averageDriftScore: totalDrift / driftValues.length,
    highDriftSignals: driftValues.filter((value) => value >= highDriftThreshold).length,
    maximumDriftScore: Math.max(...driftValues),
  };
}