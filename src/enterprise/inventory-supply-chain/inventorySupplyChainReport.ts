import {
  InventorySupplyChainForecast,
  InventorySupplyChainOrder,
  InventorySupplyChainRisk,
} from "./inventorySupplyChainTypes";

export interface InventorySupplyChainExecutiveReport {
  title: string;
  generatedAt: string;
  summary: string;
  openOrdersCount: number;
  activeRisksCount: number;
  forecastedDemandQuantity: number;
  recommendations: string[];
}

export function buildInventorySupplyChainExecutiveReport(input: {
  openOrders: InventorySupplyChainOrder[];
  risks: InventorySupplyChainRisk[];
  forecasts: InventorySupplyChainForecast[];
  generatedAt?: string;
}): InventorySupplyChainExecutiveReport {
  const forecastedDemandQuantity = input.forecasts.reduce(
    (total, forecast) => total + forecast.forecastQuantity,
    0,
  );

  return {
    title: "Inventory & Supply Chain Executive Report",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    summary:
      input.risks.length > 0
        ? "Inventory and supply chain require active executive attention."
        : "Inventory and supply chain are operating within expected parameters.",
    openOrdersCount: input.openOrders.length,
    activeRisksCount: input.risks.length,
    forecastedDemandQuantity,
    recommendations: buildInventorySupplyChainRecommendations(input.risks),
  };
}

function buildInventorySupplyChainRecommendations(
  risks: InventorySupplyChainRisk[],
): string[] {
  if (risks.length === 0) {
    return ["Maintain current inventory policy and monitor demand signals."];
  }

  return [
    "Review critical stock and supplier risks.",
    "Validate reorder points against current demand forecasts.",
    "Prepare contingency sourcing for high-risk suppliers.",
  ];
}