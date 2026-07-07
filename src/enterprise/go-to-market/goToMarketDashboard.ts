import { GoToMarketMetricSummary } from "./goToMarketMetrics";
import { GoToMarketPlan } from "./goToMarketTypes";

export interface GoToMarketDashboard {
  planId: string;
  planName: string;
  stage: GoToMarketPlan["stage"];
  status: GoToMarketPlan["status"];
  metrics: GoToMarketMetricSummary;
  lastUpdated: string;
}

export function createGoToMarketDashboard(
  plan: GoToMarketPlan,
  metrics: GoToMarketMetricSummary,
): GoToMarketDashboard {
  return {
    planId: plan.id,
    planName: plan.name,
    stage: plan.stage,
    status: plan.status,
    metrics,
    lastUpdated: new Date().toISOString(),
  };
}