import { InventorySupplyChainDemandSignal } from "./inventorySupplyChainTypes";

export function createInventorySupplyChainDemandSignal(input: {
  id: string;
  itemId: string;
  expectedQuantity: number;
  confidence?: number;
  source: string;
  expectedDate: string;
}): InventorySupplyChainDemandSignal {
  return {
    id: input.id,
    itemId: input.itemId,
    expectedQuantity: Math.max(0, input.expectedQuantity),
    confidence: clampScore(input.confidence ?? 0.7),
    source: input.source,
    expectedDate: input.expectedDate,
  };
}

export function aggregateInventorySupplyChainDemand(
  signals: InventorySupplyChainDemandSignal[],
  itemId: string,
): number {
  return signals
    .filter((signal) => signal.itemId === itemId)
    .reduce(
      (total, signal) => total + signal.expectedQuantity * signal.confidence,
      0,
    );
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}