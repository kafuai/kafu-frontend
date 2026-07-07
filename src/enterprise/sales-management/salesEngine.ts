import {
  SalesDeal,
  SalesForecast,
  SalesOrder,
  SalesPipeline,
  SalesPolicy,
  SalesQuote,
  SalesRiskLevel,
} from "./salesManagementTypes";
import { calculateSalesDealWeightedValue, isSalesDealOpen } from "./salesDeal";
import { generateSalesForecast } from "./salesForecast";
import { isSalesOrderOpen } from "./salesOrder";

export interface SalesEngineInput {
  pipelines: SalesPipeline[];
  deals: SalesDeal[];
  quotes: SalesQuote[];
  orders: SalesOrder[];
  policy: SalesPolicy;
}

export interface SalesRiskSignal {
  id: string;
  dealId?: string;
  pipelineId?: string;
  level: SalesRiskLevel;
  title: string;
  description: string;
  detectedAt: string;
}

export interface SalesEngineResult {
  forecasts: SalesForecast[];
  riskSignals: SalesRiskSignal[];
  openDeals: SalesDeal[];
  openOrders: SalesOrder[];
  pipelineWeightedValue: number;
  generatedAt: string;
}

export function runSalesEngine(input: SalesEngineInput): SalesEngineResult {
  const activePipelines = input.pipelines.filter(
    (pipeline) => pipeline.status === "active",
  );

  const forecasts = activePipelines.map((pipeline) =>
    generateSalesForecast({
      id: `sales-forecast-${pipeline.id}`,
      pipelineId: pipeline.id,
      deals: input.deals,
    }),
  );

  const openDeals = input.deals.filter(isSalesDealOpen);
  const openOrders = input.orders.filter(isSalesOrderOpen);

  return {
    forecasts,
    riskSignals: detectSalesRisks(input),
    openDeals,
    openOrders,
    pipelineWeightedValue: openDeals.reduce(
      (total, deal) => total + calculateSalesDealWeightedValue(deal),
      0,
    ),
    generatedAt: new Date().toISOString(),
  };
}

function detectSalesRisks(input: SalesEngineInput): SalesRiskSignal[] {
  return input.deals
    .filter(
      (deal) =>
        isSalesDealOpen(deal) &&
        deal.probability < input.policy.minimumDealProbability,
    )
    .map((deal) => ({
      id: `sales-risk-deal-${deal.id}`,
      dealId: deal.id,
      pipelineId: deal.pipelineId,
      level: "medium" as SalesRiskLevel,
      title: "Low probability sales deal",
      description: `Deal ${deal.title} is below the minimum probability threshold.`,
      detectedAt: new Date().toISOString(),
    }));
}