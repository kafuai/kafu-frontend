import {
  InventorySupplyChainDemandSignal,
  InventorySupplyChainForecast,
} from "./inventorySupplyChainTypes";

export function generateInventorySupplyChainForecast(input: {
  id: string;
  itemId: string;
  demandSignals: InventorySupplyChainDemandSignal[];
  horizonDays?: number;
  generatedAt?: string;
}): InventorySupplyChainForecast {
  const relevantSignals = input.demandSignals.filter(
    (signal) => signal.itemId === input.itemId,
  );

  const weightedDemand = relevantSignals.reduce(
    (total, signal) => total + signal.expectedQuantity * signal.confidence,
    0,
  );

  const averageConfidence =
    relevantSignals.length === 0
      ? 0
      : relevantSignals.reduce((total, signal) => total + signal.confidence, 0) /
        relevantSignals.length;

  return {
    id: input.id,
    itemId: input.itemId,
    forecastQuantity: Math.round(weightedDemand),
    confidence: Number(averageConfidence.toFixed(2)),
    horizonDays: input.horizonDays ?? 30,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
  };
}