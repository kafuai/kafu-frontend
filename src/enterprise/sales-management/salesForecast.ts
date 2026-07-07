import {
  SalesDeal,
  SalesForecast,
} from "./salesManagementTypes";
import { calculateSalesDealWeightedValue, isSalesDealOpen } from "./salesDeal";

export function generateSalesForecast(input: {
  id: string;
  pipelineId: string;
  deals: SalesDeal[];
  horizonDays?: number;
  generatedAt?: string;
}): SalesForecast {
  const openDeals = input.deals.filter(
    (deal) => deal.pipelineId === input.pipelineId && isSalesDealOpen(deal),
  );

  const forecastAmount = openDeals.reduce(
    (total, deal) => total + calculateSalesDealWeightedValue(deal),
    0,
  );

  const confidence =
    openDeals.length === 0
      ? 0
      : openDeals.reduce((total, deal) => total + deal.probability, 0) /
        openDeals.length;

  return {
    id: input.id,
    pipelineId: input.pipelineId,
    forecastAmount,
    confidence: Number(confidence.toFixed(2)),
    horizonDays: input.horizonDays ?? 30,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
  };
}