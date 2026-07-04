import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AICostMetrics {
  totalCostSignals: number;
  totalCost: number;
  averageCostPerSignal: number;
  maximumCost: number;
}

export function calculateAICostMetrics(
  signals: AIObservabilitySignal[],
): AICostMetrics {
  const costValues = signals
    .filter((signal) => signal.type === "cost")
    .map((signal) => signal.value)
    .filter((value): value is number => value !== undefined);

  if (costValues.length === 0) {
    return {
      totalCostSignals: 0,
      totalCost: 0,
      averageCostPerSignal: 0,
      maximumCost: 0,
    };
  }

  const totalCost = costValues.reduce((total, value) => total + value, 0);

  return {
    totalCostSignals: costValues.length,
    totalCost,
    averageCostPerSignal: totalCost / costValues.length,
    maximumCost: Math.max(...costValues),
  };
}