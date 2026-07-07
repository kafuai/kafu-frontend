import {
  InventorySupplyChainForecast,
  InventorySupplyChainOrder,
  InventorySupplyChainRisk,
  InventorySupplyChainStockRecord,
} from "./inventorySupplyChainTypes";
import { calculateAvailableInventoryQuantity } from "./inventorySupplyChainStock";

export interface InventorySupplyChainDashboardSummary {
  totalItemsTracked: number;
  totalAvailableQuantity: number;
  openOrdersCount: number;
  activeRisksCount: number;
  criticalRisksCount: number;
  forecastedDemandQuantity: number;
}

export function buildInventorySupplyChainDashboardSummary(input: {
  stocks: InventorySupplyChainStockRecord[];
  openOrders: InventorySupplyChainOrder[];
  risks: InventorySupplyChainRisk[];
  forecasts: InventorySupplyChainForecast[];
}): InventorySupplyChainDashboardSummary {
  return {
    totalItemsTracked: new Set(input.stocks.map((stock) => stock.itemId)).size,
    totalAvailableQuantity: input.stocks.reduce(
      (total, stock) => total + calculateAvailableInventoryQuantity(stock),
      0,
    ),
    openOrdersCount: input.openOrders.length,
    activeRisksCount: input.risks.length,
    criticalRisksCount: input.risks.filter((risk) => risk.level === "critical")
      .length,
    forecastedDemandQuantity: input.forecasts.reduce(
      (total, forecast) => total + forecast.forecastQuantity,
      0,
    ),
  };
}