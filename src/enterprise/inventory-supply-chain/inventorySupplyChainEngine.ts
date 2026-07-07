import {
  InventorySupplyChainDemandSignal,
  InventorySupplyChainForecast,
  InventorySupplyChainOrder,
  InventorySupplyChainPolicy,
  InventorySupplyChainRisk,
  InventorySupplyChainStockRecord,
  InventorySupplyChainSupplier,
} from "./inventorySupplyChainTypes";
import { generateInventorySupplyChainForecast } from "./inventorySupplyChainForecast";
import {
  detectInventorySupplyChainStockRisks,
  detectInventorySupplyChainSupplierRisks,
} from "./inventorySupplyChainRisk";

export interface InventorySupplyChainEngineInput {
  stocks: InventorySupplyChainStockRecord[];
  suppliers: InventorySupplyChainSupplier[];
  orders: InventorySupplyChainOrder[];
  demandSignals: InventorySupplyChainDemandSignal[];
  policy: InventorySupplyChainPolicy;
}

export interface InventorySupplyChainEngineResult {
  forecasts: InventorySupplyChainForecast[];
  risks: InventorySupplyChainRisk[];
  openOrders: InventorySupplyChainOrder[];
  generatedAt: string;
}

export function runInventorySupplyChainEngine(
  input: InventorySupplyChainEngineInput,
): InventorySupplyChainEngineResult {
  const itemIds = Array.from(
    new Set([
      ...input.stocks.map((stock) => stock.itemId),
      ...input.demandSignals.map((signal) => signal.itemId),
    ]),
  );

  const forecasts = itemIds.map((itemId) =>
    generateInventorySupplyChainForecast({
      id: `forecast-${itemId}`,
      itemId,
      demandSignals: input.demandSignals,
    }),
  );

  const risks = [
    ...detectInventorySupplyChainStockRisks(input.stocks),
    ...detectInventorySupplyChainSupplierRisks(
      input.suppliers,
      input.policy.minimumReliabilityScore,
    ),
  ];

  const openOrders = input.orders.filter(
    (order) => !["received", "cancelled"].includes(order.status),
  );

  return {
    forecasts,
    risks,
    openOrders,
    generatedAt: new Date().toISOString(),
  };
}