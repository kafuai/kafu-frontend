import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIObservabilityStatistics {
  totalSignals: number;
  averageValue: number;
  minimumValue: number;
  maximumValue: number;
}

export function calculateAIObservabilityStatistics(
  signals: AIObservabilitySignal[],
): AIObservabilityStatistics {
  const values = signals
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  if (values.length === 0) {
    return {
      totalSignals: signals.length,
      averageValue: 0,
      minimumValue: 0,
      maximumValue: 0,
    };
  }

  const sum = values.reduce((total, value) => total + value, 0);

  return {
    totalSignals: signals.length,
    averageValue: sum / values.length,
    minimumValue: Math.min(...values),
    maximumValue: Math.max(...values),
  };
}