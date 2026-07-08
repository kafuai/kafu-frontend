import type {
  RevenueMetric,
  RevenueOperationStatus,
} from "./revenueOperationsTypes";

export interface RevenueOperationsSummary {
  id: string;
  status: RevenueOperationStatus;
  totalPipeline: number;
  weightedPipeline: number;
  forecastRevenue: number;
  quotaAttainment: number;
  metrics: RevenueMetric[];
  generatedAt: string;
}

export function createRevenueOperationsSummary(
  summary: RevenueOperationsSummary,
): RevenueOperationsSummary {
  return {
    ...summary,
    generatedAt: new Date().toISOString(),
  };
}
