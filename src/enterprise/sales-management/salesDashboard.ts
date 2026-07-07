import {
  SalesDeal,
  SalesForecast,
  SalesOrder,
  SalesTarget,
} from "./salesManagementTypes";
import { calculateSalesDealWeightedValue, isSalesDealOpen } from "./salesDeal";
import { isSalesOrderOpen } from "./salesOrder";
import { calculateSalesTargetAttainment } from "./salesTarget";

export interface SalesDashboardSummary {
  openDealsCount: number;
  openOrdersCount: number;
  pipelineWeightedValue: number;
  forecastAmount: number;
  averageForecastConfidence: number;
  averageTargetAttainment: number;
}

export function buildSalesDashboardSummary(input: {
  deals: SalesDeal[];
  orders: SalesOrder[];
  forecasts: SalesForecast[];
  targets: SalesTarget[];
}): SalesDashboardSummary {
  const openDeals = input.deals.filter(isSalesDealOpen);

  return {
    openDealsCount: openDeals.length,
    openOrdersCount: input.orders.filter(isSalesOrderOpen).length,
    pipelineWeightedValue: openDeals.reduce(
      (total, deal) => total + calculateSalesDealWeightedValue(deal),
      0,
    ),
    forecastAmount: input.forecasts.reduce(
      (total, forecast) => total + forecast.forecastAmount,
      0,
    ),
    averageForecastConfidence:
      input.forecasts.length === 0
        ? 0
        : Number(
            (
              input.forecasts.reduce(
                (total, forecast) => total + forecast.confidence,
                0,
              ) / input.forecasts.length
            ).toFixed(2),
          ),
    averageTargetAttainment:
      input.targets.length === 0
        ? 0
        : Number(
            (
              input.targets.reduce(
                (total, target) =>
                  total + calculateSalesTargetAttainment(target),
                0,
              ) / input.targets.length
            ).toFixed(2),
          ),
  };
}