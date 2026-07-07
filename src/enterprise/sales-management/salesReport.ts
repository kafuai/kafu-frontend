import {
  SalesDeal,
  SalesForecast,
  SalesOrder,
  SalesRiskLevel,
} from "./salesManagementTypes";
import { isSalesDealOpen } from "./salesDeal";
import { isSalesOrderOpen } from "./salesOrder";

export interface SalesExecutiveReport {
  title: string;
  generatedAt: string;
  summary: string;
  openDealsCount: number;
  openOrdersCount: number;
  forecastAmount: number;
  riskCount: number;
  recommendations: string[];
}

export interface SalesReportRiskSignal {
  id: string;
  level: SalesRiskLevel;
  title: string;
  description: string;
}

export function buildSalesExecutiveReport(input: {
  deals: SalesDeal[];
  orders: SalesOrder[];
  forecasts: SalesForecast[];
  risks: SalesReportRiskSignal[];
  generatedAt?: string;
}): SalesExecutiveReport {
  const openDealsCount = input.deals.filter(isSalesDealOpen).length;
  const openOrdersCount = input.orders.filter(isSalesOrderOpen).length;
  const forecastAmount = input.forecasts.reduce(
    (total, forecast) => total + forecast.forecastAmount,
    0,
  );

  return {
    title: "Sales Executive Report",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    summary:
      input.risks.length > 0
        ? "Sales performance requires executive attention."
        : "Sales operations are progressing within expected parameters.",
    openDealsCount,
    openOrdersCount,
    forecastAmount,
    riskCount: input.risks.length,
    recommendations: buildSalesRecommendations(input.risks.length),
  };
}

function buildSalesRecommendations(riskCount: number): string[] {
  if (riskCount > 0) {
    return [
      "Review low-probability deals and assign clear next actions.",
      "Validate forecast quality against actual pipeline movement.",
      "Ensure sales orders are progressing toward fulfillment.",
    ];
  }

  return [
    "Maintain pipeline discipline and continue monitoring forecast confidence.",
  ];
}