import type {
  RevenueMetric,
} from "./revenueOperationsTypes";

export interface RevenueDashboard {
  generatedAt: string;
  metrics: RevenueMetric[];
  alerts: string[];
}

export function createRevenueDashboard(
  metrics: RevenueMetric[],
): RevenueDashboard {
  return {
    generatedAt: new Date().toISOString(),
    metrics,
    alerts: [],
  };
}
